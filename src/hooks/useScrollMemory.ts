import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

class ScrollMemoryManager {
  private static instance: ScrollMemoryManager;
  private scrollPositions: Map<string, ScrollPosition> = new Map();
  private readonly EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

  static getInstance(): ScrollMemoryManager {
    if (!ScrollMemoryManager.instance) {
      ScrollMemoryManager.instance = new ScrollMemoryManager();
      // Make it globally accessible for clearing from other components
      (window as any).scrollMemoryManager = ScrollMemoryManager.instance;
    }
    return ScrollMemoryManager.instance;
  }

  saveScrollPosition(key: string, x: number, y: number): void {
    this.scrollPositions.set(key, {
      x,
      y,
      timestamp: Date.now()
    });
  }

  getScrollPosition(key: string): ScrollPosition | null {
    const position = this.scrollPositions.get(key);
    if (!position) return null;

    // Check if position has expired
    if (Date.now() - position.timestamp > this.EXPIRY_TIME) {
      this.scrollPositions.delete(key);
      return null;
    }

    return position;
  }

  clearScrollPosition(key: string): void {
    this.scrollPositions.delete(key);
  }

  clearExpiredPositions(): void {
    const now = Date.now();
    for (const [key, position] of this.scrollPositions.entries()) {
      if (now - position.timestamp > this.EXPIRY_TIME) {
        this.scrollPositions.delete(key);
      }
    }
  }
}

export const useScrollMemory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollManager = ScrollMemoryManager.getInstance();
  const isRestoringRef = useRef(false);
  const lastLocationRef = useRef(location.pathname);

  // Always scroll to top when navigating to a new page (except for back navigation)
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = lastLocationRef.current;
    
    // Check if this is a new navigation (not a back/forward navigation)
    const isNewNavigation = currentPath !== previousPath;
    
    if (isNewNavigation) {
      // Always scroll to top for new page navigation
      isRestoringRef.current = true;
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'auto' // Instant scroll to top
      });
      
      // Update the last location
      lastLocationRef.current = currentPath;
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    }
  }, [location.pathname]);

  // Save scroll position when leaving the page (only for back navigation)
  useEffect(() => {
    const saveCurrentPosition = () => {
      if (!isRestoringRef.current) {
        scrollManager.saveScrollPosition(
          location.pathname,
          window.scrollX,
          window.scrollY
        );
      }
    };

    // Save position before navigation
    const handleBeforeUnload = () => {
      saveCurrentPosition();
    };

    // Save position on route change
    const handlePopState = () => {
      saveCurrentPosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Save position when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      saveCurrentPosition();
    };
  }, [location.pathname, scrollManager]);

  // Only restore scroll position for back navigation to home page
  useEffect(() => {
    const restorePosition = () => {
      // Only restore scroll position when going back to home page
      if (location.pathname === '/' && window.history.state?.idx > 0) {
        const savedPosition = scrollManager.getScrollPosition('/');
        
        if (savedPosition) {
          isRestoringRef.current = true;
          
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            window.scrollTo({
              left: savedPosition.x,
              top: savedPosition.y,
              behavior: 'auto'
            });
            
            // Reset the flag after a short delay
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 100);
          });
        }
      }
    };

    // Small delay to ensure page content is loaded
    const timer = setTimeout(restorePosition, 50);
    
    return () => clearTimeout(timer);
  }, [location.pathname, scrollManager]);

  // Clean up expired positions periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      scrollManager.clearExpiredPositions();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(cleanup);
  }, [scrollManager]);

  const navigateWithScrollMemory = (to: string, options?: any) => {
    // Save current position before navigating (only for home page)
    if (location.pathname === '/') {
      scrollManager.saveScrollPosition(
        location.pathname,
        window.scrollX,
        window.scrollY
      );
    }
    
    navigate(to, options);
  };

  const goBackWithScrollMemory = () => {
    // Save current position before going back
    scrollManager.saveScrollPosition(
      location.pathname,
      window.scrollX,
      window.scrollY
    );
    
    // Navigate back - this will automatically restore the previous scroll position for home page only
    navigate(-1);
  };

  return {
    navigateWithScrollMemory,
    goBackWithScrollMemory,
    clearScrollPosition: (path: string) => scrollManager.clearScrollPosition(path)
  };
};