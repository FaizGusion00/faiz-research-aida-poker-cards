
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700 z-50"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="font-title text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500">
            FGResearch Poker Cards
          </span>
        </h1>
        
        <p className="text-white/90 text-lg md:text-xl mb-8 italic">
          Visualize your AIDA research framework
        </p>
        
        <div className="w-64 md:w-80 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-white/70 mt-6 text-sm md:text-base">
          Developed by Faiz Nasir for Academic Research
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
