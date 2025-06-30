'use client';
import { ReactLenis } from 'lenis/react';
import React, { useRef, forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleCardData {
  title: string;
  titleEs: string;
  imageUrl: string;
  buttonText: string;
  buttonTextEs: string;
  color: string;
  rotation: string;
}

const Component = forwardRef<HTMLElement>((props, ref) => {
  const { t, language } = useLanguage();

  const articleCardsData: ArticleCardData[] = [
    {
      title: 'Driving',
      titleEs: 'Conduciendo',
      imageUrl: 'https://storage.googleapis.com/reborn_knowledge/images/driving.webp',
      buttonText: 'Driving',
      buttonTextEs: 'Conduciendo',
      color: '#eeede9',
      rotation: 'rotate-6',
    },
    {
      title: 'Doing Chores',
      titleEs: 'Haciendo Tareas',
      imageUrl: 'https://storage.googleapis.com/reborn_knowledge/images/chores.webp',
      buttonText: 'Doing Chores',
      buttonTextEs: 'Haciendo Tareas',
      color: '#d4d2cc',
      rotation: 'rotate-0',
    },
    {
      title: 'Training',
      titleEs: 'Entrenando',
      imageUrl: 'https://storage.googleapis.com/reborn_knowledge/images/training.webp',
      buttonText: 'Training',
      buttonTextEs: 'Entrenando',
      color: '#c5c2ba',
      rotation: '-rotate-6',
    },
    {
      title: 'Commuting',
      titleEs: 'Viajando al Trabajo',
      imageUrl: 'https://storage.googleapis.com/reborn_knowledge/images/commuting.webp',
      buttonText: 'Commuting',
      buttonTextEs: 'Viajando al Trabajo',
      color: '#b6b2a8',
      rotation: 'rotate-0',
    },
  ];

  return (
    <ReactLenis root>
      <main className='bg-brand-dark-bg' ref={ref}>
        <div className='wrapper'>
          <section className='text-brand-dark-text h-[30vh] sm:h-[35vh] w-full bg-brand-dark-bg sticky top-0'>
            {/* Grid background positioned to start from top and cover heading area */}
            <div className='absolute top-0 left-0 right-0 h-[35vh] sm:h-[40vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
          </section>
        </div>

        <section className='text-brand-dark-text w-full bg-brand-dark-bg -mt-[15vh] sm:-mt-[20vh]'>
          <div className='flex flex-col lg:flex-row justify-between px-4 sm:px-8 lg:px-16'>
            <div className='grid gap-1 w-full lg:w-auto'>
              {articleCardsData.map((card, i) => (
                <figure key={i} className='sticky top-0 h-[60vh] sm:h-screen grid place-content-center'>
                  <article
                    className={`h-48 sm:h-64 lg:h-80 w-full sm:w-[28rem] lg:w-[32rem] rounded-xl ${card.rotation} overflow-hidden shadow-xl border-2 border-brand-accent-start/30 relative`}
                    style={{ backgroundColor: card.color }}
                  >
                    {/* Image container that fills the card */}
                    <div className="absolute inset-0">
                      <img
                        src={card.imageUrl}
                        alt={language === 'es' ? card.titleEs : card.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/512x320/cccccc/666666?text=' + encodeURIComponent(language === 'es' ? card.titleEs : card.title);
                        }}
                      />
                    </div>
                    
                    {/* Overlay for button - keeping same design but removing interactive effects */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-4 sm:p-6">
                      <div className='bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-black font-manrope font-medium text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-full border-none cursor-default'>
                        {language === 'es' ? card.buttonTextEs : card.buttonText}
                      </div>
                    </div>
                  </article>
                </figure>
              ))}
            </div>
            <div className='sticky top-0 h-[60vh] sm:h-screen flex flex-col items-center justify-center mt-8 lg:mt-0'>
              {/* Moved heading here - perfectly centered above the paragraph - REMOVED 📚 */}
              <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-outfit font-bold text-center tracking-tight leading-[120%] mb-6 sm:mb-8 px-4 sm:px-8'>
                {t('shuffle.everyMoment')}
              </h1>
              <p className='text-lg sm:text-xl md:text-2xl font-manrope px-4 sm:px-8 text-center max-w-4xl mx-auto'>
                {t('shuffle.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Reduced footer gap for tighter spacing */}
        <div className='bg-brand-dark-bg h-2 sm:h-4 relative z-10'></div>
      </main>
    </ReactLenis>
  );
});

Component.displayName = 'ScrollCardComponent';

export default Component;