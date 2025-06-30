import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from '@/components/ui/typewriter';
import { FlowButton } from '@/components/ui/flow-button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from './Navbar';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const loopingWords = [t('hero.listen'), t('hero.imagine'), t('hero.become')];

  const handleStartLearning = () => {
    navigate('/my-library');
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-brand-dark-bg">
      {/* Fixed Navbar */}
      <Navbar isInteractive={true} />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage:      'url(https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets/hero/HB.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.3) 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-30 flex-1 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Hero Loop Word */}
          <motion.div 
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 70, damping: 18 }}
            className="mb-6 sm:mb-8 flex flex-col items-center justify-center relative"
            style={{ 
              minHeight: 'clamp(6rem, 15vw, 12rem)', // Increased from clamp(4rem, 10vw, 8rem)
              marginBottom: 'clamp(2rem, 5vw, 3rem)',
              zIndex: 50
            }}
          >
            <Typewriter
              texts={loopingWords}
              typingSpeed={120}
              deletingSpeed={80}
              pauseDuration={2000}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-outfit font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #fece0a 0%, #fece0a 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 8s linear infinite'
              }}
              showCursor={false}
              loop={true}
            />
          </motion.div>

          {/* Hero Heading (H1) */}
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 70, damping: 18 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-outfit font-bold text-brand-dark-text leading-tight">
              {t('hero.title')}
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.div 
            className="mb-8 sm:mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 70, damping: 18 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl font-manrope text-brand-dark-text max-w-4xl mx-auto px-4">
              "{t('hero.subtitle')}"
            </p>
          </motion.div>

          {/* Centered Call to Action Button */}
          <motion.div 
            className="flex justify-center px-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 70, damping: 18 }}
          >
            <FlowButton 
              text={t('hero.startLearning')}
              onClick={handleStartLearning}
              className="w-full sm:w-auto min-w-48 text-sm sm:text-base"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;