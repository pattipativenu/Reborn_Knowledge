import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Filter, ChevronDown, Users, Play, Star, Clock, Heart, Download, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlowButton } from '@/components/ui/flow-button';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { BackButton } from '@/components/ui/back-button';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase, DatabaseBook } from '@/lib/supabaseClient';
import { 
  Book,
  convertDatabaseBookToBook,
  formatRatingCount,
  getCategoryColor,
  createBookPlayerUrl
} from '@/lib/bookUtils';
import { fetchBooksWithInsights, getBatchBookInsights, BookInsights } from '@/lib/supabaseInsightsService';
import Navbar from '../components/Navbar';

// Enhanced Book Card Component with fixed height and alignment
const EnhancedBookCard = memo<{
  book: Book;
  onClick: (id: string) => void;
}>(({ book, onClick }) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: shouldReduceMotion ? { scale: 1, y: 0 } : { 
      scale: 1.02, 
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
      onClick={() => onClick(book.id)}
    >
      {/* Book Cover - Fixed aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-brand-accent-start hover:bg-brand-accent-end text-black p-3 rounded-full transition-colors shadow-lg">
            <Play size="24" fill="currentColor" />
          </button>
        </div>

        {/* Status badges - removed database icon */}
        <div className="absolute top-3 left-3 flex gap-2">
          {book.isDownloaded && (
            <div className="bg-green-500 text-white p-1 rounded-full shadow-md">
              <Download size="12" />
            </div>
          )}
          {book.isFavorite && (
            <div className="bg-red-500 text-white p-1 rounded-full shadow-md">
              <Heart size="12" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Progress bar */}
        {book.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: `${book.progress}%`, backgroundColor: '#fece0a' }}
              />
            </div>
            <div className="text-white text-xs mt-1">{book.progress}% complete</div>
          </div>
        )}
      </div>

      {/* Book Info - Flexible content area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title and Author - Fixed height section */}
        <div className="flex items-start justify-between mb-3 min-h-[3.5rem]">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-light-text text-lg leading-snug line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-brand-muted-text text-sm truncate">
              by {book.author}
            </p>
          </div>
        </div>

        {/* Narrator section - Fixed height */}
        <div className="mb-3 h-5 flex items-center">
          <p className="text-xs text-brand-muted-text">
            {book.narrator && `Narrated by ${book.narrator}`}
          </p>
        </div>

        {/* Description - Fixed height with line clamp */}
        <div className="mb-3 h-10 flex items-start">
          <p className="text-xs text-brand-muted-text line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Duration and Rating - Fixed height */}
        <div className="flex items-center justify-between text-xs text-brand-muted-text mb-2 h-5">
          <div className="flex items-center gap-1">
            <Clock size="12" />
            <span className="font-medium">{book.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size="12" fill="currentColor" className="text-yellow-500" />
            <span className="font-semibold">{book.rating}</span>
            <span className="text-xs text-gray-400">({formatRatingCount(book.numberOfRatings)})</span>
          </div>
        </div>

        {/* Last Played - Fixed height */}
        <div className="mb-3 h-4 flex items-center">
          {book.lastPlayed && (
            <div className="text-xs text-brand-muted-text">
              Last played: {book.lastPlayed}
            </div>
          )}
        </div>

        {/* Category - Fixed at bottom */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between">
            <span 
              className="inline-block text-white text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: getCategoryColor(book.category) }}
            >
              {book.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

EnhancedBookCard.displayName = 'EnhancedBookCard';

const MyLibraryPage: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goBackWithScrollMemory } = useScrollMemory();
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  
  // Supabase state
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [isCountChanging, setIsCountChanging] = useState(false);

  // Ensure page starts at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get the current category color
  const getCurrentCategoryColor = useCallback(() => {
    return selectedCategory !== 'all' ? getCategoryColor(selectedCategory) : '#212121';
  }, [selectedCategory]);

  // Handle URL parameters for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      document.title = `${categoryParam} - My Library`;
    } else {
      setSelectedCategory('all');
      document.title = 'My Library';
    }
  }, [location.search]);

  // Live community counter with rotating animation - updates every 30 seconds
  useEffect(() => {
    const generateRandomCount = () => {
      return Math.floor(Math.random() * (30000000 - 60000) + 60000);
    };

    setLiveCount(generateRandomCount());

    const interval = setInterval(() => {
      setIsCountChanging(true);
      
      setTimeout(() => {
        setLiveCount(prevCount => {
          const variation = Math.floor(Math.random() * 10000) - 5000;
          const newCount = prevCount + variation;
          
          if (newCount < 60000) return 60000 + Math.floor(Math.random() * 10000);
          if (newCount > 30000000) return 30000000 - Math.floor(Math.random() * 10000);
          
          return newCount;
        });
        
        setTimeout(() => setIsCountChanging(false), 300);
      }, 150);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatLiveCount = useCallback((count: number) => {
    return count.toLocaleString();
  }, []);

  // Fetch books with insights from Supabase
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('[MyLibrary] Fetching books with insights from Supabase...');
        const { books: dbBooks, insightsCount, totalBooks } = await fetchBooksWithInsights();
        
        console.log(`[MyLibrary] Fetched data:`, {
          totalBooks,
          insightsCount,
          percentageWithInsights: Math.round((insightsCount / totalBooks) * 100)
        });

        // Create a set of book IDs that have real insights
        const booksWithInsights = new Set<string>();
        for (const book of dbBooks) {
          if (book.full_text_content && 
              book.full_text_content.trim() !== '' && 
              book.full_text_content.trim().toLowerCase() !== 'null') {
            booksWithInsights.add(book.id);
          }
        }

        // Convert database books to UI format with insights indicator
        const convertedBooks = dbBooks.map(book => 
          convertDatabaseBookToBook(book, booksWithInsights.has(book.id))
        );
        
        setBooks(convertedBooks);
        
        console.log('[MyLibrary] Books processed and set to state:', {
          convertedBooksCount: convertedBooks.length,
          booksWithRealInsights: convertedBooks.filter(b => b.hasRealInsights).length
        });
      } catch (err: any) {
        console.error('Error fetching books:', err.message);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Available categories in the order you specified
  const categories = useMemo(() => [
    'all',
    'Startup & Business',
    'Marketing & Sales',
    'Health & Fitness',
    'Mindfulness & Meditation',
    'Leadership',
    'Personal Growth',
    'Money & Finance',
    'Habits & Psychology',
    'Spirituality & Philosophy',
    'Relationships',
    'Time Management',
    'Career & Skills',
    'Creativity & Writing',
    'Science & Technology',
    'Productivity'
  ], []);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      
      const matchesTab = (() => {
        switch (activeTab) {
          case 'in-progress':
            return book.progress > 0 && book.progress < 100;
          case 'completed':
            return book.progress === 100;
          case 'favorites':
            return book.isFavorite;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [books, searchQuery, selectedCategory, activeTab]);

  // Stats with updated total hours calculation using durationSeconds
  const stats = useMemo(() => ({
    totalBooks: books.length,
    inProgress: books.filter(b => b.progress > 0 && b.progress < 100).length,
    completed: books.filter(b => b.progress === 100).length,
    totalHours: Math.round(books.reduce((acc, book) => {
      return acc + (book.durationSeconds / 3600); // Convert seconds to hours
    }, 0))
  }), [books]);

  const statusOptions = useMemo(() => [
    { key: 'all', label: t('library.allBooks'), count: stats.totalBooks },
    { key: 'in-progress', label: t('library.inProgress'), count: stats.inProgress },
    { key: 'completed', label: t('library.completed'), count: stats.completed },
    { key: 'favorites', label: t('library.favorites'), count: books.filter(b => b.isFavorite).length }
  ], [t, stats, books]);

  // Get count of books for each category
  const getCategoryCount = useCallback((category: string) => {
    if (category === 'all') return books.length;
    return books.filter(book => book.category === category).length;
  }, [books]);

  const handleBookClick = useCallback((bookId: string) => {
    navigate(createBookPlayerUrl(bookId));
  }, [navigate]);

  // Rotating number component
  const RotatingNumber = memo(({ number }: { number: string }) => {
    return (
      <motion.span
        key={number}
        initial={{ y: 20, opacity: 0, rotateX: 90 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        exit={{ y: -20, opacity: 0, rotateX: -90 }}
        transition={{ 
          duration: 0.4,
          ease: "easeInOut"
        }}
        className="inline-block"
        style={{ transformStyle: "preserve-3d" }}
      >
        {number}
      </motion.span>
    );
  });

  RotatingNumber.displayName = 'RotatingNumber';

  // Dynamic page title based on selected category
  const getPageTitle = useCallback(() => {
    if (selectedCategory !== 'all') {
      return selectedCategory;
    }
    return t('library.title');
  }, [selectedCategory, t]);

  const getPageSubtitle = useCallback(() => {
    if (selectedCategory !== 'all') {
      const count = getCategoryCount(selectedCategory);
      return `${count} ${count !== 1 ? 'books' : 'book'} in this category`;
    }
    return t('library.subtitle');
  }, [selectedCategory, getCategoryCount, t]);

  // Get dynamic background style based on selected category
  const getDynamicBackgroundStyle = useMemo(() => {
    const currentColor = getCurrentCategoryColor();
    if (selectedCategory === 'all') {
      return { backgroundColor: '#212121' };
    }
    
    return {
      background: `linear-gradient(90deg, ${currentColor} 0%, ${currentColor}dd 100%)`,
    };
  }, [selectedCategory, getCurrentCategoryColor]);

  // Get text color that contrasts well with the background
  const getContrastTextColor = useCallback(() => {
    if (selectedCategory === 'all') return '#EAEAEA';
    
    const color = getCurrentCategoryColor();
    // Simple contrast calculation - you might want to use a more sophisticated method
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }, [selectedCategory, getCurrentCategoryColor]);

  // Category change handler with URL update
  const handleCategoryChange = useCallback((newCategory: string) => {
    if (newCategory === selectedCategory) return;
    
    if (newCategory === 'all') {
      navigate('/my-library');
    } else {
      navigate(`/my-library?category=${encodeURIComponent(newCategory)}`);
    }
    
    // Scroll to top when changing categories
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, navigate]);

  return (
    <div className="min-h-screen bg-brand-light-bg">
      {/* Fixed Navbar */}
      <Navbar 
        isInteractive={true} 
        backgroundColor={selectedCategory === 'all' ? '#212121' : getCurrentCategoryColor()} 
      />
      
      {/* Main Content */}
      <div className="pt-20 sm:pt-24">
        {/* Header Section with Dynamic Background */}
        <motion.div 
          className="text-white relative overflow-hidden"
          style={getDynamicBackgroundStyle}
          animate={{ 
            background: selectedCategory === 'all' 
              ? '#212121' 
              : `linear-gradient(90deg, ${getCurrentCategoryColor()} 0%, ${getCurrentCategoryColor()}dd 100%)`
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated color sweep effect */}
          <AnimatePresence>
            {selectedCategory !== 'all' && !shouldReduceMotion && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                exit={{ x: '100%' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${getCurrentCategoryColor()} 50%, transparent 100%)`,
                  opacity: 0.3
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Back Button positioned at top left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <BackButton 
                onClick={goBackWithScrollMemory}
                pageBackgroundColor={getCurrentCategoryColor()}
              />
            </motion.div>

            {/* Header content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl font-outfit font-bold"
                  style={{ color: getContrastTextColor() }}
                  key={selectedCategory}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {getPageTitle()}
                </motion.h1>
                <motion.p 
                  className="mt-2"
                  style={{ color: `${getContrastTextColor()}cc` }}
                  key={`${selectedCategory}-subtitle`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  {getPageSubtitle()}
                </motion.p>
              </div>

              {/* Live Community Counter - Desktop with star-like blinking effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="p-2 bg-green-500 rounded-full"
                >
                  <Users size={20} className="text-white" />
                </motion.div>
                <div>
                  <div className="text-sm" style={{ color: `${getContrastTextColor()}cc` }}>{t('library.liveComm')}</div>
                  <div className="text-lg font-bold overflow-hidden" style={{ color: getContrastTextColor() }}>
                    <AnimatePresence mode="wait">
                      {formatLiveCount(liveCount).split('').map((char, index) => (
                        <RotatingNumber key={`${liveCount}-${index}`} number={char} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {/* Star-like blinking light that shines every 3 seconds */}
                  <motion.div
                    animate={shouldReduceMotion ? {} : { 
                      scale: [1, 1.8, 1.4, 1.8, 1],
                      opacity: [0.6, 1, 0.8, 1, 0.6],
                      boxShadow: [
                        '0 0 0px rgba(34, 197, 94, 0.5)',
                        '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6)',
                        '0 0 15px rgba(34, 197, 94, 0.7)',
                        '0 0 25px rgba(34, 197, 94, 0.9), 0 0 50px rgba(34, 197, 94, 0.7)',
                        '0 0 0px rgba(34, 197, 94, 0.5)'
                      ]
                    }}
                    transition={{ 
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 2.4,
                      ease: "easeInOut"
                    }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                    style={{
                      filter: 'brightness(1.2)',
                    }}
                  />
                  <div className="text-xs mt-1" style={{ color: `${getContrastTextColor()}cc` }}>{t('library.listening')}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats Cards - removed Real Insights box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-2xl font-bold" style={{ color: getContrastTextColor() }}>{stats.totalBooks}</div>
                <div className="text-sm" style={{ color: `${getContrastTextColor()}cc` }}>{t('library.totalBooks')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-2xl font-bold" style={{ color: getContrastTextColor() }}>{stats.inProgress}</div>
                <div className="text-sm" style={{ color: `${getContrastTextColor()}cc` }}>{t('library.inProgress')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-2xl font-bold" style={{ color: getContrastTextColor() }}>{stats.completed}</div>
                <div className="text-sm" style={{ color: `${getContrastTextColor()}cc` }}>{t('library.completed')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-2xl font-bold" style={{ color: getContrastTextColor() }}>{stats.totalHours}h</div>
                <div className="text-sm" style={{ color: `${getContrastTextColor()}cc` }}>{t('library.totalHours')}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-muted-text" size={20} />
              <input
                type="text"
                placeholder={t('library.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent-start focus:border-transparent transition-all"
              />
            </div>
            
            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusFilter(!showStatusFilter)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-12"
              >
                <Filter size={20} className="text-brand-muted-text" />
                <ChevronDown 
                  size={16} 
                  className={`transition-transform text-brand-muted-text ${showStatusFilter ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {showStatusFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 min-w-48 overflow-hidden"
                    style={{
                      backgroundColor: '#ffffff',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {statusOptions.map((option, index) => (
                      <motion.button
                        key={option.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        onClick={() => {
                          setActiveTab(option.key as any);
                          setShowStatusFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between ${
                          activeTab === option.key ? 'bg-brand-accent-start/10 text-brand-accent-end font-medium' : 'text-gray-700'
                        }`}
                        style={{ backgroundColor: activeTab === option.key ? 'rgba(254, 206, 10, 0.1)' : 'transparent' }}
                      >
                        <span>{option.label}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {option.count}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Category Filter Buttons with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-brand-light-text mb-4">{t('library.browseCategory')}</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const count = getCategoryCount(category);
                const isActive = selectedCategory === category;
                const categoryColor = category !== 'all' ? getCategoryColor(category) : '#212121';
                
                return (
                  <MagneticButton
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2 relative overflow-hidden ${
                      isActive
                        ? 'text-white shadow-lg transform scale-105'
                        : 'bg-white text-brand-light-text hover:bg-gray-50 border border-gray-200'
                    }`}
                    style={isActive ? {
                      backgroundColor: categoryColor,
                      boxShadow: `0 10px 25px ${categoryColor}40`
                    } : {}}
                    magneticStrength={0.2}
                  >
                    {/* Left-to-right color sweep animation */}
                    <AnimatePresence>
                      {isActive && !shouldReduceMotion && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          exit={{ x: '100%' }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="absolute inset-0 z-0"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${categoryColor}88 50%, transparent 100%)`,
                          }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <span className="relative z-10">{category === 'all' ? t('library.allBooks') : category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full relative z-10 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </MagneticButton>
                );
              })}
            </div>
          </motion.div>

          {/* Enhanced Books Grid with Fixed Heights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-brand-accent-start" size={24} />
                  <span className="text-brand-light-text">Loading your library with real insights...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle size={24} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Books Grid with Equal Heights */}
            {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: 0.03 * index }}
                    className="h-full"
                  >
                    <EnhancedBookCard
                      book={book}
                      onClick={handleBookClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            )}
          </motion.div>

          {/* Enhanced Empty State */}
          {!loading && !error && filteredBooks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-brand-light-text mb-2">
                {t('library.noBooks')}
              </h3>
              <p className="text-brand-muted-text mb-6">
                {searchQuery || selectedCategory !== 'all' || activeTab !== 'all'
                  ? t('library.noBooksDesc')
                  : 'Start building your library by exploring our collection'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {(searchQuery || selectedCategory !== 'all' || activeTab !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/my-library');
                      setActiveTab('all');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    {t('library.clearFilters')}
                  </button>
                )}
                <FlowButton
                  text={t('library.exploreBooks')}
                  onClick={() => navigate('/')}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
});

MyLibraryPage.displayName = 'MyLibraryPage';

export default MyLibraryPage;