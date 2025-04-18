
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';

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
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600/90 via-blue-500/90 to-indigo-700/90 backdrop-blur-sm z-50 p-4"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block mb-6"
        >
          <SparklesIcon className="w-12 h-12 md:w-16 md:h-16 text-yellow-300/90 animate-pulse" />
        </motion.div>

        <motion.h1
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="font-title text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500 bg-300% animate-gradient-x"
        >
          FGResearch Poker Cards
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/90 text-lg md:text-xl mb-8 italic max-w-md mx-auto px-4"
        >
          Visualize your AIDA research framework with precision and clarity
        </motion.p>
        
        <div className="w-64 md:w-80 lg:w-96 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-white/70 text-sm md:text-base"
        >
          <p className="font-medium">
            Developed by Faiz Nasir
          </p>
          <p className="text-xs md:text-sm mt-1 text-white/50">
            For Academic Research & Professional Analysis
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
