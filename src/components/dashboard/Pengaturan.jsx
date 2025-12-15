"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Camera, Mail, Phone, MapPin, Calendar, X, AlertTriangle, Bug, MessageSquare, Send, ChevronDown } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import { ref, get, db } from '@/lib/firebase';
import { updateUserProfile } from '@/lib/firebase';

function CustomDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  
  const getColorClasses = (color) => {
    const colorMap = {
      low: 'bg-[#EDE6DF]/30 text-[#6C5F57] border-[#D4A574]/50',
      medium: 'bg-[#D4A574]/20 text-[#6C5F57] border-[#D4A574]/60',
      high: 'bg-[#D4A574]/40 text-white border-[#D4A574]/70',
      urgent: 'bg-[#6C5F57]/80 text-white border-[#6C5F57]'
    };
    return colorMap[color] || colorMap.medium;
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorClasses(selectedOption?.color || 'medium')}`}>
            {selectedOption?.label || 'Pilih Prioritas'}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#6C5F57] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#EDE6DF]/30 overflow-hidden"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#EDE6DF]/30 transition-colors duration-200 text-left ${
                  value === option.value ? 'bg-[#EDE6DF]/20' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  option.color === 'low' ? 'bg-[#EDE6DF]' :
                  option.color === 'medium' ? 'bg-[#D4A574]' :
                  option.color === 'high' ? 'bg-[#D4A574]' :
                  'bg-[#6C5F57]'
                }`} />
                <span className="font-medium text-[#6C5F57]">{option.label}</span>
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-[#6C5F57] rounded-full flex items-center justify-center ml-auto"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pengaturan() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const [profile, setProfile] = useState({
    name: 'Pengguna',
    email: '',
    phone: '',
    address: '',
    joinDate: ''
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [issueForm, setIssueForm] = useState({
    type: '',
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;
        const adminsRef = ref(db, 'admins');
        const adminSnapshot = await get(adminsRef);
        
        if (adminSnapshot.exists()) {
          const admins = adminSnapshot.val();
          const admin = Object.values(admins).find(u => u.email === userEmail);
          if (admin) {
            setProfile({
              name: admin.name || 'Pengguna',
              email: admin.email || userEmail,
              phone: admin.phone || '',
              address: admin.address || '',
              joinDate: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : ''
            });
            return;
          }
        }
        const usersRef = ref(db, 'users');
        const userSnapshot = await get(usersRef);

        if (userSnapshot.exists()) {
          const users = userSnapshot.val();
          const user = Object.values(users).find(u => u.email === userEmail);
          if (user) {
            setProfile({
              name: user.name || 'Pengguna',
              email: user.email || userEmail,
              phone: user.phone || '',
              address: user.address || '',
              joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : ''
            });
          }
        }
      } catch {}
    };
    
    fetchUserData();
  }, [mounted]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'issues', label: 'Laporan Masalah', icon: AlertTriangle }
  ];

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('User email tidak ditemukan');
        return;
      }

      const profileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      };

      const success = await updateUserProfile(userEmail, profileData);
      
      if (success) {
        alert('Profile berhasil diperbarui!');
        setIsEditingProfile(false);
      } else {
        alert('User tidak ditemukan di database');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal memperbarui profile. Silakan coba lagi.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="w-full">
      <DashboardHeader />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#6C5F57] mb-2">Pengaturan</h1>
        <p className="text-[#7d6f66]">Kelola profile dan preferensi akun Anda</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-[#EDE6DF]/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 ${
                    activeTab === tab.id
                      ? 'bg-[#6C5F57] text-white shadow-lg'
                      : 'text-[#6C5F57] hover:bg-[#EDE6DF]/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-[#EDE6DF]/30"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-[#6C5F57]">Profile Saya</h2>
                  {!isEditingProfile && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-[#6C5F57] text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>
                
                {!isEditingProfile ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-[#EDE6DF] rounded-full flex items-center justify-center">
                          <User className="w-12 h-12 text-[#6C5F57]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#6C5F57]">{profile.name}</h3>
                        <p className="text-[#7d6f66]">{profile.email}</p>
                        <p className="text-sm text-[#7d6f66] mt-1">Bergabung sejak {profile.joinDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/30 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Nama Lengkap</label>
                        <p className="text-[#6C5F57]">{profile.name || '-'}</p>
                      </div>
                      
                      <div className="bg-white/30 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Email</label>
                        <p className="text-[#6C5F57]">{profile.email || '-'}</p>
                      </div>
                      
                      <div className="bg-white/30 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Telepon</label>
                        <p className="text-[#6C5F57]">{profile.phone || '-'}</p>
                      </div>
                      
                      <div className="bg-white/30 p-4 rounded-xl">
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Alamat</label>
                        <p className="text-[#6C5F57]">{profile.address || '-'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-[#EDE6DF] rounded-full flex items-center justify-center">
                          <User className="w-12 h-12 text-[#6C5F57]" />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-0 right-0 bg-[#6C5F57] text-white p-2 rounded-full shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#6C5F57]">{profile.name}</h3>
                        <p className="text-[#7d6f66]">{profile.email}</p>
                        <p className="text-sm text-[#7d6f66] mt-1">Bergabung sejak {profile.joinDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Nama Lengkap</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7d6f66]" />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Telepon</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7d6f66]" />
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Alamat</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7d6f66]" />
                          <input
                            type="text"
                            value={profile.address}
                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Batal
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="bg-[#6C5F57] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#6C5F57] mb-6">Pengaturan Notifikasi</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#6C5F57]">Notifikasi Email</h3>
                      <p className="text-sm text-[#7d6f66]">Terima update dan penawaran melalui email</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                        notifications.email ? 'bg-[#6C5F57]' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: notifications.email ? 24 : 0 }}
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#6C5F57]">Notifikasi Push</h3>
                      <p className="text-sm text-[#7d6f66]">Terima notifikasi langsung di browser</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNotifications({...notifications, push: !notifications.push})}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                        notifications.push ? 'bg-[#6C5F57]' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: notifications.push ? 24 : 0 }}
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#6C5F57]">Notifikasi SMS</h3>
                      <p className="text-sm text-[#7d6f66]">Terima update melalui SMS</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                        notifications.sms ? 'bg-[#6C5F57]' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: notifications.sms ? 24 : 0 }}
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#6C5F57] mb-6">Keamanan Akun</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/30 rounded-xl">
                    <h3 className="font-medium text-[#6C5F57] mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-[#7d6f66] mb-4">Tambahkan lapisan keamanan ekstra ke akun Anda</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#D4A574] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Aktifkan 2FA
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#6C5F57] mb-6">Pengajuan Laporan Masalah</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIssueForm({...issueForm, type: 'bug'})}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      issueForm.type === 'bug' 
                        ? 'bg-red-100 border-2 border-red-300' 
                        : 'bg-white/30 border-2 border-transparent hover:bg-white/40'
                    }`}
                  >
                    <Bug className="w-8 h-8 text-red-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Bug/Error</h3>
                    <p className="text-sm text-gray-600">Laporan error atau bug sistem</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIssueForm({...issueForm, type: 'feature'})}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      issueForm.type === 'feature' 
                        ? 'bg-blue-100 border-2 border-blue-300' 
                        : 'bg-white/30 border-2 border-transparent hover:bg-white/40'
                    }`}
                  >
                    <MessageSquare className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Request Fitur</h3>
                    <p className="text-sm text-gray-600">Usulan fitur baru</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIssueForm({...issueForm, type: 'other'})}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      issueForm.type === 'other' 
                        ? 'bg-yellow-100 border-2 border-yellow-300' 
                        : 'bg-white/30 border-2 border-transparent hover:bg-white/40'
                    }`}
                  >
                    <AlertTriangle className="w-8 h-8 text-yellow-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Lainnya</h3>
                    <p className="text-sm text-gray-600">Masalah lainnya</p>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6C5F57] mb-2">Judul Laporan</label>
                    <input
                      type="text"
                      value={issueForm.subject}
                      onChange={(e) => setIssueForm({...issueForm, subject: e.target.value})}
                      placeholder="Masukkan judul laporan"
                      className="w-full px-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6C5F57] mb-2">Prioritas</label>
                    <CustomDropdown
                      value={issueForm.priority}
                      onChange={(value) => setIssueForm({...issueForm, priority: value})}
                      options={[
                        { value: 'low', label: 'Rendah', color: 'low' },
                        { value: 'medium', label: 'Sedang', color: 'medium' },
                        { value: 'high', label: 'Tinggi', color: 'high' },
                        { value: 'urgent', label: 'Mendesak', color: 'urgent' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6C5F57] mb-2">Deskripsi Masalah</label>
                    <textarea
                      value={issueForm.description}
                      onChange={(e) => setIssueForm({...issueForm, description: e.target.value})}
                      placeholder="Jelaskan masalah yang Anda alami secara detail..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsSubmittingIssue(true);
                      setTimeout(() => {
                        setIsSubmittingIssue(false);
                        setIssueForm({ type: '', subject: '', description: '', priority: 'medium' });
                        alert('Laporan berhasil dikirim!');
                      }, 2000);
                    }}
                    disabled={isSubmittingIssue || !issueForm.type || !issueForm.subject || !issueForm.description}
                    className={`w-full px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                      isSubmittingIssue || !issueForm.type || !issueForm.subject || !issueForm.description
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#6C5F57] text-white hover:bg-[#5a4d45] hover:shadow-xl'
                    }`}
                  >
                    {isSubmittingIssue ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Mengirim...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>Kirim Laporan</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;