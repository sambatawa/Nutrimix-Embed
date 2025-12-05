'use client';

import React from 'react';
import { motion } from 'framer-motion'; 
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Produk: ['Nutrimix', 'Aksesoris', 'Panduan Penggunaan'],
    Layanan: ['Support', 'Garansi', 'Konsultasi Teknis'],
    Perusahaan: ['Tentang Kami', 'Kontak', 'Alamat'],
  };

  return (
    <footer className="bg-gradient-to-b from-[#F5E6D3] via-[#F0DCC8] to-[#E8D4C0] py-16 px-6 border-t border-white/30">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.h3 
              whileHover={{ scale: 1.05 }}
              className="text-gray-900 mb-4 cursor-pointer inline-block" 
              style={{ fontSize: '1.5rem', fontWeight: '600' }}
            >
              Nutrimix
            </motion.h3>
            <p className="text-[#5D4A3C] leading-relaxed mb-6 max-w-md" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              Solusi inovatif untuk produksi pelet ikan berkualitas tinggi. 
              Teknologi modern untuk hasil optimal.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/40 hover:bg-[#D4A574] text-[#5D4A3C] hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/40 hover:bg-[#D4A574] text-[#5D4A3C] hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <Facebook className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/40 hover:bg-[#D4A574] text-[#5D4A3C] hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <Mail className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/40 hover:bg-[#D4A574] text-[#5D4A3C] hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h4 className="text-gray-900 mb-4" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <motion.li key={index}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-[#5D4A3C] hover:text-[#8B5A2B] transition-colors inline-block"
                      style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#5D4A3C]"
          style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
        >
          <p>© 2025 Nutrimix. Semua hak cipta dilindungi</p>
          <div className="flex gap-6">
            <motion.a 
              href="#" 
              whileHover={{ y: -2 }}
              className="hover:text-[#8B5A2B] transition-colors"
            >
              Kebijakan Privasi
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -2 }}
              className="hover:text-[#8B5A2B] transition-colors"
            >
              Syarat & Ketentuan
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -2 }}
              className="hover:text-[#8B5A2B] transition-colors"
            >
              Cookie
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}