import React from 'react';
import HeroScrollSection from '../components/HeroScrollSection';
import BooksSection from '../components/BooksSection';
import ShuffleHeroSection from '../components/ShuffleHeroSection';

const HomePage: React.FC = () => {
  // Add error boundary and loading state
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      // Simulate component initialization
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('HomePage initialization error:', err);
      setError('Failed to load homepage');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark-bg flex items-center justify-center">
        <div className="text-brand-dark-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark-bg flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default HomePage;