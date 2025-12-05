'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Bagaimana cara kerja alat ini?",
      answer: "Alat ini bekerja dengan mengolah bahan baku menjadi pelet ikan melalui proses yang telah diprogram. Pengguna dapat memilih formula yang tersedia dan mengikuti petunjuk yang muncul di layar LCD."
    },
    {
      question: "Apa saja bahan baku yang bisa digunakan?",
      answer: "Alat ini dapat mengolah berbagai bahan baku seperti tepung beras, kulit telur ayam, dan bahan tambahan lainnya sesuai dengan formula yang telah ditentukan."
    },
    {
      question: "Berapa lama proses pembuatan pelet?",
      answer: "Waktu proses tergantung pada jumlah dan jenis bahan baku. Rata-rata proses memakan waktu antara 15-30 menit untuk satu siklus produksi."
    },
    {
      question: "Bagaimana cara perawatan alat?",
      answer: "Bersihkan alat setelah setiap penggunaan, pastikan komponen kering sebelum disimpan, dan lakukan pengecekan rutin pada bagian-bagian yang bergerak."
    },
    {
      question: "Apakah ada garansi untuk produk ini?",
      answer: "Ya, kami memberikan garansi 1 tahun untuk kerusakan komponen dan 3 bulan untuk suku cadang. Garansi tidak berlaku untuk kerusakan akibat penyalahgunaan."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="pt-20 pb-12 px-4 md:px-6 mt-5">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-[32px]"
        >
          <div className="px-8 md:px-16 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="mb-4 text-center" style={{ 
                fontSize: '3.5rem', 
                lineHeight: '1.1', 
                fontWeight: '500',
                background: 'linear-gradient(90deg, #8B5A2B 0%, #C19A6B 50%, #D4A574 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.025em'
              }}>
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-[#5D4A3C] max-w-2xl mx-auto">
                Temukan jawaban atas pertanyaan umum seputar produk dan layanan kami.
              </p>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <AnimatePresence>
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg- rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none group"
                    >
                      <span className="text-lg font-medium text-[#5D4A3C] group-hover:text-[#8B5A2B] transition-colors">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: openIndex === index ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[#C19A6B] group-hover:text-[#8B5A2B]"
                      >
                        <Plus size={20} />
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0 text-[#5D4A3C]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}