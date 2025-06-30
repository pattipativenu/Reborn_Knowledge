import React from 'react';
import ShuffleHero from '@/components/ui/shuffle-hero';
import TestimonialsSection from './TestimonialsSection';
import EveryMomentSection from './EveryMomentSection';
import FAQSection from './FAQSection';

const ShuffleHeroSection: React.FC = () => {
  return (
    <main className="bg-brand-dark-bg" data-section="shuffle-hero">
      {/* Full-screen ShuffleHero section */}
      <div className="min-h-screen bg-brand-dark-bg flex items-center justify-center">
        <ShuffleHero />
      </div>

      {/* Testimonials Section - seamlessly connected with reduced gap */}
      <div className="bg-brand-dark-bg -mt-4 sm:-mt-8">
        <TestimonialsSection />
      </div>

      {/* Every Moment Section - seamlessly connected with reduced gap */}
      <div className="bg-brand-dark-bg -mt-8 sm:-mt-16">
        <EveryMomentSection />
      </div>

      {/* FAQ Section - seamlessly connected */}
      <div className="bg-brand-dark-bg -mt-8 sm:-mt-16">
        <FAQSection />
      </div>
    </main>
  );
};

export default ShuffleHeroSection;