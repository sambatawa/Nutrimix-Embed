'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { ref, get, onValue } from 'firebase/database';

export function TankVisualization() {
  const [tankData, setTankData] = useState({
    level: 75,
    temperature: 28,
    ph: 7.2,
    oxygen: 8.5
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to real-time tank data from Firebase
    const tankRef = ref(db, 'tankData');
    
    const unsubscribe = onValue(tankRef, (snapshot) => {
      if (snapshot.exists()) {
        setTankData(snapshot.val());
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getTankColor = (level) => {
    if (level > 80) return 'bg-green-500';
    if (level > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Visualisasi Tank</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tank Level */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Level Air</h3>
          <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
            <motion.div
              className={`absolute bottom-0 w-full ${getTankColor(tankData.level)}`}
              initial={{ height: 0 }}
              animate={{ height: `${tankData.level}%` }}
              transition={{ duration: 1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl">{tankData.level}%</span>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Suhu</span>
              <span className="font-bold text-blue-600">{tankData.temperature}°C</span>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">pH</span>
              <span className="font-bold text-green-600">{tankData.ph}</span>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Oksigen</span>
              <span className="font-bold text-purple-600">{tankData.oxygen} mg/L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700">System Online - Real-time Monitoring</span>
        </div>
      </div>
    </div>
  );
}