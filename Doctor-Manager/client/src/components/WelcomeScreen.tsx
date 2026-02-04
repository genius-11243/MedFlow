import { motion } from "framer-motion";
import { CheckCircle, Activity } from "lucide-react";

interface WelcomeScreenProps {
  userName: string;
  onComplete: () => void;
}

export function WelcomeScreen({ userName, onComplete }: WelcomeScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white font-tajawal"
      dir="rtl"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          duration: 0.6 
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-white/20 p-6 rounded-full backdrop-blur-sm border border-white/30 mb-6 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <CheckCircle size={64} className="text-green-300 drop-shadow-lg" strokeWidth={2} />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold tracking-wide mb-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          أهلاً وسهلاً
        </motion.h1>
        
        <motion.p
          className="text-2xl text-blue-100 mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {userName}
        </motion.p>

        <motion.div
          className="flex items-center gap-2 text-blue-200 mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Activity size={20} />
          <span className="text-sm">جاري تحميل لوحة التحكم...</span>
        </motion.div>

        <motion.div
          className="mt-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
        >
          <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
