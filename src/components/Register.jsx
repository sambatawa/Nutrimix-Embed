'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Github, Apple, Home, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveUserToDatabase } from '../lib/firebase';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForVerification, setIsWaitingForVerification] = useState(false);
  const [pendingKey, setPendingKey] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  useEffect(() => {
    const loadReCaptcha = () => {
      console.log('Environment check:', {
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        windowGrecaptcha: typeof window !== 'undefined' ? window.grecaptcha : 'no window'
      });
      
      if (typeof window !== 'undefined' && !window.grecaptcha) {
        const script = document.createElement('script');
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdRgiIsAAAAAP6kinIy427ULWYE_pK6LN5O-PHN';
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        console.log('reCAPTCHA script loaded with site key:', siteKey);
      }
    };
    loadReCaptcha();
  }, []);

  const handleRecaptcha = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' })
          .then((token) => {
            setRecaptchaToken(token);
          });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Kata sandi tidak cocok!');
      return;
    }
    
    const validDeviceCodes = ['Nutrimix1', 'Nutrimix2', 'Nutrimix3'];
    if (!validDeviceCodes.includes(referralCode)) {
      alert('Kode unik tidak valid! Cek kode di alatmu kembali');
      return;
    }
    
    let token = 'skip-recaptcha';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (window.grecaptcha && window.grecaptcha.execute) {
      try {
        console.log('Getting reCAPTCHA token...');
        console.log('grecaptcha methods:', Object.getOwnPropertyNames(window.grecaptcha));
        
        token = await new Promise((resolve, reject) => {
          const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdRgiIsAAAAAP6kinIy427ULWYE_pK6LN5O-PHN';
          console.log('Executing reCAPTCHA with site key:', siteKey);
          
          window.grecaptcha.ready(() => {
            console.log('reCAPTCHA is ready');
            window.grecaptcha.execute(siteKey, { action: 'submit' })
              .then(token => {
                console.log('reCAPTCHA token generated, length:', token.length);
                resolve(token);
              })
              .catch(error => {
                console.error('reCAPTCHA execute error:', error);
                reject(error);
              });
          });
        });
        
        setRecaptchaToken(token);
        console.log('reCAPTCHA token obtained:', token ? 'success' : 'failed');
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        token = 'skip-recaptcha';
      }
    } else {
      console.log('reCAPTCHA not loaded or not ready', {
        grecaptcha: !!window.grecaptcha,
        execute: !!(window.grecaptcha && window.grecaptcha.execute)
      });
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: 'Pendaftaran Baru Nutrimix',
          message: `User ${name} dengan email ${email} dan kode unik ${referralCode} ingin mendaftar`,
          password,
          referralCode,
          token: token
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.requiresLinkVerification) {
        setIsWaitingForVerification(true);
        setPendingKey(data.pendingKey);
        setVerificationStatus('pending');
        
        startVerificationPolling(data.pendingKey);
      } else {
        throw new Error(data.message || 'Gagal mengirim email verifikasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const startVerificationPolling = (key) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/validation?key=' + key);
        const data = await response.json();
        
        if (data.verified) {
          clearInterval(pollInterval);
          setVerificationStatus('verified');
          
          await saveUserToDatabase({
            name,
            email,
            password,
            referralCode,
            createdAt: new Date().toISOString(),
            isActive: true
          });
          
          alert('Registrasi berhasil! Akun Anda telah dibuat.');
          window.location.href = '/login';
        } else if (data.expired) {
          clearInterval(pollInterval);
          setVerificationStatus('expired');
          alert('Link verifikasi telah kadaluarsa. Silakan coba lagi.');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
    
    setTimeout(() => {
      clearInterval(pollInterval);
      if (verificationStatus === 'pending') {
        setVerificationStatus('timeout');
      }
    }, 300000);
  };

  const socialLogins = [];

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

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:flex flex-col justify-center items-center p-12 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-[#C17A4F]/20 to-[#D4A574]/20 rounded-3xl blur-2xl" />
              <img
                src="1.png"
                alt="Main Facility"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              <motion.img
                src="2.png"
                alt="Equipment"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="absolute -top-4 -left-4 w-20 h-20 object-cover drop-shadow-lg rounded-xl"
              />
              <motion.img
                src="3.png"
                alt="Production"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="absolute -bottom-4 -right-4 w-24 h-24 object-cover drop-shadow-lg rounded-xl"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 w-full"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="absolute inset-0">
                <img 
                  src="/1.png" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0"></div>
              </div>
              <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl shadow-white/30">
                <h2 className="text-white mb-3 font-bold text-center text-2xl bg-linear-to-r from-white to-gray-200 bg-clip-text drop-shadow-lg">Bergabung dengan Kami!</h2>
                <p className="text-white mb-4 text-sm leading-relaxed font-medium drop-shadow-md">Platform modern produksi pelet ikan terintegrasi dengan teknologi terkini untuk hasil optimal</p>
                
                <div className="space-y-3">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-start gap-3 bg-white/10 backdrop-blur-lg rounded-lg p-2 border border-white/40 hover:bg-white/20 transition-all"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-gray-400 rounded-full shadow-lg"
                    />
                    <span className="text-sm text-white font-medium drop-shadow-sm">Analisis komposisi nutrisi pelet</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-start gap-3 bg-white/10 backdrop-blur-lg rounded-lg p-2 border border-white/40 hover:bg-white/20 transition-all"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      className="w-2 h-2 bg-gray-400 rounded-full shadow-lg"
                    />
                    <span className="text-sm text-white font-medium drop-shadow-sm">Monitoring real-time kualitas produksi</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-start gap-3 bg-white/10 backdrop-blur-lg rounded-lg p-2 border border-white/40 hover:bg-white/20 transition-all"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      className="w-2 h-2 bg-gray-400 rounded-full shadow-lg"
                    />
                    <span className="text-sm text-white font-medium drop-shadow-sm">Processing via web pembuatan pakan ikan</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center p-8 md:p-12 bg-white/15 backdrop-blur-3xl rounded-3xl border border-white/25 shadow-2xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className=" font-bold mb-2 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl">Daftar</h1>
            <p className="text-gray-700 mb-8 font-medium drop-shadow-sm">Buat akun baru untuk mengakses semua fitur premium</p>
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
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-gray-700 mb-2">Kode Unik</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A574] transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Masukkan kode unik dari alat"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#D4A574] focus:ring-4 focus:ring-[#D4A574]/10 transition-all outline-none"
                  required
                />
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

            <div className="g-recaptcha" 
                 data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                 data-size="invisible"
            />

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
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
                  <span>Daftar</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Verification Waiting UI */}
          {isWaitingForVerification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-8 bg-linear-to-br from-[#D4A574]/10 to-[#C17A4F]/10 rounded-2xl border border-[#D4A574]/20 backdrop-blur-sm shadow-lg"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 border-4 border-[#D4A574]/30 border-t-[#D4A574] rounded-full mx-auto mb-6 shadow-lg"
                />
                <h3 className="text-xl font-bold bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent mb-3">
                  {verificationStatus === 'pending' && 'Menunggu Verifikasi Email...'}
                  {verificationStatus === 'verified' && 'Email Terverifikasi!'}
                  {verificationStatus === 'expired' && 'Link Kadaluarsa'}
                  {verificationStatus === 'timeout' && 'Timeout'}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {verificationStatus === 'pending' && 
                    `Kami telah mengirim link verifikasi ke ${email}. Silakan cek inbox dan klik link untuk melanjutkan.`}
                  {verificationStatus === 'verified' && 'Akun Anda sedang dibuat...'}
                  {verificationStatus === 'expired' && 'Link verifikasi telah kadaluarsa. Silakan coba lagi.'}
                  {verificationStatus === 'timeout' && 'Waktu verifikasi habis. Silakan coba lagi.'}
                </p>
                {verificationStatus === 'pending' && (
                  <div className="space-y-3">
                    <div className="w-full bg-linear-to-r from-[#D4A574]/20 to-[#C17A4F]/20 rounded-full h-3 overflow-hidden">
                      <motion.div
                        animate={{ width: ['0%', '60%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] rounded-full shadow-sm"
                      />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Link berlaku selama 24 jam</p>
                  </div>
                )}
                {(verificationStatus === 'expired' || verificationStatus === 'timeout') && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(212, 165, 116, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsWaitingForVerification(false);
                      setVerificationStatus('');
                    }}
                    className="px-8 py-3 bg-linear-to-r from-[#D4A574] to-[#C17A4F] text-white rounded-xl hover:from-[#C17A4F] hover:to-[#B8734A] transition-all shadow-lg font-medium"
                  >
                    Coba Lagi
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 text-center text-gray-600"
          >
            Sudah punya akun?{' '}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/login"
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