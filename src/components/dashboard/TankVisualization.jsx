"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Gauge, Loader } from 'lucide-react';

function TankFillingPage({ isVisible, onClose, formulaName, maxCapacity = 100, totalWeight, deviceData, deviceConnected }) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0); 
  const intervalRef = useRef(null); 
  const handleClose = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsProcessing(false);
    setCurrentLevel(0);
    onClose();
  }, [onClose]);

  const startProcessing = useCallback(() => {
    if (isProcessing || !isVisible) return;

    setIsProcessing(true);
    setCurrentLevel(0);

    intervalRef.current = setInterval(() => {
      setCurrentLevel(prev => {
        const fillRate = 1.5; 
        const newLevel = prev + fillRate;
        
        if (newLevel >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          setTimeout(() => {
            onClose();
            setIsProcessing(false);
          }, 2500);
          
          return 100;
        }
        return newLevel;
      });
    }, 100); 

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVisible, isProcessing, onClose]);

  useEffect(() => {
    setMounted(true);
    let cleanup;

    if (isVisible) {
      cleanup = startProcessing();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsProcessing(false);
      setCurrentLevel(0); 
    }

    return () => {
      if (cleanup) cleanup();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVisible, startProcessing]);

  if (!mounted || !isVisible) return null;

  const getFillStyle = (level) => {
    const blueGradient = 'linear-gradient(to top, #3b82f6 50%, #60a5fa 100%)'; 
    const yellowGradient = 'linear-gradient(to top, #f59e0b 50%, #fcd34d 100%)'; 
    const redGradient = 'linear-gradient(to top, #ef4444 50%, #f87171 100%)'; 

    let background;
    if (level < 30) {
        background = redGradient;
    } else if (level < 70) {
        background = yellowGradient;
    } else {
        background = blueGradient;
    }
    
    return { 
        background,
        boxShadow: `0 0 10px 2px rgba(59, 130, 246, 0.5)` 
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/30 relative mb-6"
        >
          <motion.div 
            onClick={handleClose}
            whileHover={{ 
              scale: 1.1, 
              rotate: 90,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.9, 
              rotate: -90,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              transition: { duration: 0.1 }
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer z-50 transition-all duration-300 border border-white/30"
          >
            <motion.div
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <X className="w-4 h-4 text-[#6C5F57]" />
            </motion.div>
          </motion.div>
            <div className="p-8 flex flex-col items-center relative z-10">
              
              <div className="flex justify-center items-center mb-10 h-72 gap-8">
                
                <div className="w-28 h-full border-4 border-white/40 rounded-b-xl relative overflow-hidden flex flex-col justify-end shadow-inner bg-white/10 backdrop-blur-sm">
                  
                  <motion.div
                    className="w-full relative"
                    style={{ height: `${currentLevel}%`, ...getFillStyle(currentLevel) }}
                    initial={{ height: "0%" }}
                    animate={{ height: `${currentLevel}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  >
                    <div className="absolute top-[-2px] left-0 right-0 h-2 bg-white/30 rounded-full"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span 
                            className={`font-extrabold text-xl drop-shadow-md transition-colors duration-500`}
                            style={{ 
                                color: currentLevel < 50 ? 'white' : '#1f2937' 
                            }}
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: currentLevel > 5 ? 1 : 0.2 }}
                        >
                            {currentLevel.toFixed(0)}%
                        </motion.span>
                    </div>
                  </motion.div>

                  <div className="absolute top-0 left-0 right-0 h-4 border-b-4 border-white/60 bg-white/30 backdrop-blur-md shadow-lg"></div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="text-[#6C5F57] font-bold text-lg flex items-center gap-2">
                      {currentLevel < 100 ? (
                          <div className="flex items-center gap-2">
                              <div className="relative w-5 h-5">
                                  {[...Array(3)].map((_, i) => (
                                      <motion.div
                                          key={i}
                                          className="absolute w-2 h-2 bg-[#D4A574] rounded-full"
                                          initial={{ y: 0, opacity: 0.5, scale: 0.5 }}
                                          animate={{
                                              y: [-5, -15, -5],
                                              opacity: [0.5, 1, 0.5],
                                              scale: [0.5, 1, 0.5],
                                          }}
                                          transition={{
                                              duration: 1.5,
                                              repeat: Infinity,
                                              delay: i * 0.3,
                                              ease: "easeInOut",
                                          }}
                                      />
                                  ))}
                              </div>
                              Sedang mengisi tangki...
                          </div>
                      ) : (
                          <>
                              <CheckCircle className="w-6 h-6 text-green-500" /> Selesai!
                          </>
                      )}
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border border-white/30 shadow-inner">
                      <p className="text-sm text-[#7d6f66] font-semibold">
                          Progress: **{currentLevel.toFixed(1)}%**
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                          Level Cairan: {((currentLevel / 100) * totalWeight).toFixed(2)} / {totalWeight.toFixed(2)} gram
                      </p>
                  </div>

                  {deviceData && (
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border border-white/30 shadow-inner">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${deviceConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-xs text-[#7d6f66] font-semibold">
                          Device: {deviceConnected ? 'Connected' : 'Disconnected'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Power:</span>
                          <span className="text-[#6C5F57] font-semibold ml-1">{deviceData.power || 0}W</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Current:</span>
                          <span className="text-[#6C5F57] font-semibold ml-1">{deviceData.current || 0}A</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Voltage:</span>
                          <span className="text-[#6C5F57] font-semibold ml-1">{deviceData.voltage || 0}V</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Energy:</span>
                          <span className="text-[#6C5F57] font-semibold ml-1">{deviceData.energy || 0}kWh</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TankFillingPage;