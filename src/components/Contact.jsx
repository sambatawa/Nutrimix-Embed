'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categories = ['Kolaborasi', 'Kerjasama', 'Bisnis', 'Produk'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(`
        Nama: ${formData.name}
        Email: ${formData.email}

        Pesan:
        ${formData.message}

        ---
        Dikirim dari website Nutrimix
            `);
      
      const mailtoLink = `mailto:samtasamara@apps.ipb.ac.id?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Terima kasih! Email client Anda akan terbuka untuk mengirim pesan.');
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-linear-to-br from-[#F5F0EB] via-[#F8F4EF] to-[#FAF6F1] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-[#D4A574]/30 to-[#C17A4F]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-br from-[#C17A4F]/30 to-[#D4A574]/30 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-gray-900 mb-4"
            style={{ fontSize: '3rem', lineHeight: '1.2', fontWeight: '500' }}
          >Hubungi Kami
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Siap untuk memulai proyek Anda? Hubungi kami hari ini dan tim profesional kami akan siap membantu mewujudkan visi Anda.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Informasi Kontak</h3>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#D4A574] to-[#C17A4F] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">samtasamara@apps.ipb.ac.id</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#D4A574] to-[#C17A4F] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Telepon</h4>
                  <p className="text-gray-600">+628-22...</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#D4A574] to-[#C17A4F] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Alamat</h4>
                  <p className="text-gray-600">Sekolah Vokasi IPB</p>
                  <p className="text-gray-600">CR64+5M9, Jl. Kumbang No.14, RT.02/RW.06</p>
                  <p className="text-gray-600">Babakan, Kecamatan Bogor Tengah</p>
                  <p className="text-gray-600">Kota Bogor, Jawa Barat 16128</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#D4A574] to-[#C17A4F] rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Jam Operasional</h4>
                  <p className="text-gray-600">Senin - Jumat: 09:00 - 18:00</p>
                  <p className="text-gray-600">Sabtu: 09:00 - 15:00</p>
                  <p className="text-gray-600">Minggu: Tutup</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Kirim Pesan</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 relative">
                  <span className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent font-semibold">Nama Lengkap</span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-linear-to-r from-[#D4A574] to-[#C17A4F]"
                  />
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-[#D4A574]/10 to-[#C17A4F]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="relative w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-[#D4A574]/30 focus:border-[#D4A574] transition-all bg-white/90 backdrop-blur-sm placeholder-gray-400 hover:border-[#D4A574]/40 shadow-sm hover:shadow-md"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 relative">
                  <span className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent font-semibold">Email</span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-linear-to-r from-[#D4A574] to-[#C17A4F]"
                  />
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-[#D4A574]/10 to-[#C17A4F]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="relative w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-[#D4A574]/30 focus:border-[#D4A574] transition-all bg-white/90 backdrop-blur-sm placeholder-gray-400 hover:border-[#D4A574]/40 shadow-sm hover:shadow-md"
                    placeholder="email@example.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 relative">
                  <span className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent font-semibold">Kategori</span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-linear-to-r from-[#D4A574] to-[#C17A4F]"
                  />
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-[#D4A574]/10 to-[#C17A4F]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  />
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(212, 165, 116, 0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4A574]/50 focus:border-[#D4A574] transition-all bg-white text-left flex items-center justify-between hover:border-[#D4A574] hover:shadow-lg"
                    >
                      <span className={`font-medium transition-colors ${formData.subject ? 'text-gray-900' : 'text-gray-400'}`}>
                        {formData.subject || 'Pilih kategori'}
                      </span>
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-[#D4A574]" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -15, scale: 0.95 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                          style={{ boxShadow: "0 20px 60px rgba(212, 165, 116, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08)" }}
                        >
                          <div className="p-2">
                            {categories.map((category, index) => (
                              <motion.button
                                key={category}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, subject: category }));
                                  setIsDropdownOpen(false);
                                }}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
                                whileHover={{ 
                                  backgroundColor: "linear-gradient(135deg, #F5F0EB 0%, #F8F4EF 100%)",
                                  scale: 1.02,
                                  transition: { duration: 0.2 }
                                }}
                                className="w-full px-4 py-3 text-left rounded-xl transition-all duration-300 group relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-linear-to-r from-[#D4A574]/5 to-[#C17A4F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100" />
                                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                      {category}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-linear-to-r from-[#D4A574]/10 to-[#C17A4F]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                      <div className="w-3 h-3 rounded-full bg-linear-to-r from-[#D4A574] to-[#C17A4F]" />
                                    </div>
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 relative">
                  <span className="bg-linear-to-r from-[#D4A574] to-[#C17A4F] bg-clip-text text-transparent font-semibold">Pesan</span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-linear-to-r from-[#D4A574] to-[#C17A4F]"
                  />
                </label>
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-[#D4A574]/10 to-[#C17A4F]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="relative w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-[#D4A574]/30 focus:border-[#D4A574] transition-all bg-white/90 backdrop-blur-sm placeholder-gray-400 hover:border-[#D4A574]/40 shadow-sm hover:shadow-md resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(212, 165, 116, 0.3), 0 0 0 1px rgba(212, 165, 116, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="relative w-full bg-linear-to-r from-[#D4A574] to-[#C17A4F] text-white py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  animate={{ rotate: isSubmitting ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0, ease: "linear" }}
                  className="relative z-10"
                >
                  <Send className="w-5 h-5" />
                </motion.div>
                <span className="relative z-10 font-medium">{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-10"
                >
                </motion.div>
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Sekolah+Vokasi+IPB,Bogor&z=16&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}