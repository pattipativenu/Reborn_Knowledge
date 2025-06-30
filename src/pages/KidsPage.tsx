import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star, Clock, BookOpen, Baby, Smile, Frown, Play, Sparkles, Heart, Users, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  Book,
  convertDatabaseBookToBook,
  formatRatingCount,
  createBookPlayerUrl,
  createKidsUrl
} from '@/lib/bookUtils';
import { KidsNewsletterModal } from '@/components/KidsNewsletterModal';
import { Notification } from '@/components/Notification';
import Navbar from '../components/Navbar';

// Age group options
const ageGroups = [
  { id: 'all', label: 'All Ages 👶👧👦', emoji: '👶👧👦' },
  { id: 'toddler', label: 'Toddler (0-3)', emoji: '👶' },
  { id: 'preschool', label: 'Preschool (3-5)', emoji: '👧' },
  { id: 'elementary', label: 'Elementary (6-9)', emoji: '👦' },
  { id: 'preteen', label: 'Preteen (10-12)', emoji: '🧒' }
];

// Category options
const categories = [
  { id: 'all', label: 'All Books' },
  { id: 'stories', label: 'Stories' },
  { id: 'adventures', label: 'Adventures' },
  { id: 'educational', label: 'Educational' },
  { id: 'top-rated', label: 'Top Rated' }
];

// Placeholder book data
const generatePlaceholderBooks = (): Book[] => {
  const titles = [
    "The Magic Tree House", "Goodnight Moon", "Where the Wild Things Are", 
    "Charlotte's Web", "The Very Hungry Caterpillar", "Green Eggs and Ham",
    "The Cat in the Hat", "Matilda", "Charlie and the Chocolate Factory",
    "Harry Potter and the Philosopher's Stone", "The Lion, the Witch and the Wardrobe",
    "The Gruffalo", "A Bear Called Paddington", "The Tale of Peter Rabbit",
    "The Wonderful Wizard of Oz", "Alice's Adventures in Wonderland",
    "The BFG", "James and the Giant Peach", "The Secret Garden",
    "The Wind in the Willows", "Winnie-the-Pooh", "Pippi Longstocking",
    "The Little Prince", "Anne of Green Gables", "Little Women"
  ];
  
  const authors = [
    "Mary Pope Osborne", "Margaret Wise Brown", "Maurice Sendak",
    "E.B. White", "Eric Carle", "Dr. Seuss", "Dr. Seuss", "Roald Dahl",
    "Roald Dahl", "J.K. Rowling", "C.S. Lewis", "Julia Donaldson",
    "Michael Bond", "Beatrix Potter", "L. Frank Baum", "Lewis Carroll",
    "Roald Dahl", "Roald Dahl", "Frances Hodgson Burnett", "Kenneth Grahame",
    "A.A. Milne", "Astrid Lindgren", "Antoine de Saint-Exupéry", "L.M. Montgomery",
    "Louisa May Alcott"
  ];
  
  const categories = ["Stories", "Adventures", "Educational", "Stories", "Educational"];
  const ageGroups = ["toddler", "preschool", "elementary", "preteen", "elementary"];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `kids-book-${i + 1}`,
    title: titles[i % titles.length],
    author: authors[i % authors.length],
    narrator: "Kids Narrator",
    cover: `https://storage.googleapis.com/reborn_knowledge/kids_books/${(i % 12) + 1}.jpg`,
    progress: Math.floor(Math.random() * 101),
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    durationSeconds: (Math.floor(Math.random() * 2) + 1) * 3600 + Math.floor(Math.random() * 60) * 60,
    rating: Number((Math.random() * 1 + 4).toFixed(1)), // 4.0 - 5.0
    numberOfRatings: Math.floor(Math.random() * 10000) + 5000,
    category: categories[i % categories.length],
    isDownloaded: Math.random() > 0.7,
    isFavorite: Math.random() > 0.7,
    description: "A magical adventure for children that sparks imagination and teaches valuable lessons.",
    ageGroup: ageGroups[i % ageGroups.length],
    isKidsBook: true
  }));
};

