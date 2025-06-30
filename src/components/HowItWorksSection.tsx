import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import CardSwap, { Card } from '@/components/ui/card-swap';

interface HowItWorksSectionProps {
  isInteractive: boolean;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ isInteractive }) => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const cardData = [
    {
      heading: t('howItWorks.pickBook'),
      paragraph: t('howItWorks.pickBookDesc'),
      videoUrl: "https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets/how_reborn_works/books.mp4"
    },
    {
      heading: t('howItWorks.listenInteract'), 
      paragraph: t('howItWorks.listenInteractDesc'),
      videoUrl: "https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets//listen.mp4"
    },
    {
      heading: t('howItWorks.testGrow'),
      paragraph: t('howItWorks.testGrowDesc'),
      videoUrl: "https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets//prize.mp4"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-light-bg relative overflow-hidden flex flex-col">
      {/* Grid background behind the heading - positioned to start from top */}
      <div className='absolute top-0 left-0 right-0 h-[50vh] sm:h-[60vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 relative z-10">
        <div className="max-w-7xl w-full">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            
            {/* Left Side - Section Title and Body Text */}
            <motion.div 
              className="flex flex-col justify-center text-center lg:text-left"
              variants={textVariants}
            >
              {/* Section Title (H2) */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-light-text mb-6 sm:mb-8">
                {t('howItWorks.title')}
              </h2>
              
              {/* Body Text */}
              <p className="text-base sm:text-lg font-manrope text-brand-muted-text max-w-lg mx-auto lg:mx-0">
                "{t('howItWorks.subtitle')}"
              </p>
            </motion.div>
  
            {/* Right Side - Card Stack (Desktop) */}
            <motion.div 
              className="hidden lg:flex justify-center items-center"
              variants={textVariants}
            >
              <div className="relative">
                <CardSwap
                  width={480}
                  height={380}
                  cardDistance={40}
                  verticalDistance={45}
                  delay={4000}
                  pauseOnHover={isInteractive}
                  easing="power"
                >
                  {cardData.map((card, index) => (
                    <Card key={index} className="brand-card">
                      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: '1.5rem' }}>
                        {/* Background Video - Optimized sizing and centering */}
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            // Perfect centering and slight scaling for better fit
                            transform: 'scale(0.98)',
                            borderRadius: '1.5rem'
                          }}
                        >
                          <source src={card.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        
                        {/* Content Overlay - Positioned for perfect centering */}
                        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ borderRadius: '0 0 1.5rem 1.5rem' }}>
                          <div className="brand-card-overlay" style={{ borderRadius: '1rem' }}>
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
            <motion.div className="lg:hidden space-y-4 sm:space-y-6 w-full col-span-2 py-4 sm:py-8" variants={textVariants}>
              {cardData.map((card, index) => (
                <div
                  key={index}
                  className="brand-card cursor-pointer mx-4 sm:mx-0"
                  style={{ height: '200px', borderRadius: '1.5rem' }}
                  onClick={() => console.log(`${card.heading} card clicked`)}
                >
                  {/* Background Video - Mobile optimized */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      borderRadius: '1.5rem',
                      transform: 'scale(0.98)'
                    }}
                  >
                    <source src={card.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Content Overlay - Mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6" style={{ borderRadius: '0 0 1.5rem 1.5rem' }}>
                    <div className="brand-card-overlay" style={{ borderRadius: '0.75rem' }}>
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
    </div>
  );
};

export default HowItWorksSection;