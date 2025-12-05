'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Sponsor() {
  const sponsors = [
    { name: 'Medion', text: 'MEDION' },
    { name: 'Charoen Pokphand', text: 'CHAROEN POKPHAND' },
    { name: 'Japfa', text: 'JAPFA' },
    { name: 'Suri Tani', text: 'SURI TANI' },
    { name: 'Wonokoyo', text: 'WONOKOYO' },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-12 lg:gap-16"
        >
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                color: '#6B7280',
                transition: { duration: 0.2 }
              }}
              className="text-gray-300 hover:text-gray-500 transition-colors text-sm tracking-wider cursor-pointer"
            >
              {sponsor.text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}