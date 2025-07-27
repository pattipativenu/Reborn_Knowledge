'use client';

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { LanguageProvider } from './contexts/LanguageContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import HomePage from './pages/HomePage';
import MyLibraryPage from './pages/MyLibraryPage';
import KidsPage from './pages/KidsPage';
import AccountPage from './pages/AccountPage';
import BookPlayerPage from './pages/BookPlayerPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import MiniPlayer from './components/MiniPlayer';

// Component to handle scroll-to-top on route changes
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Always scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Instant scroll
    });
  }, [location.pathname]);

  return null;
};

// Component to conditionally render footer and apply padding
const ConditionalFooterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Main content wrapper with conditional bottom padding */}
      <div className={`main-content-wrapper relative z-10 ${isHomePage ? 'with-footer-padding' : ''}`}>
        {children}
      </div>

      {/* Footer - only render on home page */}
      {isHomePage && <Footer />}
    </>
  );
};

function App() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  // Global scroll-to-top on page load/reload
  useEffect(() => {
    // Scroll to top immediately on app load
    window.scrollTo(0, 0);
    
    // Also handle page refresh/reload
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <LanguageProvider>
      <AudioPlayerProvider>
        <Router>
          <ScrollToTop />
          <ConditionalFooterWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-library" element={<MyLibraryPage />} />
              <Route path="/kids" element={<KidsPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/book-player/:bookId" element={<BookPlayerPage />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ConditionalFooterWrapper>
          <MiniPlayer />
        </Router>
      </AudioPlayerProvider>
    </LanguageProvider>
  );
}

export default App;