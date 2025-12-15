"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingCart, Package, DollarSign, AlertCircle, TrendingUp, Search, Download, Eye, Edit, Trash2, Plus, LogOut, Settings, MessageSquare, Beaker } from 'lucide-react';
import { getAllUsers, getUserStats, updateUserStatus, deleteUser, getAllAdmins, addAdmin, deleteAdmin, promoteUserToAdmin, getAllProducts } from '../../lib/firebase';
import ManageProduct from './manageProduct';
import ManageUser from './manageUser';
import ManagePesanan from './managePesanan';
import ManageMenu from './manageMenu';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStock: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', permissions: 'full' });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'menu', label: 'Menu Formula', icon: Beaker },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'admins', label: 'Admin', icon: Settings },
    { id: 'issues', label: 'Laporan Masalah', icon: MessageSquare }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'low-stock': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        const userStats = await getUserStats();
        
        const formattedUsers = usersData.map(user => ({
          id: user.id || user.uniqueCode || 'Unknown',
          name: user.name || user.email?.split('@')[0] || 'Unknown',
          email: user.email || 'unknown@example.com',
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : 'Unknown',
          status: user.status || 'active',
          orders: user.orderCount || 0
        }));
        
        setUsers(formattedUsers);
        
        setStats(prev => ({
          ...prev,
          totalUsers: userStats.totalUsers || usersData.length
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminsData = await getAllAdmins();
        setAdmins(adminsData);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    if (activeTab === 'admins') {
      fetchAdmins();
    }
  }, [activeTab]);

  const handleAddAdmin = async () => {
    try {
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        alert('Mohon lengkapi semua field');
        return;
      }

      await addAdmin(newAdmin);
      const adminsData = await getAllAdmins();
      setAdmins(adminsData);
      
      // Reset form
      setNewAdmin({ name: '', email: '', password: '', permissions: 'full' });
      setShowAddAdminForm(false);
      
      alert('Admin berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Gagal menambahkan admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
      try {
        await deleteAdmin(adminId);
        setAdmins(admins.filter(admin => admin.id !== adminId));
        alert('Admin berhasil dihapus');
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Gagal menghapus admin');
      }
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menjadikan user ini sebagai admin?')) {
      try {
        await promoteUserToAdmin(userId, { permissions: 'full' });
        alert('User berhasil dipromosikan menjadi admin');
        
        const adminsData = await getAllAdmins();
        setAdmins(adminsData);
      } catch (error) {
        console.error('Error promoting user:', error);
        alert('Gagal mempromosikan user');
      }
    }
  };

  return (
    <div className="p-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#6C5F57] mb-2">Admin Dashboard</h1>
        <p className="text-[#7d6f66]">Kelola dan monitor seluruh aktivitas sistem</p>
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
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mt-4 text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Keluar</span>
            </motion.button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-[#EDE6DF]/30"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#6C5F57] mb-6">Ringkasan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-8 h-8 text-[#6C5F57]" />
                      <span className="text-sm text-green-600 font-medium">+12%</span>
                    </div>
                    <p className="text-2xl font-bold text-[#6C5F57]">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-[#7d6f66]">Total Pengguna</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ShoppingCart className="w-8 h-8 text-[#6C5F57]" />
                      <span className="text-sm text-green-600 font-medium">+8%</span>
                    </div>
                    <p className="text-2xl font-bold text-[#6C5F57]">{stats.totalOrders.toLocaleString()}</p>
                    <p className="text-sm text-[#7d6f66]">Total Pesanan</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 text-[#6C5F57]" />
                      <span className="text-sm text-green-600 font-medium">+15%</span>
                    </div>
                    <p className="text-2xl font-bold text-[#6C5F57]">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-sm text-[#7d6f66]">Total Pendapatan</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-8 h-8 text-[#6C5F57]" />
                      <span className="text-sm text-blue-600 font-medium">Stabil</span>
                    </div>
                    <p className="text-2xl font-bold text-[#6C5F57]">{stats.totalProducts}</p>
                    <p className="text-sm text-[#7d6f66]">Total Produk</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <AlertCircle className="w-8 h-8 text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">Perlu Atensi</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-500">{stats.pendingOrders}</p>
                    <p className="text-sm text-[#7d6f66]">Pesanan Pending</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/30 rounded-xl p-4 border border-[#EDE6DF]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-8 h-8 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">Kritikal</span>
                    </div>
                    <p className="text-2xl font-bold text-red-500">{stats.lowStock}</p>
                    <p className="text-sm text-[#7d6f66]">Stok Menipis</p>
                  </motion.div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#6C5F57] mb-4">Pesanan Terbaru</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#EDE6DF]/30">
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Pelanggan</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Produk</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Jumlah</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-[#EDE6DF]/20 hover:bg-white/20">
                            <td className="py-3 px-4 text-sm">{order.id}</td>
                            <td className="py-3 px-4 text-sm">{order.customer}</td>
                            <td className="py-3 px-4 text-sm">{order.product}</td>
                            <td className="py-3 px-4 text-sm font-medium">{formatCurrency(order.amount)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <ManagePesanan />
            )}

            {activeTab === 'products' && (
              <ManageProduct onStatsUpdate={(stats) => setStats(prev => ({ ...prev, ...stats }))} />
            )}

            {activeTab === 'menu' && (
              <ManageMenu />
            )}

            {activeTab === 'users' && (
              <ManageUser />
            )}

            {activeTab === 'admins' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#6C5F57]">Manajemen Admin</h2>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddAdminForm(!showAddAdminForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Admin
                  </motion.button>
                </div>

                {showAddAdminForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/30 rounded-xl p-6 border border-[#EDE6DF]/20"
                  >
                    <h3 className="font-semibold text-[#6C5F57] mb-4">Tambah Admin Baru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Nama</label>
                        <input
                          type="text"
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                          placeholder="Masukkan nama admin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Email</label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                          placeholder="admin@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Password</label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                          placeholder="Masukkan password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#6C5F57] mb-2">Permissions</label>
                        <select
                          value={newAdmin.permissions}
                          onChange={(e) => setNewAdmin({...newAdmin, permissions: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                        >
                          <option value="full">Full Access</option>
                          <option value="readonly">Read Only</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddAdmin}
                        className="px-6 py-2 bg-[#6C5F57] text-white rounded-xl hover:bg-[#5a4e46] transition-colors"
                      >
                        Simpan Admin
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowAddAdminForm(false);
                          setNewAdmin({ name: '', email: '', password: '', permissions: 'full' });
                        }}
                        className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                      >
                        Batal
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#EDE6DF]/30">
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Nama</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Permissions</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Tanggal Dibuat</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-[#7d6f66]">
                            Belum ada data admin
                          </td>
                        </tr>
                      ) : (
                        admins.map((admin) => (
                          <tr key={admin.id} className="border-b border-[#EDE6DF]/20 hover:bg-white/20">
                            <td className="py-3 px-4 text-sm font-medium">{admin.id}</td>
                            <td className="py-3 px-4 text-sm">{admin.name}</td>
                            <td className="py-3 px-4 text-sm">{admin.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                admin.permissions === 'full' ? 'bg-green-100 text-green-800' :
                                admin.permissions === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {admin.permissions}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('id-ID') : 'Unknown'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit Admin"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Hapus Admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#6C5F57] mb-4">Promosikan User ke Admin</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#EDE6DF]/30">
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Nama</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(user => user.status === 'active').slice(0, 5).map((user) => (
                          <tr key={user.id} className="border-b border-[#EDE6DF]/20 hover:bg-white/20">
                            <td className="py-3 px-4 text-sm">{user.name}</td>
                            <td className="py-3 px-4 text-sm">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePromoteToAdmin(user.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                              >
                                Promosikan
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#6C5F57]">Laporan Masalah</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6f66]" />
                      <input
                        type="text"
                        placeholder="Cari laporan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-[#EDE6DF]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6C5F57] focus:border-transparent"
                    >
                      <option value="all">Semua Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#7d6f66]">Total Laporan</span>
                      <MessageSquare className="w-5 h-5 text-[#D4A574]" />
                    </div>
                    <div className="text-2xl font-bold text-[#6C5F57]">24</div>
                    <div className="text-xs text-gray-600 mt-1">Bulan ini</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#7d6f66]">Pending</span>
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-500">8</div>
                    <div className="text-xs text-yellow-600 mt-1">Perlu ditangani</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#7d6f66]">Processing</span>
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-500">5</div>
                    <div className="text-xs text-blue-600 mt-1">Sedang diproses</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-[#EDE6DF]/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#7d6f66]">Resolved</span>
                      <AlertCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-500">11</div>
                    <div className="text-xs text-green-600 mt-1">Selesai</div>
                  </motion.div>
                </div>

                <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border border-[#EDE6DF]/30">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#EDE6DF]/30">
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">User</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Jenis</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Subjek</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Prioritas</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Tanggal</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#6C5F57]">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: '001', user: 'John Doe', type: 'Bug', subject: 'Login tidak berfungsi', priority: 'High', status: 'pending', date: '12 Nov 2024' },
                          { id: '002', user: 'Jane Smith', type: 'Feature', subject: 'Tambah filter produk', priority: 'Medium', status: 'processing', date: '11 Nov 2024' },
                          { id: '003', user: 'Bob Johnson', type: 'Bug', subject: 'Error pada halaman cart', priority: 'High', status: 'resolved', date: '10 Nov 2024' },
                          { id: '004', user: 'Alice Brown', type: 'UI', subject: 'Tampilan mobile kurang responsive', priority: 'Medium', status: 'pending', date: '09 Nov 2024' },
                          { id: '005', user: 'Charlie Wilson', type: 'Performance', subject: 'Loading terlalu lambat', priority: 'Low', status: 'processing', date: '08 Nov 2024' },
                        ].map((issue) => (
                          <tr key={issue.id} className="border-b border-[#EDE6DF]/20 hover:bg-white/20">
                            <td className="py-3 px-4 text-sm font-medium">{issue.id}</td>
                            <td className="py-3 px-4 text-sm">{issue.user}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                issue.type === 'Bug' ? 'bg-red-100 text-red-800' :
                                issue.type === 'Feature' ? 'bg-blue-100 text-blue-800' :
                                issue.type === 'UI' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {issue.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">{issue.subject}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                                issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {issue.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                                {issue.status === 'pending' ? 'Pending' :
                                 issue.status === 'processing' ? 'Processing' : 'Resolved'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">{issue.date}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Lihat Detail"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Edit Status"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Hapus Laporan"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}