// Coming Soon Modal Component
const ComingSoonModal: React.FC<{ onNotifyClick: () => void }> = ({ onNotifyClick }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ top: '80px' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.8 
        }}
        className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl border-4 border-gradient-to-r from-purple-300 via-pink-300 to-indigo-300"
        style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)'
        }}
      >
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={24} className="text-purple-400" />
          </motion.div>
        </div>
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart size={20} className="text-pink-400" fill="currentColor" />
          </motion.div>
        </div>
        <div className="absolute bottom-4 left-4">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen size={20} className="text-indigo-400" />
          </motion.div>
        </div>
        <div className="absolute bottom-4 right-4">
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Baby size={22} className="text-purple-400" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="text-center relative z-10">
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3,
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
            className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center mb-8 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play size={36} className="text-white ml-1" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Coming Soon! 🎬
          </motion.h1>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-2xl sm:text-3xl font-outfit font-semibold text-gray-800 mb-4"
          >
            Educational Animated Video Books
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 font-manrope"
          >
            Amazing kids content is on the way! We're building something extraordinary for curious young minds. Reborn Kids will feature handpicked books — from space and science to startup thinking and inspiring biographies — transformed into animated chapters that teach, inspire, and foster character development.
            <br /><br />
            <em>"They deserve meaningful stories that grow with them."</em>
          </motion.p>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          >
            {[
              { icon: "🎨", text: "Beautiful Animations" },
              { icon: "📚", text: "Educational Content" },
              { icon: "🎵", text: "Interactive Audio" },
              { icon: "🌟", text: "Age-Appropriate" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-200"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-manrope font-medium text-gray-800">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="space-y-4"
          >
            <motion.button
              onClick={onNotifyClick}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Bell size={20} />
              Notify Me When Ready!
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles size={18} />
              </motion.div>
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-purple-600 font-manrope font-medium">
              <Users size={18} />
              <span>Join 50,000+ families on the waiting list!</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-3xl p-1">
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6, #7c3aed)',
              backgroundSize: '300% 300%',
            }}
          />
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-1 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

const KidsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for email collection modal and notification
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  // Read URL parameters for filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const ageParam = params.get('age');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (ageParam) {
      setSelectedAgeGroup(ageParam);
    }
  }, [location.search]);

  // Load books (placeholder for now)
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      
      try {
        // In a real app, you would fetch from Supabase here
        // For now, we'll use placeholder data
        const placeholderBooks = generatePlaceholderBooks();
        setBooks(placeholderBooks);
      } catch (error) {
        console.error('Error loading kids books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'top-rated' ? book.rating >= 4.5 : book.category.toLowerCase() === selectedCategory.toLowerCase());
      
      // Age group filter
      const matchesAgeGroup = selectedAgeGroup === 'all' || 
        book.ageGroup === selectedAgeGroup;
      
      return matchesSearch && matchesCategory && matchesAgeGroup;
    });
  }, [books, searchQuery, selectedCategory, selectedAgeGroup]);

  // Handle category filter change with URL update
  const handleCategoryFilter = (category: string) => {
    const newUrl = createKidsUrl(
      category, 
      selectedAgeGroup !== 'all' ? selectedAgeGroup : undefined
    );
    navigate(newUrl);
  };

  // Handle age group filter change with URL update
  const handleAgeFilter = (ageGroup: string) => {
    const newUrl = createKidsUrl(
      selectedCategory !== 'all' ? selectedCategory : undefined,
      ageGroup !== 'all' ? ageGroup : undefined
    );
    navigate(newUrl);
  };

  // Clear all filters
  const handleClearFilters = () => {
    navigate('/kids');
    setSearchQuery('');
  };

  // Handle book click with URL-based navigation
  const handleBookClick = (book: Book) => {
    navigate(createBookPlayerUrl(book.id));
  };

  // Handle notify me button click
  const handleNotifyClick = () => {
    setShowNewsletterModal(true);
  };

  // Handle successful email submission
  const handleEmailSuccess = () => {
    setShowSuccessNotification(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 relative">
      {/* Navbar - positioned above everything with higher z-index */}
      <div className="relative z-50">
        <Navbar isInteractive={true} backgroundColor="#f9f7ff" />
      </div>

      {/* Success Notification */}
      <Notification
        isVisible={showSuccessNotification}
        message="We got you, see you soon! 🎉"
        type="success"
        onClose={() => setShowSuccessNotification(false)}
        autoHide={true}
        duration={4000}
      />

      {/* Email Collection Modal */}
      <KidsNewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
        onSuccess={handleEmailSuccess}
      />

      {/* Blurred main content */}
      <div className="filter blur-md">
        {/* Main Content */}
        <div className="pt-20 sm:pt-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold mb-4"
                >
                  {t('kids.title')} 🧸
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg sm:text-xl max-w-3xl mx-auto"
                >
                  {t('kids.subtitle')}
                </motion.p>
              </div>
              
              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="text-3xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2">{t('kids.safeContent')}</h3>
                  <p className="text-white/80">{t('kids.safeContentDesc')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="text-3xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-xl font-semibold mb-2">{t('kids.parentalControls')}</h3>
                  <p className="text-white/80">{t('kids.parentalControlsDesc')}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="text-3xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold mb-2">{t('kids.educational')}</h3>
                  <p className="text-white/80">{t('kids.educationalDesc')}</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Section Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-outfit font-bold text-purple-800 mb-8"
            >
              {t('kids.featuredStories')}
            </motion.h2>
            
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input
                  type="text"
                  placeholder={t('kids.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Filter Buttons */}
              <div className="space-y-4">
                {/* Age Groups */}
                <div>
                  <h3 className="text-sm font-medium text-purple-700 mb-2">{t('kids.allAges')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {ageGroups.map((age) => (
                      <button
                        key={age.id}
                        onClick={() => handleAgeFilter(age.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedAgeGroup === age.id
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        {age.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-purple-700 mb-2">{t('library.browseCategory')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryFilter(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        {t(`kidsCategory.${category.id}`) || category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Books Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full"
                />
                <span className="ml-3 text-purple-600 font-medium">Loading magical books...</span>
              </div>
            ) : filteredBooks.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleBookClick(book)}
                      whileHover={{ y: -5 }}
                    >
                      {/* Book Cover */}
                      <div className="relative aspect-[3/4]">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/300x400/9333ea/ffffff?text=${encodeURIComponent(book.title.slice(0, 15))}`;
                          }}
                        />
                        
                        {/* Age Badge */}
                        <div className="absolute top-2 left-2 bg-white/90 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                          {ageGroups.find(age => age.id === book.ageGroup)?.emoji || '👶👧👦'}
                        </div>
                        
                        {/* Progress Indicator */}
                        {book.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2">
                            <div className="w-full bg-gray-600 rounded-full h-1">
                              <div
                                className="h-1 rounded-full bg-purple-500"
                                style={{ width: `${book.progress}%` }}
                              />
                            </div>
                            <div className="text-white text-xs mt-1 text-center">
                              {book.progress}% {t('library.complete')}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Book Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-purple-900 text-sm sm:text-base mb-1 line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-purple-600 text-xs mb-2 line-clamp-1">
                          by {book.author}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock size={12} />
                            <span>{book.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" fill="currentColor" />
                            <span className="font-medium">{book.rating}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <Frown size={64} className="mx-auto mb-4 text-purple-300" />
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  {t('kids.noBooks')}
                </h3>
                <p className="text-purple-600 mb-6 max-w-md mx-auto">
                  {t('kids.noBooksSub')}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-md"
                >
                  {t('kids.clearFilters')}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Modal Overlay - positioned below navbar */}
      <ComingSoonModal onNotifyClick={handleNotifyClick} />
    </div>
  );
};

export default KidsPage;