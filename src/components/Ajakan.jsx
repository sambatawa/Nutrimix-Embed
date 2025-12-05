'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, User, Package } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function Ajakan() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRegister = () => {
    router.push('?register=true');
  };

  return (
    <section id="ajakan" className="py-20 px-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80)',
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EB]/90 via-[#F8F4EF]/90 to-[#FAF6F1]/90" />
      <div className="max-w-[1400px] mx-auto relative">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-2xl font-semibold text-gray-900 mb-6"
          >
            Siap Memulai Peternakan Anda?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Dapatkan peralatan Nutrimix terbaik untuk peternakan Anda dan daftar sebagai pengguna 
            untuk mengakses fitur lengkap sistem pembuatan pakan ikan otomatis kami.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRegister}
              className="bg-[#D4A574] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#C17A4F] transition-colors flex items-center justify-center gap-2"
            >
              Beli Alat Sekarang
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRegister}
              className="bg-white border-2 border-[#D4A574] text-[#D4A574] px-8 py-4 rounded-full font-semibold hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-2"
            >
              Daftar Pengguna
              <User className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}