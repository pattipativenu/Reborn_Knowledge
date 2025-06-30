import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Sparkles } from 'lucide-react';

interface NotificationProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  isVisible,
  message,
  type = 'success',
  onClose,
  autoHide = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <CheckCircle size={20} className="text-white" />,
          textColor: 'text-white'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: <X size={20} className="text-white" />,
          textColor: 'text-white'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          icon: <Sparkles size={20} className="text-white" />,
          textColor: 'text-white'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <CheckCircle size={20} className="text-white" />,
          textColor: 'text-white'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.4
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[70] max-w-md w-full mx-4"
        >
          <div className={`${styles.bg} rounded-2xl p-4 shadow-2xl border border-white/20 backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
              >
                {styles.icon}
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`font-medium flex-1 ${styles.textColor}`}
              >
                {message}
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={16} className="text-white" />
              </motion.button>
            </div>
            
            {/* Progress bar for auto-hide */}
            {autoHide && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl origin-left"
                style={{ width: '100%' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};