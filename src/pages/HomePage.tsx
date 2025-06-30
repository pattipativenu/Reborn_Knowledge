import React from 'react';
import HeroScrollSection from '../components/HeroScrollSection';
import BooksSection from '../components/BooksSection';
import ShuffleHeroSection from '../components/ShuffleHeroSection';

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section with Scroll Animation */}
      <section>
        <HeroScrollSection />
      </section>

      {/* Books Section */}
      <section>
        <BooksSection />
      </section>

      {/* Shuffle Hero Section */}
      <section>
        <ShuffleHeroSection />
      </section>
    </>
  );
};

export default HomePage;