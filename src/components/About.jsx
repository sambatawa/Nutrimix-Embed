'use client';
import React from 'react';
import { motion } from 'framer-motion'; 

export function About() {
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-br from-[#F5E6D3] via-[#F0DCC8] to-[#E8D4C0]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-gray-900 mb-6" 
              style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '500' }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="block text-[#D4A574]"
              >
                Tentang
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="block hover:text-[#C17A4F] transition-colors"
              >
                Pelet Ikan
              </motion.span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-sm tracking-widest uppercase mb-8"
            >
              NUTRISI TERBAIK UNTUK BUDIDAYA IKAN ANDA
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-gray-900 text-xl font-semibold mb-3">Formula Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Pelet ikan kami dirancang dengan formula khusus menggunakan bahan-bahan pilihan 
                berkualitas tinggi untuk mendukung pertumbuhan optimal ikan budidaya Anda.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-gray-900 text-xl font-semibold mb-3">Nutrisi Seimbang</h3>
              <p className="text-gray-600 leading-relaxed">
                Mengandung protein, vitamin, dan mineral esensial yang dibutuhkan ikan untuk 
                kesehatan, daya tahan tubuh, dan pertumbuhan yang maksimal.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-gray-900 text-xl font-semibold mb-3">Hasil Terbukti</h3>
              <p className="text-gray-600 leading-relaxed">
                Telah digunakan oleh ribuan pembudidaya ikan di Indonesia dengan hasil 
                pertumbuhan yang lebih cepat dan kualitas ikan yang lebih baik.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}