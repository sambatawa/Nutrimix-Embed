'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductModal } from './ProductModal';
import { Info, Package, Settings, ShoppingCart, Star, Zap, Award, Shield } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

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
              className="bg-transparent rounded-[32px] overflow-hidden aspect-3/4 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              <ImageWithFallback
                src="/1.png"
                alt="Nutrimix"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <div className="h-full flex flex-col justify-between py-8">
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
                  NUTRIMIX
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
                    BELI SINI
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDetails(true)}
                    className="px-8 py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide relative group"
                  >
                    MORE INFO
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"
                    ></motion.span>
                  </motion.button>
                </motion.div>
              </motion.div>
              {/* Dynamic Content Area */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-xl"
              >
                {!showDetails ? (
                  // Show image by default
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-[32px] overflow-hidden aspect-video cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
                  >
                    <ImageWithFallback
                      src="/2.png"
                      alt="Nutrimix Accessories"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                ) : (
                  // Show product details when More Info is clicked
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 h-full bg-gradient-to-br from-gray-50 to-white"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDetails(false)}
                      className="mb-4 w-12 h-12 bg-[#D4A574] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#C17A4F] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </motion.button>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                      {[
                        { id: 'detail', label: 'Detail Produk', icon: Package },
                        { id: 'spec', label: 'Spesifikasi', icon: Settings },
                        { id: 'order', label: 'Cara Pemesanan', icon: ShoppingCart }
                      ].map((tab) => (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 font-medium text-xs rounded-lg transition-all ${
                            activeTab === tab.id
                              ? 'bg-white text-[#D4A574] shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <tab.icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[320px]">
                      {activeTab === 'detail' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#D4A574]" />
                            Detail Produk
                          </h4>
                          {[
                            { step: 1, title: 'Konsultasi', desc: 'Hubungi kami untuk konsultasi kebutuhan' },
                            { step: 2, title: 'Deal & DP', desc: 'Bayar DP 50% dari total harga' },
                            { step: 3, title: 'Produksi', desc: 'Proses produksi mesin 2-3 minggu' },
                            { step: 4, title: 'Pengiriman', desc: 'Pelunasan dan pengiriman ke lokasi' }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-[#D4A574] text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {item.step}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h5>
                                <p className="text-gray-600 text-xs">{item.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === 'spec' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#D4A574]" />
                            Spesifikasi Teknis
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { param: 'Kapasitas', spec: '50-100 kg/jam', icon: '', color: 'from-[#D4A574] to-[#C17A4F]' },
                              { param: 'Power', spec: '5.5 HP / 4 kW', icon: '', color: 'from-[#D4A574] to-[#C17A4F]' },
                              { param: 'Dimensi', spec: '120 x 80 x 150 cm', icon: '', color: 'from-[#D4A574] to-[#C17A4F]' },
                              { param: 'Material', spec: 'Stainless Steel 304', icon: '', color: 'from-[#D4A574] to-[#C17A4F]' }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                              >
                                <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                                  <span className="text-lg">{item.icon}</span>
                                </div>
                                <h5 className="text-xs text-gray-600 font-medium mb-1">{item.param}</h5>
                                <p className="text-sm font-bold text-gray-900">{item.spec}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'order' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-[#D4A574]" />
                            Proses Pemesanan
                          </h4>
                          {[
                            { step: 1, title: 'Konsultasi', desc: 'Hubungi kami untuk konsultasi kebutuhan' },
                            { step: 2, title: 'Deal & DP', desc: 'Bayar DP 50% dari total harga' },
                            { step: 3, title: 'Produksi', desc: 'Proses produksi mesin 2-3 minggu' },
                            { step: 4, title: 'Pengiriman', desc: 'Pelunasan dan pengiriman ke lokasi' }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-[#D4A574] text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {item.step}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h5>
                                <p className="text-gray-600 text-xs">{item.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}