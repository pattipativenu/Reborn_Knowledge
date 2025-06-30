import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { createBookPlayerUrl } from '@/lib/bookUtils';

const MiniPlayer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    stop,
    seekTo,
    setVolume
  } = useAudioPlayer();

  // FIXED: Properly detect book player page by checking if pathname starts with '/book-player/'
  const isOnBookPlayerPage = location.pathname.startsWith('/book-player/') || location.pathname === '/book-player';
  
  // Don't show mini player on book player page or when no book is loaded
  const shouldShow = currentBook && !isOnBookPlayerPage;

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };

  // FIXED: Updated to use proper URL-based navigation with book ID
  const handleMiniPlayerClick = () => {
    if (currentBook) {
      // Use the proper URL format that BookPlayerPage expects
      navigate(createBookPlayerUrl(currentBook.id));
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlayPause();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          className="mini-player"
          onClick={handleMiniPlayerClick}
        >
          {/* Left Section: Book Cover + Play Button */}
          <div className="mini-player-left-section">
            <div className="mini-player-cover">
              <img
                src={currentBook?.cover}
                alt={currentBook?.title}
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={handlePlayPause}
              className="mini-player-play-btn"
            >
              {isPlaying ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
            </button>
          </div>

          {/* Center Section: Book Title + Progress Bar */}
          <div className="mini-player-center-section">
            <div className="mini-player-title">
              {currentBook?.title}
            </div>
            <div 
              className="mini-player-progress"
              onClick={handleProgressClick}
            >
              <div className="mini-player-progress-bg">
                <motion.div
                  className="mini-player-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </div>

          {/* Right Section: Sound and Close Controls (Speed removed) */}
          <div className="mini-player-right-section">
            <button
              onClick={toggleMute}
              className="mini-player-control-btn"
              title={volume > 0 ? "Mute" : "Unmute"}
            >
              {volume > 0 ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            
            <button
              onClick={handleStop}
              className="mini-player-control-btn mini-player-close-btn"
              title="Close Player"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniPlayer;