import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Github, Apple, Home, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Kata sandi tidak cocok!');
      return;
    }
    
    const validCodes = ['Nutrimix1', 'Nutrimix2', 'Nutrimix3'];
    if (!validCodes.includes(referralCode)) {
      alert('Kode unik tidak valid! Gunakan kode: =Nutrimix1, Nutrimix2, atau Nutrimix3');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Register:', { name, email, password, referralCode });
      alert('Registrasi berhasil!');
      window.location.href = '/';
    }, 2000);
  };

  const socialLogins = [
    { name: 'Google', icon: Chrome, color: 'from-red-500 to-yellow-500' },
    { name: 'GitHub', icon: Github, color: 'from-gray-700 to-gray-900' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => window.location.href = '/'}
        className="absolute top-8 left-8 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all z-10"
      >
        <Home className="w-5 h-5 text-gray-700" />
      </motion.button>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#D4A574]/30 to-[#C17A4F]/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C17A4F]/30 to-[#D4A574]/30 rounded-full blur-3xl"
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center items-center p-12 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C17A4F]/20 to-[#D4A574]/20 rounded-3xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1618044733300-9472054094ee?w=800&q=80"
                alt="Workspace"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <h2 className="text-gray-800 mb-3">Bergabung dengan Kami!</h2>
            <p className="text-gray-600">Daftar untuk memulai perjalanan Anda bersama kami</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-gray-900 mb-2">Daftar</h1>
            <p className="text-gray-600 mb-8">Buat akun baru untuk mengakses semua fitur</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3 mb-8"
          >
            {socialLogins.map((social, index) => (
              <motion.button
                key={social.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all group"
              >
                <social.icon className="w-5 h-5 mx-auto text-gray-600 group-hover:text-gray-900 transition-colors" />
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">ATAU</span>
            <div className="flex-1 h-px bg-gray-300" />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A574] transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#D4A574] focus:ring-4 focus:ring-[#D4A574]/10 transition-all outline-none"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-700 mb-2">Alamat Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A574] transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#D4A574] focus:ring-4 focus:ring-[#D4A574]/10 transition-all outline-none"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A574] transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#D4A574] focus:ring-4 focus:ring-[#D4A574]/10 transition-all outline-none"
                  required
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-gray-700 mb-2">Konfirmasi Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A574] transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi kata sandi Anda"
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#D4A574] focus:ring-4 focus:ring-[#D4A574]/10 transition-all outline-none"
                  autoComplete="new-password"
                  required
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#D4A574] focus:ring-[#D4A574] cursor-pointer"
                  required
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Saya setuju dengan syarat dan ketentuan</span>
              </label>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(212, 165, 116, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#D4A574] to-[#C17A4F] text-white py-3 rounded-xl hover:from-[#C17A4F] hover:to-[#B8734A] transition-all shadow-lg group flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <span>Daftar</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 text-center text-gray-600"
          >
            Sudah punya akun?{' '}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/?login=true"
              className="text-[#D4A574] hover:text-[#C17A4F] inline-block"
            >
              Masuk
            </motion.a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}