'use client';

import { useScroll, useTransform, motion, MotionValue, useMotionValue, useSpring } from 'framer-motion';
import React, { useRef, useCallback } from 'react';
import { Typewriter } from '@/components/ui/typewriter';
import { FlowButton } from '@/components/ui/flow-button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from './Navbar';
import CardSwap, { Card } from '@/components/ui/card-swap';

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

const HeroSection: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const loopingWords = [t('hero.listen'), t('hero.imagine'), t('hero.become')];
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform mouse position to background translation (smaller range for subtlety)
  const bgTranslateX = useTransform(springX, [-1, 1], [-20, 20]);
  const bgTranslateY = useTransform(springY, [-1, 1], [-20, 20]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate mouse position relative to center, normalized to -1 to 1
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleStartLearning = () => {
    navigate('/my-library');
  };

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  
  // Navbar animation: smoothly scroll up as user starts scrolling
  const navbarY = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, -50, -100]);

  return (
    <motion.div 
      ref={heroRef}
      style={{ scale, rotate }}
      className="sticky top-0 h-screen w-full flex flex-col overflow-hidden bg-brand-dark-bg"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Navbar - smoothly scrolls up */}
      <motion.div
        style={{ 
          y: navbarY
        }}
        className="relative z-50"
      >
        <Navbar isInteractive={true} />
      </motion.div>
      
      {/* Background Image with Magnetic Effect */}
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://storage.googleapis.com/reborn_knowledge/images/hero-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          scale: 1.05, // Slight scale to prevent edge gaps
          x: bgTranslateX,
          y: bgTranslateY,
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
    </motion.div>
  );
};

const HowItWorksSection: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const { t } = useLanguage();
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);
  
  // Navbar animation: slide down from top when "How It Works" section reaches 100% at top
  const navbarY = useTransform(scrollYProgress, [0.8, 1], [-100, 0]);

  const cardData = [
    {
      heading: t('howItWorks.pickBook'),
      paragraph: t('howItWorks.pickBookDesc'),
      videoUrl: "https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets/how_reborn_works/select_book.mp4"
    },
    {
      heading: t('howItWorks.listenInteract'), 
      paragraph: t('howItWorks.listenInteractDesc'),
      videoUrl: "https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets/how_reborn_works/listen.mp4"
    },
    {
      heading: t('howItWorks.testGrow'),
      paragraph: t('howItWorks.testGrowDesc'),
      videoUrl: "https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets/how_reborn_works/quiz.mp4"
    }
  ];

  return (
    <motion.div 
      style={{ scale, rotate }}
      className="relative min-h-screen bg-brand-light-bg overflow-hidden flex flex-col"
    >
      {/* Animated Navbar for How It Works section - slides down when section reaches 100% */}
      <motion.div
        style={{ 
          y: navbarY
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <Navbar isInteractive={true} backgroundColor="#eeede9" />
      </motion.div>

      {/* Grid background behind the heading - positioned to start from top */}
      <div className='absolute top-0 left-0 right-0 h-[50vh] sm:h-[60vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 relative z-10">
        <div className="max-w-7xl w-full">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            
            {/* Left Side - Section Title and Body Text */}
            <motion.div 
              className="flex flex-col justify-center text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Section Title (H2) */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-light-text mb-6 sm:mb-8">
                {t('howItWorks.title')}
              </h2>
              
              {/* Body Text */}
              <p className="text-base sm:text-lg font-manrope text-brand-muted-text max-w-lg mx-auto lg:mx-0">
                "Transform your downtime into meaningful learning moments—our three-step system makes it effortless."
              </p>
            </motion.div>
  
            {/* Right Side - Card Stack with CardSwap Animation */}
            <motion.div 
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <CardSwap
                  width={480}
                  height={380}
                  cardDistance={40}
                  verticalDistance={45}
                  delay={4000}
                  pauseOnHover={true}
                  easing="power"
                >
                  {cardData.map((card, index) => (
                    <Card key={index} className="brand-card">
                      <div className="relative h-full w-full overflow-hidden bg-white rounded-[1.5rem]">
                        {/* Background Video - Perfectly centered without cutting borders */}
                        <video
                          className="absolute inset-0 w-full h-full object-contain"
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            borderRadius: '1.5rem', 
                            backgroundColor: '#ffffff'
                          }}
                        >
                          <source src={card.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        
                        {/* Content Overlay - Positioned for perfect centering */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-[1.5rem]">
                          <div className="brand-card-overlay rounded-[1rem]">
                            <h3 className="text-lg sm:text-xl font-manrope font-medium text-white mb-2">
                              {card.heading}
                            </h3>
                            <p className="text-sm sm:text-base font-manrope text-gray-200">
                              {card.paragraph}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </motion.div>

            {/* Mobile Layout - Static Cards */}
            <motion.div 
              className="lg:hidden space-y-4 sm:space-y-6 w-full col-span-2 py-4 sm:py-8" 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {cardData.map((card, index) => (
                <div
                  key={index}
                  className="brand-card cursor-pointer mx-4 sm:mx-0 bg-white rounded-[1.5rem]"
                  style={{ height: '200px' }}
                  onClick={() => console.log(`${card.heading} card clicked`)}
                >
                  {/* Background Video - Mobile optimized and perfectly centered */}
                  <video
                    className="absolute inset-0 w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      borderRadius: '1.5rem', 
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <source src={card.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Content Overlay - Mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 rounded-b-[1.5rem]">
                    <div className="brand-card-overlay rounded-[0.75rem]">
                      <h3 className="text-lg font-manrope font-medium text-white mb-2">
                        {card.heading}
                      </h3>
                      <p className="text-sm font-manrope text-gray-200">
                        {card.paragraph}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const HeroScrollSection: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <main ref={container} className='relative h-[200vh]'>
      <HeroSection scrollYProgress={scrollYProgress} />
      <HowItWorksSection scrollYProgress={scrollYProgress} />
    </main>
  );
};

export default HeroScrollSection;