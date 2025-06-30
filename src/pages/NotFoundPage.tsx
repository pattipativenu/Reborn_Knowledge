import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Glitchy404 } from '@/components/ui/glitchy-404-1';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [textColor, setTextColor] = useState('#000'); // Default to black

  useEffect(() => {
    // Determine text color based on current theme
    const updateTextColor = () => {
      if (document.documentElement.classList.contains('dark')) {
        setTextColor('#fff'); // White for dark mode
      } else {
        setTextColor('#000'); // Black for light mode
      }
    };

    // Initial check
    updateTextColor();

    // Listen for theme changes (if any global theme switcher modifies the class)
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          updateTextColor();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light-bg text-brand-light-text p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <Glitchy404 width={800} height={232} color={textColor} />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold mt-8 mb-4" style={{ color: textColor }}>
          Page Not Found
        </h1>
        <p className="text-lg sm:text-xl text-brand-muted-text mb-8">
          The page you are looking for does not exist.
        </p>
        <motion.button
          onClick={handleGoHome}
          className="px-8 py-3 bg-brand-accent-start text-black rounded-full font-medium hover:bg-brand-accent-end transition-colors shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;