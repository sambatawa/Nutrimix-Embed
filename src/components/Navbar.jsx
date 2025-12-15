'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-white/20' : 'bg-white/60 backdrop-blur-lg border-white/10'} border-b`}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer"
          >
            <h1 className="tracking-[0.2em] text-gray-900" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                Nutrimix
              </h1>
          </motion.div>

          <div className="hidden lg:flex items-center gap-12">
            {[
              { name: 'Beranda', href: '#hero' },
              { name: 'Produk', href: '#products' },
              { name: 'FAQ', href: '#faq' },
              { name: 'Tim', href: '#members' },
              { name: 'Hubungi', href: '#contact'}
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.href.startsWith('#')) {
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  } else {
                    router.push(item.href);
                  }
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3, scale: 1.05 }}
                className="text-gray-700 hover:text-gray-900 transition-all duration-300 text-sm font-medium relative group tracking-wide"
              >
                {item.name}
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-[#D4A574] to-[#C17A4F] group-hover:w-full transition-all duration-500 ease-out"
                  style={{ transform: 'translateY(-2px)' }}
                ></motion.span>
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-gray-900 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/login'}
              className="text-gray-600 hover:text-gray-900 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg"
          >
            <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-3">
              {[
                { name: 'Beranda', href: '#hero' },
                { name: 'Produk', href: '#products' },
                { name: 'FAQ', href: '#faq' },
                { name: 'Tim', href: '#members' },
                { name: 'Hubungi', href: '#contact'}
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.href.startsWith('#')) {
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      router.push(item.href);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-gray-700 hover:text-gray-900 transition-all duration-300 text-sm font-medium py-3 px-4 rounded-lg hover:bg-gray-50 tracking-wide"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}