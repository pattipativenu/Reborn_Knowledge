import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  audioUrl?: string;
  duration?: string;
  durationSeconds?: number;
  category?: string;
  isKidsBook?: boolean;
}

interface AudioPlayerState {
  currentBook: Book | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
  error: string | null;
}

interface AudioPlayerContextType extends AudioPlayerState {
  playBook: (book: Book) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  togglePlayPause: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentBook: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isLoading: false,
    error: null,
  });

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({ 
        ...prev, 
        duration: audio.duration || 0,
        isLoading: false 
      }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime || 0 }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handleError = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false,
        error: 'Failed to load audio file' 
      }));
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update audio properties when state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = state.volume;
    audio.playbackRate = state.playbackRate;
  }, [state.volume, state.playbackRate]);

  const playBook = (book: Book) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If it's the same book, just toggle play/pause
    if (state.currentBook?.id === book.id) {
      togglePlayPause();
      return;
    }

    // Set new book and explicitly set isPlaying to false
    setState(prev => ({ 
      ...prev, 
      currentBook: book, 
      currentTime: 0,
      isPlaying: false, // CRITICAL: Explicitly set to false to prevent auto-play
      isLoading: true,
      error: null 
    }));

    // Load new audio source without auto-playing
    if (book.audioUrl) {
      audio.src = book.audioUrl;
      audio.load();
      // Note: Removed the auto-play logic that was previously here
    } else {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'No audio URL provided' 
      }));
    }
  };

  const play = () => {
    const audio = audioRef.current;
    if (!audio || !state.currentBook) return;

    audio.play().catch(error => {
      console.error('Play failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Playback failed. Please try again.' 
      }));
    });
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only pause if the audio is not already paused to prevent interrupting play() requests
    if (!audio.paused) {
      audio.pause();
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setState(prev => ({ 
      ...prev, 
      currentBook: null, 
      isPlaying: false, 
      currentTime: 0,
      duration: 0 
    }));
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(time, state.duration));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const setPlaybackRate = (rate: number) => {
    setState(prev => ({ ...prev, playbackRate: Math.max(0.25, Math.min(3, rate)) }));
  };

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const contextValue: AudioPlayerContextType = {
    ...state,
    playBook,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    setPlaybackRate,
    togglePlayPause,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        style={{ display: 'none' }}
      />
    </AudioPlayerContext.Provider>
  );
};