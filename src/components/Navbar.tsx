import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface NavbarProps {
  isInteractive: boolean;
  backgroundColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isInteractive, backgroundColor }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [isShuffleHeroActive, setIsShuffleHeroActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const toggleMobileMenu = () => {
    if (isInteractive) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Track scroll position for navbar background and Shuffle Hero Section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Only apply Shuffle Hero effect on the home page
      if (location.pathname === '/') {
        // Find the Shuffle Hero Section
        const shuffleHeroSection = document.querySelector('[data-section="shuffle-hero"]');
        
        if (shuffleHeroSection) {
          const rect = shuffleHeroSection.getBoundingClientRect();
          const navbarHeight = 96; // Approximate navbar height (24 * 4 = 96px)
          
          // Check if the top of the Shuffle Hero Section has reached the bottom of the navbar
          const hasReachedNavbar = rect.top <= navbarHeight;
          
          // Once the Shuffle Hero section reaches the navbar, keep the effect active until the end of the page
          // This means the effect stays on from when Shuffle Hero hits the navbar until the user scrolls back up
          setIsShuffleHeroActive(hasReachedNavbar);
        }
      } else {
        setIsShuffleHeroActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Track category from URL parameters
  useEffect(() => {
    const updateCurrentCategory = () => {
      if (location.pathname !== '/my-library') {
        setCurrentCategory('all');
        return;
      }

      // Check URL search params
      const urlParams = new URLSearchParams(location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        setCurrentCategory(categoryParam);
        return;
      }

      // Default to 'all'
      setCurrentCategory('all');
    };

    updateCurrentCategory();
  }, [location.pathname, location.search]);

  // ENHANCED: Listen for category changes in sessionStorage (for real-time updates)
  useEffect(() => {
    const handleStorageChange = () => {
      if (location.pathname === '/my-library') {
        const storedCategory = sessionStorage.getItem('selectedCategory');
        if (storedCategory && storedCategory !== 'null') {
          setCurrentCategory(storedCategory);
        } else {
          setCurrentCategory('all');
        }
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (in case we need to trigger manually)
    window.addEventListener('categoryChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoryChanged', handleStorageChange);
    };
  }, [location.pathname]);

  // ENHANCED: Determine if we're on a specific category page (excluding "All Books")
  const isOnSpecificCategoryPage = () => {
    if (location.pathname !== '/my-library') return false;
    
    return currentCategory !== 'all' && 
           currentCategory !== 'All Books' && 
           currentCategory !== null && 
           currentCategory !== undefined;
  };

  // Navigation items with routing functionality
  const navItems = [
    { 
      id: 'kids', 
      label: t('nav.kids'),
      onClick: () => navigate('/kids')
    },
    { 
      id: 'library', 
      label: t('nav.myLibrary'),
      onClick: () => navigate('/my-library')
    },
    { 
      id: 'account', 
      label: t('nav.account'),
      onClick: () => navigate('/account')
    }
  ];

  const handleBrandClick = () => {
    // Check if we're on the main page (home page)
    if (location.pathname === '/') {
      // Jump directly to the top of the page (hero section) without scrolling animation
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Instant jump, no smooth scrolling
      });
    } else {
      // Navigate to home page for other pages
      navigate('/');
    }
  };

  // NEW: Handle logo click to redirect to bolt.new
  const handleLogoClick = () => {
    window.open('https://bolt.new/', '_blank', 'noopener,noreferrer');
  };

  // Determine background color based on props, scroll state, and Shuffle Hero Section
  const getBackgroundStyle = () => {
    // Priority 1: Shuffle Hero Section effect (only on home page)
    // This effect starts when Shuffle Hero reaches the navbar and continues to the end of the page
    if (location.pathname === '/' && isShuffleHeroActive) {
      return {
        backgroundColor: '#212121',
        backdropFilter: 'blur(10px)',
        borderBottom: 'none'
      };
    }

    // Priority 2: Existing backgroundColor prop logic
    if (backgroundColor) {
      // Check if it's a gradient (contains 'linear-gradient')
      if (backgroundColor.includes('linear-gradient')) {
        return {
          background: backgroundColor,
          borderBottom: 'none',
          // Add transparency for non-home pages
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        };
      } else {
        // Solid color - make it transparent for non-home pages
        const isHomePage = location.pathname === '/';
        if (!isHomePage) {
          // Extract RGB values and make transparent
          const hex = backgroundColor.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          
          return {
            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.9)`,
            backdropFilter: 'blur(10px)',
            borderBottom: 'none'
          };
        } else {
          // Home page - keep solid
          return {
            backgroundColor: backgroundColor,
            borderBottom: 'none'
          };
        }
      }
    }
    
    // Priority 3: Default behavior for home page
    return {
      backgroundColor: isScrolled ? 'rgba(33, 33, 33, 0.9)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: 'none'
    };
  };

  // ENHANCED: Text color determination with Shuffle Hero Section priority
  const getTextColor = () => {
    // Priority 1: Shuffle Hero Section effect (only on home page)
    // Force white text when the Shuffle Hero effect is active
    if (location.pathname === '/' && isShuffleHeroActive) {
      return '#FFFFFF';
    }

    // Priority 2: CRITICAL: Force black text ONLY on specific category pages (excluding "All Books")
    if (isOnSpecificCategoryPage()) {
      return '#000000';
    }
    
    // Priority 2.5: Force black text on Account page
    if (location.pathname === '/account') {
      return '#000000';
    }
    
    // Priority 3: White text for all other cases (main library, "All Books", other pages)
    if (backgroundColor && backgroundColor !== '#212121') {
      // If it's a light background color, use black text
      if (backgroundColor.includes('#')) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
      }
      // For gradients or other complex backgrounds, default to white
      return '#FFFFFF';
    }
    
    // Priority 4: Default white text for all other cases (home page, main library, "All Books")
    return '#FFFFFF';
  };

  // Determine brand text color (same logic as nav items)
  const getBrandTextColor = () => {
    return getTextColor();
  };

  // Determine if background is dark for logo text color
  const isBackgroundDark = () => {
    // Priority 1: Shuffle Hero Section effect
    if (location.pathname === '/' && isShuffleHeroActive) {
      return true; // Dark background (#212121)
    }

    // Priority 2: Existing logic
    if (backgroundColor) {
      if (backgroundColor.includes('linear-gradient')) {
        // For gradients, assume dark background
        return true;
      }
      if (backgroundColor.includes('#')) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness <= 128;
      }
    }
    // Default to dark background (home page)
    return true;
  };

  // Enhanced hover and tap animation variants that sync with brand color
  const navItemVariants = {
    rest: { 
      scale: 1,
      color: getTextColor()
    },
    hover: { 
      scale: 1.05,
      color: '#fece0a', // Brand accent color - always yellow on hover
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { 
      scale: 0.95,
      color: '#fece0a', // Brand accent color on tap
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Enhanced mobile menu item variants
  const mobileNavItemVariants = {
    rest: { 
      scale: 1,
      color: getTextColor(),
      backgroundColor: 'transparent'
    },
    hover: { 
      scale: 1.02,
      color: '#fece0a',
      backgroundColor: 'rgba(254, 206, 10, 0.1)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { 
      scale: 0.98,
      color: '#fece0a',
      backgroundColor: 'rgba(254, 206, 10, 0.2)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out`}
        style={getBackgroundStyle()}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Brand Name - NO color change on hover, only scale effect */}
            <div className="flex-shrink-0">
              <motion.h1 
                onClick={handleBrandClick}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-outfit font-bold cursor-pointer uppercase tracking-wide transition-colors duration-300"
                style={{ 
                  color: getBrandTextColor(),
                }}
                whileHover={{
                  scale: 1.02,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                }}
                whileTap={{
                  scale: 0.98,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                }}
              >
                {t('nav.reborn')}
              </motion.h1>
            </div>

            {/* Desktop Navigation - Enhanced with synchronized color changes */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={isInteractive ? item.onClick : undefined}
                  className={`text-sm lg:text-base font-manrope font-medium px-4 lg:px-6 py-2 lg:py-3 transition-colors duration-300 ${
                    isInteractive 
                      ? 'cursor-pointer' 
                      : 'cursor-default opacity-70'
                  }`}
                  disabled={!isInteractive}
                  variants={isInteractive ? navItemVariants : undefined}
                  initial="rest"
                  whileHover={isInteractive ? "hover" : undefined}
                  whileTap={isInteractive ? "tap" : undefined}
                  animate={{
                    color: getTextColor(),
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button - Enhanced with color sync */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className={`p-2 transition-colors duration-300 ${
                  isInteractive 
                    ? 'cursor-pointer' 
                    : 'cursor-default opacity-70'
                }`}
                disabled={!isInteractive}
                whileHover={isInteractive ? { 
                  scale: 1.1,
                  color: '#fece0a',
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                } : undefined}
                whileTap={isInteractive ? { 
                  scale: 0.9,
                  color: '#fece0a',
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                } : undefined}
                animate={{
                  color: getTextColor(),
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu - Enhanced with synchronized color changes */}
          {isMobileMenuOpen && isInteractive && (
            <motion.div 
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2 pt-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      item.onClick?.();
                      setIsMobileMenuOpen(false); // Close mobile menu after navigation
                    }}
                    className="text-sm font-manrope font-medium py-3 text-left px-2 transition-colors duration-300 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      color: getTextColor(),
                      transition: {
                        opacity: { duration: 0.3, delay: index * 0.1 },
                        x: { duration: 0.3, delay: index * 0.1 },
                        color: { duration: 0.3, ease: "easeInOut" }
                      }
                    }}
                    variants={mobileNavItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Logo Overlay - Enhanced with beautiful hover effects and bolt.new redirect */}
      <motion.div 
        className="fixed top-20 sm:top-24 right-4 sm:right-6 z-40 pointer-events-auto transition-all duration-300 ease-in-out cursor-pointer"
        style={{
          transform: isMobileMenuOpen ? 'translateY(60px)' : 'translateY(0px)'
        }}
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, -5, 0],
          transition: {
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 25
            },
            rotate: {
              duration: 0.6,
              ease: "easeInOut"
            }
          }
        }}
        whileTap={{
          scale: 0.95,
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }}
        onClick={handleLogoClick}
        title="Visit bolt.new - Build apps with AI"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{
              opacity: 0.3,
              scale: 1.2,
              boxShadow: '0 0 30px rgba(254, 206, 10, 0.6)',
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            }}
            style={{
              background: 'radial-gradient(circle, rgba(254, 206, 10, 0.4) 0%, transparent 70%)',
            }}
          />
          
          {/* Main logo image */}
          <motion.img
            src="https://storage.googleapis.com/reborn_knowledge/images/white_circle_360x360.png"
            alt="REBORN Logo - Visit bolt.new"
            className="w-full h-full object-contain relative z-10"
            style={{
              filter: isBackgroundDark() ? 'invert(0)' : 'invert(1)',
            }}
            whileHover={{
              filter: isBackgroundDark() 
                ? 'invert(0) brightness(1.2) saturate(1.1)' 
                : 'invert(1) brightness(1.2) saturate(1.1)',
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            }}
            onError={(e) => {
              // Hide the image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Subtle pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            whileHover={{
              borderColor: 'rgba(254, 206, 10, 0.5)',
              scale: [1, 1.05, 1],
              transition: {
                borderColor: { duration: 0.3 },
                scale: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }
            }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;