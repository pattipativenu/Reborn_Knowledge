import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Star, Clock, ArrowLeft, Minus, Plus, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '@/components/ui/back-button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { supabase, DatabaseBook } from '@/lib/supabaseClient';
import { 
  Book,
  convertDatabaseBookToBook,
  formatRatingCount,
  getCategoryColor,
  createBookPlayerUrl
} from '@/lib/bookUtils';
import { getBookInsights, BookInsights } from '@/lib/supabaseInsightsService';
import Navbar from '../components/Navbar';

interface BookSuggestion {
  id: string;
  title: string;
  author: string;
  cover: string;
  durationSeconds: number;
  duration: string;
  rating: number;
  numberOfRatings: number;
  category: string;
}

// NEW: Component to render a key insight point with actionable step formatting
const KeyInsightPoint: React.FC<{ point: string; index: number }> = ({ point, index }) => {
  // Check if the point contains an actionable step
  const actionableStepPattern = /• Actionable Step:/i;
  const hasActionableStep = actionableStepPattern.test(point);

  if (hasActionableStep) {
    // Split the point into main content and actionable step
    const parts = point.split(actionableStepPattern);
    
    if (parts.length === 2) {
      const mainContent = parts[0].trim();
      const actionableContent = parts[1].trim();

      return (
        <motion.div
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="w-2 h-2 bg-[#fece0a] rounded-full mt-2 flex-shrink-0" />
          <div className="text-brand-muted-text text-sm leading-relaxed">
            {/* Main insight content */}
            <span>{mainContent}</span>
            
            {/* Actionable Step in bold black text on new line */}
            <div className="mt-2">
              <span className="text-black font-bold block">
                • Actionable Step: 
              </span>
              <span className="text-black font-bold">
                {actionableContent}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
  }

  // Render normal point without actionable step
  return (
    <motion.div
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="w-2 h-2 bg-[#fece0a] rounded-full mt-2 flex-shrink-0" />
      <span className="text-brand-muted-text text-sm leading-relaxed">{point}</span>
    </motion.div>
  );
};

const BookPlayerPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Use the global audio player context
  const {
    currentBook: globalCurrentBook,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLoading,
    error: audioError,
    playBook,
    togglePlayPause,
    seekTo,
    setVolume,
    setPlaybackRate
  } = useAudioPlayer();

  // Local states for UI and book data
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [bookInsights, setBookInsights] = useState<BookInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [bookSuggestions, setBookSuggestions] = useState<BookSuggestion[]>([]);

  // Fetch book data from URL parameter
  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) {
        setBookError('No book ID provided');
        setBookLoading(false);
        return;
      }

      setBookLoading(true);
      setBookError(null);

      try {
        console.log(`[BookPlayer] Fetching book data for ID: ${bookId}`);
        
        // Fetch book from Supabase
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();

        if (error) {
          console.error('Error fetching book:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Book not found');
        }

        // Convert database book to UI format
        const book = convertDatabaseBookToBook(data);
        setCurrentBook(book);

        console.log(`[BookPlayer] Book data loaded:`, {
          title: book.title,
          hasAudioUrl: !!book.audioUrl,
          duration: book.duration,
          narrator: book.narrator
        });

      } catch (err: any) {
        console.error('Failed to fetch book data:', err);
        setBookError('Failed to load book. Please try again.');
      } finally {
        setBookLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  // Initialize the book in the global audio player when book data is loaded
  useEffect(() => {
    if (currentBook && (!globalCurrentBook || globalCurrentBook.id !== currentBook.id)) {
      // Convert the book to the format expected by the audio player
      const audioBook = {
        id: currentBook.id,
        title: currentBook.title,
        author: currentBook.author,
        cover: currentBook.cover,
        audioUrl: currentBook.audioUrl,
        duration: currentBook.duration,
        durationSeconds: currentBook.durationSeconds,
        category: currentBook.category,
        isKidsBook: false
      };
      
      // Don't auto-play, just set the book
      playBook(audioBook);
    }
  }, [currentBook, globalCurrentBook, playBook]);

  // Fetch real insights from Supabase
  useEffect(() => {
    const loadBookInsights = async () => {
      if (!currentBook) return;
      
      console.log(`[BookPlayer] Loading insights for: ${currentBook.title}`);
      setInsightsLoading(true);
      
      try {
        const insights = await getBookInsights(currentBook.id, currentBook.title, currentBook.category);
        setBookInsights(insights);
        
        console.log(`[BookPlayer] Insights loaded:`, {
          title: currentBook.title,
          hasRealContent: insights.hasRealContent,
          contentSource: insights.contentSource,
          keyPointsCount: insights.keyPoints.length,
          practicePointsCount: insights.practicePoints.length
        });
      } catch (error) {
        console.error('[BookPlayer] Failed to load insights:', error);
        // Set fallback insights on error
        setBookInsights({
          keyPoints: [
            'Small daily actions compound into significant long-term results',
            'Consistency matters more than intensity in personal development',
            'Environment design shapes behavior more than willpower alone',
            'Identity change precedes lasting behavioral transformation',
            'Systems thinking creates sustainable progress over time'
          ],
          practicePoints: [
            'Implement one small daily practice consistently for 30 days',
            'Design your environment to support desired behaviors',
            'Track progress with simple visual or numerical systems'
          ],
          hasRealContent: false,
          contentSource: 'fallback'
        });
      } finally {
        setInsightsLoading(false);
      }
    };

    loadBookInsights();
  }, [currentBook]);

  // Fetch book suggestions from library with consistent ratings
  useEffect(() => {
    const fetchBookSuggestions = async () => {
      if (!currentBook) return;
      
      try {
        console.log('[BookPlayer] Fetching book suggestions from Supabase...');
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .not('audio_file_url', 'is', null)
          .not('image_url', 'is', null)
          .neq('audio_file_url', '')
          .neq('image_url', '')
          .neq('id', currentBook.id) // Exclude current book
          .limit(3);

        if (error) throw error;

        console.log(`[BookPlayer] Fetched ${data?.length || 0} book suggestions`);

        const suggestions: BookSuggestion[] = (data || []).map(book => {
          const convertedBook = convertDatabaseBookToBook(book);
          return {
            id: book.id,
            title: convertedBook.title,
            author: convertedBook.author,
            cover: convertedBook.cover,
            durationSeconds: convertedBook.durationSeconds,
            duration: convertedBook.duration,
            rating: convertedBook.rating,
            numberOfRatings: convertedBook.numberOfRatings,
            category: convertedBook.category
          };
        });

        setBookSuggestions(suggestions);
      } catch (err) {
        console.error('Error fetching book suggestions:', err);
        // Fallback suggestions if database fetch fails
        setBookSuggestions([]);
      }
    };

    fetchBookSuggestions();
  }, [currentBook]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, [setVolume]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      const newVolume = volume > 0 ? volume : 0.5;
      setVolume(newVolume);
      setIsMuted(false);
    } else {
      setIsMuted(true);
      setVolume(0);
    }
  }, [isMuted, volume, setVolume]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
  }, [setPlaybackRate]);

  const skipTime = useCallback((seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seekTo(newTime);
  }, [currentTime, duration, seekTo]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Enhanced book suggestion click handler
  const handleBookSuggestionClick = async (suggestion: BookSuggestion) => {
    navigate(createBookPlayerUrl(suggestion.id));
  };

  // Loading state
  if (bookLoading) {
    return (
      <div className="min-h-screen bg-brand-light-bg flex items-center justify-center">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-[#fece0a] border-t-transparent rounded-full"
          />
          <span className="text-brand-light-text">Loading book...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (bookError || !currentBook) {
    return (
      <div className="min-h-screen bg-brand-light-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-brand-light-text mb-2">Book Not Found</h2>
          <p className="text-brand-muted-text mb-6">{bookError || 'The requested book could not be found.'}</p>
          <button
            onClick={() => navigate('/my-library')}
            className="bg-[#fece0a] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#e6b809] transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  // Get category color for current book
  const categoryColor = getCategoryColor(currentBook.category);

  // Determine audio mode for status display
  const getAudioMode = () => {
    if (isLoading) return 'loading';
    if (audioError) return 'error';
    if (globalCurrentBook?.audioUrl) return 'real';
    return 'demo';
  };

  const audioMode = getAudioMode();

  return (
    <div className="min-h-screen bg-brand-light-bg text-brand-light-text pb-32">
      <Navbar isInteractive={true} backgroundColor="#eeede9" />
      
      {/* Prominent Back Button at Top */}
      <div className="fixed top-4 left-4 z-50 pt-16">
        <motion.button
          onClick={() => navigate(-1)}
          className="bg-white/90 backdrop-blur-md text-black p-3 rounded-full shadow-2xl hover:bg-white transition-all duration-300 hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ArrowLeft size={24} />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="pt-20 sm:pt-24">
        {/* Hero Section with Floating Book */}
        <div className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8">
          <div className="max-w-6xl w-full">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
              
              {/* Floating Book Cover with Effects */}
              <div className="relative">
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotateY: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 15,
                    transition: { duration: 0.3 }
                  }}
                  style={{ perspective: '1000px' }}
                >
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-20"
                    style={{ 
                      background: 'linear-gradient(45deg, #fece0a, #ff6b6b, #4ecdc4, #45b7d1)',
                      backgroundSize: '300% 300%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Book Cover */}
                  <motion.img
                    src={currentBook.cover}
                    alt={currentBook.title}
                    className="relative w-64 h-auto rounded-2xl shadow-2xl object-cover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                    }}
                    style={{
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                      filter: isPlaying ? 'brightness(1.1) saturate(1.2)' : 'brightness(1)',
                      transformStyle: 'preserve-3d'
                    }}
                    whileHover={{
                      rotateX: 5,
                      transition: { duration: 0.3 }
                    }}
                  />

                  {/* Playing Pulse Effect */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 0.3, 0.8]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-2xl border-4 border-[#fece0a]"
                        style={{
                          boxShadow: '0 0 30px rgba(254, 206, 10, 0.5)'
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Book Information */}
              <div className="text-center lg:text-left max-w-lg">
                <motion.h2 
                  className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold text-brand-light-text mb-4 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  key={currentBook.title} // Re-animate when book changes
                >
                  {currentBook.title}
                </motion.h2>
                
                <motion.p 
                  className="text-xl sm:text-2xl text-brand-muted-text mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  key={currentBook.author}
                >
                  by {currentBook.author}
                </motion.p>
                
                <motion.p 
                  className="text-lg text-brand-muted-text mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  key={currentBook.narrator}
                >
                  Narrated by {currentBook.narrator}
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  key={`${currentBook.category}-${currentBook.rating}-${currentBook.duration}`}
                >
                  <span 
                    className="inline-block text-white text-sm px-6 py-2 rounded-full font-medium"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {currentBook.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" fill="currentColor" />
                    <span className="text-lg font-semibold">{currentBook.rating}</span>
                    <span className="text-sm text-gray-500">({formatRatingCount(currentBook.numberOfRatings)})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-brand-muted-text" />
                    <span className="text-lg font-medium">{currentBook.duration}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Book Key Insights Section with Enhanced Actionable Steps */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            key={currentBook.id} // Re-animate when book changes
          >
            {/* Loading State */}
            {insightsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-[#fece0a] border-t-transparent rounded-full"
                  />
                  <span className="text-brand-muted-text">Loading insights from database...</span>
                </div>
              </div>
            ) : bookInsights ? (
              <>
                {/* Content Source Indicator */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    {bookInsights.hasRealContent ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 rounded-full" />
                        <span className="font-medium"></span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Lightbulb size={16} />
                        <span className="font-medium">Generated insights based on category</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Insights with Enhanced Actionable Steps */}
                <div className="mb-8">
                  <h2 className="text-2xl font-outfit font-bold text-brand-light-text mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#fece0a] rounded-full" />
                    Key Insights from {currentBook.title}
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {bookInsights.keyPoints.length} insights
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookInsights.keyPoints.map((point, index) => (
                      <KeyInsightPoint key={index} point={point} index={index} />
                    ))}
                  </div>
                </div>

                {/* Practice Points */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-outfit font-bold text-brand-light-text mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Ready to put it into practice
                    <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {bookInsights.practicePoints.length} actions
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {bookInsights.practicePoints.map((point, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-brand-light-text font-medium">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Unable to load insights for this book.</p>
              </div>
            )}
          </motion.div>

          {/* Book Suggestions - Horizontal Line */}
          {bookSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-center text-brand-light-text mb-12">
                Continue Your Journey
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {bookSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleBookSuggestionClick(suggestion)}
                  >
                    {/* Book Cover */}
                    <div className="flex justify-center mb-6">
                      <motion.img
                        src={suggestion.cover}
                        alt={suggestion.title}
                        className="w-32 h-48 object-cover rounded-lg shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/200x300/fece0a/000000?text=${encodeURIComponent(suggestion.title.slice(0, 10))}`;
                        }}
                      />
                    </div>
                    
                    {/* Book Info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-lg text-brand-light-text mb-2 overflow-hidden leading-snug">
                        {suggestion.title}
                      </h3>
                      <p className="text-brand-muted-text text-sm mb-4">by {suggestion.author}</p>
                      
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-brand-muted-text" />
                          <span className="text-brand-muted-text font-medium">{suggestion.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" fill="currentColor" />
                          <span className="font-semibold">{suggestion.rating}</span>
                          <span className="text-xs text-gray-400">({formatRatingCount(suggestion.numberOfRatings)})</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Audio Player Controls - Always Show When Book is Loaded */}
      {globalCurrentBook && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"
          style={{
            boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Main Controls - Removed Forward/Backward Arrows Around Play Button */}
            <div className="flex items-center justify-center gap-6 mb-4">
              {/* -15s Button */}
              <motion.button
                onClick={() => skipTime(-15)}
                className="w-16 h-16 bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors flex flex-col items-center justify-center text-xs font-bold shadow-md"
                whileTap={{ scale: 0.95 }}
                title="Skip back 15 seconds"
              >
                <Minus size={14} />
                <span>15s</span>
              </motion.button>

              {/* Main Play/Pause Button */}
              <motion.button
                onClick={togglePlayPause}
                className="bg-brand-accent-start text-black p-4 rounded-full shadow-lg hover:bg-brand-accent-end transition-colors"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
                  />
                ) : isPlaying ? (
                  <Pause size={32} fill="currentColor" />
                ) : (
                  <Play size={32} fill="currentColor" />
                )}
              </motion.button>

              {/* +15s Button */}
              <motion.button
                onClick={() => skipTime(15)}
                className="w-16 h-16 bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors flex flex-col items-center justify-center text-xs font-bold shadow-md"
                whileTap={{ scale: 0.95 }}
                title="Skip forward 15 seconds"
              >
                <Plus size={14} />
                <span>15s</span>
              </motion.button>
            </div>

            {/* Progress Bar - Enhanced with Custom Styling */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-brand-muted-text min-w-[3rem] font-mono">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full audio-progress-slider"
                  style={{
                    background: `linear-gradient(to right, #fece0a 0%, #fece0a ${(currentTime / duration) * 100}%, #9ca3af ${(currentTime / duration) * 100}%, #9ca3af 100%)`
                  }}
                />
              </div>
              <span className="text-sm text-brand-muted-text min-w-[3rem] font-mono">
                {formatTime(duration)}
              </span>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              {/* Volume Controls */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={toggleMute}
                  className="text-brand-muted-text hover:text-brand-light-text transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 volume-slider"
                  style={{
                    background: `linear-gradient(to right, #fece0a 0%, #fece0a ${(isMuted ? 0 : volume) * 100}%, #9ca3af ${(isMuted ? 0 : volume) * 100}%, #9ca3af 100%)`
                  }}
                />
              </div>

              {/* Playback Speed */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-muted-text">Speed:</span>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      playbackRate === rate
                        ? 'bg-brand-accent-start text-black'
                        : 'text-brand-muted-text hover:text-brand-light-text'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookPlayerPage;