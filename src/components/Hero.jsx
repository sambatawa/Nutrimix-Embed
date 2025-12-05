'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export function Hero() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const cards = [
    {
      id: 1,
      title: "Pelet Premium",
      subtitle: "Kualitas Terbaik",
      description: "Formula khusus untuk pertumbuhan ikan yang optimal dan sehat.",
      rating: 5,
      image: "/1.png",
      smallImage: "/2.png",
      number: "01"
    },
    {
      id: 2,
      title: "Pelet Harian",
      subtitle: "Nutrisi Seimbang",
      description: "Pakan seimbang untuk kebutuhan nutrisi harian ikan peliharaan Anda.",
      rating: 4,
      image: "/2.png",
      smallImage: "/3.png",
      number: "02"
    },
    {
      id: 3,
      title: "Pelet Growth",
      subtitle: "Pertumbuhan Cepat",
      description: "Formula khusus untuk mempercepat pertumbuhan ikan dengan aman.",
      rating: 5,
      image: "/3.png",
      smallImage: "/1.png",
      number: "03"
    }
  ];

  const handleDotClick = (index) => {
    setCurrentCard(index);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentCard((prevCard) => (prevCard + 1) % cards.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, cards.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section id="hero" className="pt-20 pb-12 px-4 md:px-6 mt-5"
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="flex flex-col justify-center px-8 md:px-16 py-12 md:py-16">
              <motion.p 
                key={`subtitle-${currentCard}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-sm text-gray-500 mb-6 tracking-widest uppercase"
              >
                {cards[currentCard].subtitle}
              </motion.p>
              
              <motion.h1 
                key={`title-${currentCard}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8" 
                style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '500' }}
              >
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block text-gray-900"
                >
                  {cards[currentCard].title}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block text-[#D4A574] hover:text-[#C17A4F] transition-colors"
                >
                  dengan 
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="block text-gray-900"
                >
                  Formula Terbaik
                </motion.span>
              </motion.h1>

              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.querySelector('#products');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group inline-flex items-center gap-3 text-gray-900 hover:text-[#D4A574] transition-colors mb-8 text-sm tracking-wide cursor-pointer"
              >
                <span>Beli alat Sekarang</span>
                <motion.div 
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:bg-[#D4A574] group-hover:text-white group-hover:border-[#D4A574] transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-2"
              >
                {cards.map((_, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.5 }}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                      index === currentCard 
                        ? 'bg-[#D4A574]' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  ></motion.div>
                ))}
              </motion.div>
            </div>
            <div className="relative min-h-[600px]">
              <motion.div 
                key={`main-image-${currentCard}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute inset-0 bg-linear-to-br from-[#F5E6D3] via-[#F0DCC8] to-[#E8D4C0] lg:rounded-tr-[32px] lg:rounded-br-[32px]"
              >
                <ImageWithFallback
                  src={cards[currentCard].image}
                  alt={cards[currentCard].title}
                  className="w-full h-full object-cover lg:rounded-tr-[32px] lg:rounded-br-[32px]"
                />
              </motion.div>
              <motion.div 
                key={`small-image-${currentCard}`}
                initial={{ opacity: 0, y: -30, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ y: -5, rotate: 5, scale: 1.05 }}
                className="absolute top-8 right-8 bg-white p-2 rounded-xl shadow-xl cursor-pointer"
              >
                <ImageWithFallback
                  src={cards[currentCard].smallImage}
                  alt="Product detail"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </motion.div>
              <motion.div 
                key={`card-${currentCard}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="absolute bottom-8 right-8 bg-white p-5 rounded-2xl shadow-xl max-w-[240px] cursor-pointer hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-gray-900 mb-2" style={{ fontSize: '1.1rem' }}>{cards[currentCard].title}</h3>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.span 
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + star * 0.1 }}
                      whileHover={{ scale: 1.3 }}
                      className={`text-sm ${
                        star <= cards[currentCard].rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {cards[currentCard].description}
                </p>
              </motion.div>
              <motion.div 
                key={`number-${currentCard}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-none" 
                style={{ fontSize: '8rem', lineHeight: '1', fontWeight: '600', color: 'rgba(255,255,255,0.3)' }}
              >
                {cards[currentCard].number}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const App = () => (
    <div className="min-h-screen bg-gray-50 font-sans pt-16">
        <Hero />
    </div>
);

export default App;