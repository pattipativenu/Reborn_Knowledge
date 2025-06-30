import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setMessage('Thank you! You\'ll receive updates when our full library is available.');
      setEmail('');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const handleClose = () => {
    if (status !== 'loading') {
      onClose();
      setStatus('idle');
      setMessage('');
      setEmail('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={status === 'loading'}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group disabled:opacity-50"
            >
              <X size={20} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-accent-start to-brand-accent-end rounded-full flex items-center justify-center mb-4 shadow-lg"
              >
                <Mail size={24} className="text-black" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-outfit font-bold text-gray-900 mb-2"
                style={{ color: '#1f2937' }}
              >
                Get the Latest Updates
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 text-sm leading-relaxed font-medium"
                style={{ color: '#374151' }}
              >
                Be the first to know when our full library of premium audiobooks becomes available. Join thousands of learners waiting for the launch!
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setMessage('');
                    }
                  }}
                  placeholder="Enter your email address"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent-start focus:border-brand-accent-start transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 font-medium"
                  style={{ 
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Status Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-2 text-sm font-medium ${
                      status === 'success' 
                        ? 'text-green-700' 
                        : status === 'error'
                        ? 'text-red-700'
                        : 'text-gray-700'
                    }`}
                    style={{
                      color: status === 'success' 
                        ? '#15803d' 
                        : status === 'error'
                        ? '#dc2626'
                        : '#374151'
                    }}
                  >
                    {status === 'success' && <CheckCircle size={16} />}
                    {status === 'error' && <AlertCircle size={16} />}
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group border-2 border-transparent"
                style={{
                  backgroundColor: status === 'success' ? '#10b981' : undefined,
                  background: status === 'success' ? '#10b981' : undefined
                }}
              >
                {status === 'loading' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                    <span className="text-black font-bold">Signing up...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={20} className="text-white" />
                    <span className="text-white font-bold">Success!</span>
                  </>
                ) : (
                  <>
                    <span className="text-black font-bold">Let's go</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-black" />
                  </>
                )}
              </button>
            </motion.form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-600 text-center mt-4 font-medium"
              style={{ color: '#6b7280' }}
            >
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};