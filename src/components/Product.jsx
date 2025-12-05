'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductModal } from './ProductModal';

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    const width = 600;
    const height = 800;
    setImgSrc(`https://placehold.co/${width}x${height}/F0DCC8/613A17?text=Image+Unavailable`);
  };

  useEffect(() => {
    setImgSrc(src); 
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      style={{ objectFit: 'cover' }}
    />
  );
};

export function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="products" className="py-20 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#E8D4C0] via-[#DEC8B5] to-[#D4BFB0] rounded-[32px] overflow-hidden aspect-3/4 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              <ImageWithFallback
                src="/1.png"
                alt="Nutrimix Pro"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <div className="flex flex-col justify-between py-8">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-900 mb-8 tracking-[0.2em] hover:text-[#D4A574] transition-colors duration-300" 
                  style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '500' }}
                >
                  NUTRIMIX PRO
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-lg max-w-2xl mb-8" 
                  style={{ fontSize: '1.125rem', lineHeight: '1.6' }}
                >
                  Solusi inovatif untuk produksi pelet ikan berkualitas tinggi. 
                  Teknologi modern dengan kapasitas optimal untuk hasil terbaik.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4 mb-12"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#1F2937', color: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all text-sm tracking-wide rounded-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    BUY NOW
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide relative group"
                  >
                    MORE INFO
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"
                    ></motion.span>
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-[32px] overflow-hidden aspect-video cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
              >
                <ImageWithFallback
                  src="/2.png"
                  alt="Nutrimix Accessories"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}