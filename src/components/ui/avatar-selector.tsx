import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
  currentAvatar: string;
}

const avatars = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face'
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentAvatar
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleSelect = () => {
    onSelect(selectedAvatar);
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
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Choose Avatar</h3>
              <button
                onClick={onClose}
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

            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatars.map((avatar, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all ${
                    selectedAvatar === avatar
                      ? 'border-[#fece0a] scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: selectedAvatar === avatar ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatar === avatar && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-[#fece0a]/20 flex items-center justify-center"
                    >
                      <div className="bg-[#fece0a] text-black p-1 rounded-full">
                        <Check size={16} />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSelect}
                className="flex-1 px-4 py-2 bg-[#fece0a] text-black rounded-lg hover:bg-[#e6b809] transition-colors"
              >
                Select Avatar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};