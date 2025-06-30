import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, DatabaseBook } from '@/lib/supabaseClient';
import { 
  Book,
  convertDatabaseBookToBook,
  formatRatingCount,
  createBookPlayerUrl
} from '@/lib/bookUtils';

interface FavoriteBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fetch real books from Supabase
const fetchRealBooks = async (): Promise<Book[]> => {
  try {
    console.log('[FavoriteBooks] Fetching real books from Supabase...');
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .not('audio_file_url', 'is', null)
      .not('image_url', 'is', null)
      .neq('audio_file_url', '')
      .neq('image_url', '')
      .limit(15); // Get exactly 15 books as requested

    if (error) throw error;

    console.log(`[FavoriteBooks] Fetched ${data?.length || 0} real books`);

    return (data || []).map(book => convertDatabaseBookToBook(book));
  } catch (error) {
    console.error('[FavoriteBooks] Error fetching real books:', error);
    
    // Fallback to placeholder books if database fetch fails
    const fallbackBooks: Book[] = Array.from({ length: 15 }, (_, index) => ({
      id: `fallback-${index + 1}`,
      title: `Book ${index + 1}`,
      author: 'Unknown Author',
      narrator: 'Unknown Narrator',
      cover: `https://storage.googleapis.com/reborn_knowledge/book_covers/${(index % 16) + 1}.jpg`,
      progress: Math.floor(Math.random() * 101),
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      duration: `${Math.floor(Math.random() * 10) + 3}h ${Math.floor(Math.random() * 60)}m`,
      durationSeconds: (Math.floor(Math.random() * 10) + 3) * 3600,
      category: 'Personal Growth',
      numberOfRatings: Math.floor(Math.random() * 50000) + 10000,
      description: 'No description available.',
      isDownloaded: false,
      isFavorite: true
    }));

    return fallbackBooks;
  }
};

const ScrollingBookRow: React.FC<{ 
  books: Book[]; 
  direction: 'left' | 'right'; 
  speed: number;
  onBookClick: (book: Book) => void;
}> = ({ books, direction, speed, onBookClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Measure content width for seamless looping
  useEffect(() => {
    if (scrollRef.current && books.length > 0) {
      // Calculate the width of one complete set of books
      // Each book is 96px wide (w-24) + 16px gap = 112px per book
      const singleSetWidth = books.length * 112; // 112px per book (96px + 16px gap)
      setContentWidth(singleSetWidth);
    }
  }, [books]);

  return (
    <div className="flex overflow-hidden py-2">
      <motion.div
        ref={scrollRef}
        className="flex gap-4 whitespace-nowrap"
        animate={{
          x: direction === 'left' 
            ? [0, -contentWidth] 
            : [-contentWidth, 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        style={{ width: "max-content" }}
      >
        {/* Triple the books for seamless infinite loop */}
        {[...books, ...books, ...books].map((book, index) => (
          <motion.div
            key={`${book.id}-${index}`}
            className="flex-shrink-0 w-24 group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={() => onBookClick(book)}
          >
            <div className="relative">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-36 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/200x300/fece0a/000000?text=${encodeURIComponent(book.title.slice(0, 10))}`;
                }}
              />
              
              {/* Heart icon */}
              <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-90">
                <Heart size={10} fill="white" className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export const FavoriteBooksModal: React.FC<FavoriteBooksModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real books when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadBooks = async () => {
        setLoading(true);
        try {
          const realBooks = await fetchRealBooks();
          setBooks(realBooks);
        } catch (error) {
          console.error('[FavoriteBooks] Failed to load books:', error);
        } finally {
          setLoading(false);
        }
      };

      loadBooks();
    }
  }, [isOpen]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle book click - navigate to book player using URL-based navigation
  const handleBookClick = (book: Book) => {
    console.log('[FavoriteBooks] Book clicked:', book.title);
    
    // Close modal and navigate to book player using URL parameter
    onClose();
    navigate(createBookPlayerUrl(book.id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            
            <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart size={24} className="text-red-600" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Favorite Books</h2>
                  <p className="text-gray-600">Your most loved audiobooks collection</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Close"
              >
                <X 
                  size={28} 
                  className="text-gray-600 group-hover:text-gray-800 transition-colors" 
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 pb-12">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">67</div>
                    <div className="text-sm text-gray-600">Total Favorites</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.6</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                {/* Loading State */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full"
                      />
                      <span className="text-gray-600">Loading your favorite books...</span>
                    </div>
                  </div>
                ) : (
                  /* Auto-scrolling book rows with real covers - using all 15 books */
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Star size={18} className="text-yellow-500" fill="currentColor" />
                        Recently Added Favorites
                      </h3>
                      <ScrollingBookRow 
                        books={books} 
                        direction="left" 
                        speed={40} 
                        onBookClick={handleBookClick}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Heart size={18} className="text-red-500" fill="currentColor" />
                        All-Time Favorites
                      </h3>
                      <ScrollingBookRow 
                        books={books} 
                        direction="right" 
                        speed={45} 
                        onBookClick={handleBookClick}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom note */}
                <div className="mt-8 text-center pb-6">
                  <p className="text-gray-500 text-sm">
                    Hover over any book to see details • Click to start listening
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};