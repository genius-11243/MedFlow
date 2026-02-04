import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 1],
          opacity: 1,
        }}
        transition={{ 
          duration: 1.5,
          times: [0, 0.5, 1],
          ease: "easeInOut"
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.2,
            repeatDelay: 0.2
          }}
          className="bg-white/20 p-8 rounded-full backdrop-blur-sm border border-white/30 mb-6 shadow-2xl"
        >
          <Activity size={80} className="text-white drop-shadow-lg" strokeWidth={2.5} />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold font-tajawal tracking-wide"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          MedFlow
        </motion.h1>
        <motion.p
          className="text-blue-100 mt-2 font-light text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Better Healthcare
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
