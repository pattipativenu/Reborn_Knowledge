import React, { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { placeholderUrl } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import TestimonialsSection from './TestimonialsSection';
import EveryMomentSection from './EveryMomentSection';

const BooksSection: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // --- Transform scroll progress into different scale values ---
  // Each `useTransform` maps the scrollYProgress (from 0 to 1) to a new range.
  // This creates the effect where different images scale at different speeds.
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  // Background color transform for Book 1 - bidirectional with smooth transitions
  const book1BackgroundColor = useTransform(
    scale4,
    [1, 3.8, 4],
    ['transparent', 'transparent', '#212121']
  );

  // --- Data for our images with the provided URLs ---
  const pictures = [
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book1.avif',
      scale: scale4,
      style: "w-[40vw] sm:w-[25vw] h-[20vh] sm:h-[25vh]", // Central image - larger on mobile
    },
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book2.png.png',
      scale: scale5,
      style: "top-[-20vh] sm:top-[-30vh] left-[5vw] w-[30vw] sm:w-[35vw] h-[25vh] sm:h-[30vh]",
    },
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book3.jpg',
      scale: scale6,
      style: "top-[-10vh] left-[-20vw] sm:left-[-25vw] w-[25vw] sm:w-[20vw] h-[35vh] sm:h-[45vh]",
    },
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book4.png.png',
      scale: scale8,
      style: "left-[25vw] sm:left-[27.5vw] w-[30vw] sm:w-[25vw] h-[20vh] sm:h-[25vh]",
    },
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book5.jpg',
      scale: scale9,
      style: "top-[25vh] sm:top-[27.5vh] left-[5vw] w-[25vw] sm:w-[20vw] h-[20vh] sm:h-[25vh]",
    },
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book6.png',
      scale: scale6,
      style: "top-[25vh] sm:top-[27.5vh] left-[-20vw] sm:left-[-22.5vw] w-[35vw] sm:w-[30vw] h-[20vh] sm:h-[25vh]",
    },
    {
      src: 'https://storage.googleapis.com/reborn_knowledge/most_loved_books/book7.png',
      scale: scale5,
      style: "top-[20vh] sm:top-[22.5vh] left-[22vw] sm:left-[25vw] w-[20vw] sm:w-[15vw] h-[12vh] sm:h-[15vh]",
    },
  ];

  return (
    <main style={{ backgroundColor: '#eeede9' }} className="text-brand-light-text">
      <div className="h-[70vh] sm:h-[80vh] flex flex-col items-center justify-start text-center pt-32 sm:pt-40 relative">
        {/* Grid background behind the heading - positioned lower to not start immediately from top */}
        <div className='absolute top-16 sm:top-20 left-0 right-0 h-[50vh] sm:h-[60vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-light-text mb-3 relative z-10">
          {t('books.title')}
        </h1>
        <p className="text-base sm:text-lg font-manrope text-brand-muted-text max-w-4xl mx-auto relative z-10 mb-0">
          "{t('books.subtitle')}"
        </p>
      </div>

      {/* The main container for the scroll animation. Its height determines how long you can scroll. */}
      <div ref={container} className="h-[200vh] sm:h-[300vh] relative -mt-[10vh] sm:-mt-[15vh]">
        {/* The sticky container holds the images and stays fixed while the parent scrolls. */}
        <div 
          className="sticky top-0 h-screen overflow-hidden z-20" 
          style={{ backgroundColor: '#eeede9' }}
        >
          {pictures.map(({ src, scale, style }, index) => (
            // Each `motion.div` is an element that will be animated.
            // We apply the calculated 'scale' transform to this div.
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute top-0 w-full h-full flex items-center justify-center overflow-hidden"
            >
              {/* This inner div positions and sizes the image container with enhanced overflow control. */}
              <div className={`relative ${style} overflow-hidden`} style={{ backgroundColor: '#eeede9' }}>
                {/* Background div that changes color for Book 1 when scale is high */}
                {index === 0 && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundColor: book1BackgroundColor,
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                )}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={src}
                    alt={`Book cover ${index + 1}`}
                    className={`w-full h-full shadow-2xl ${
                      index === 0 ? 'object-cover relative z-10' : 'object-contain'
                    }`}
                    style={{
                      objectPosition: 'center',
                      border: 'none',
                      outline: 'none',
                      // Enhanced styling for Book1 (index 0) to prevent tearing
                      ...(index === 0 && {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        // Prevent any overflow or scaling issues
                        transform: 'scale(1.01)', // Slight scale to prevent edge gaps
                        transformOrigin: 'center center'
                      }),
                      // Enhanced styling for other books to prevent tearing
                      ...(index !== 0 && {
                        objectFit: 'contain',
                        objectPosition: 'center center',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      })
                    }}
                    onError={(e) => { 
                      e.currentTarget.src = 'https://placehold.co/400x400/eeede9/666666?text=Book'; 
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BooksSection;