import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus } from 'lucide-react';

interface GenreSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (genres: string[]) => void;
  currentGenres: string[];
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentGenres
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentGenres);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // All available categories from My Library (excluding 'all')
  const availableGenres = [
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
  ];

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  const handleConfirm = () => {
    onSelect(selectedGenres);
    onClose();
  };

  const handleCancel = () => {
    setSelectedGenres(currentGenres);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-800">Select Favorite Genres</h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Close"
              >
                {/* ENHANCED CANCEL ICON WITH BETTER VISIBILITY */}
                <X 
                  size={24} 
                  className="text-gray-600 group-hover:text-gray-800 transition-colors" 
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-3">
                {availableGenres.map((genre, index) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <motion.button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#fece0a] bg-[#fece0a]/10 text-[#fece0a] shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-base">{genre}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-[#fece0a] text-black p-1.5 rounded-full"
                          >
                            <Check size={16} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
                
                {/* Extra padding at bottom for better scrolling experience */}
                <div className="h-4"></div>
              </div>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="border-t border-gray-200 p-6 flex-shrink-0 bg-white rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-[#fece0a] text-black rounded-lg hover:bg-[#e6b809] transition-colors font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedGenres.length === 0}
                  style={{
                    opacity: selectedGenres.length === 0 ? 0.5 : 1,
                    cursor: selectedGenres.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Check size={16} />
                  Confirm ({selectedGenres.length})
                </motion.button>
              </div>
              
              {/* Selection Summary */}
              {selectedGenres.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center"
                >
                  <p className="text-sm text-gray-600">
                    {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};