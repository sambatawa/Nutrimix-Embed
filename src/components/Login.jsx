'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Github, Apple, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = ['/2.png', '/1.png', '/3.png'];
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (email && password.length >= 6) {
        console.log('Login successful:', { email });
        
        document.cookie = 'isAuthenticated=true; path=/; max-age=86400';
        document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=86400`;
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        
        router.push(redirectUrl || '/dashboard');
      } else {
        setError('Email atau kata sandi salah. Silakan coba lagi.');
        console.log('Login failed:', { email, password });
      }
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => window.location.href = '/'}
        className="fixed top-5 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all z-9999 border-2 border-white/50"
      >
        <Home className="w-5 h-5 text-[#C17A4F]" />
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
        className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-[#D4A574]/30 to-[#C17A4F]/30 rounded-full blur-3xl"
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
        className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-br from-[#C17A4F]/30 to-[#D4A574]/30 rounded-full blur-3xl"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-1000">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center items-center p-12 rounded-3xl relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-[#C17A4F]/20 to-[#D4A574]/20 rounded-3xl blur-2xl" />
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-repeat" style={{ backgroundImage: "url('/1.png')", backgroundSize: "100px", backgroundPosition: "center", filter: "blur(2px)" }} />
              </div>
              <img
                src="/2.png"
                alt="Workspace"
                className="relative rounded-3xl shadow-lg w-full h-[500px] object-cover"
              />
              <motion.img
                src="/3.png"
                alt="Ikan"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="absolute -bottom-4 -right-4 w-24 h-24 object-cover drop-shadow-lg rounded-xl"
              />
              <motion.img
                src="/1.png"
                alt="Ikan"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="absolute -top-4 -left-4 w-20 h-20 object-cover drop-shadow-lg rounded-xl"
              />
            </div>
          </motion.div>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-bold text-3xl bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text mb-2">Masuk</h1>
            <p className="text-gray-600 mb-8">Masukkan kredensial Anda untuk mengakses akun</p>
          </motion.div>


          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
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
              transition={{ delay: 0.6 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Ingat saya!</span>
              </label>
              <motion.a
                whileHover={{ x: 3 }}
                href="#"
                className="text-sm text-[#D4A574] hover:text-[#C17A4F] transition-colors"
              >
                Lupa kata sandi?
              </motion.a>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(212, 165, 116, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] text-white py-3 rounded-xl hover:from-[#C17A4F] hover:to-[#B8734A] transition-all shadow-lg group flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center text-gray-600"
          >
            Belum punya akun?{' '}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/register"
              className="text-[#D4A574] hover:text-[#C17A4F] inline-block"
            >
              Daftar
            </motion.a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
