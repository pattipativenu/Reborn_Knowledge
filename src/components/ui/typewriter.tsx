'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  style?: React.CSSProperties;
  showCursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
  style = {},
  showCursor = false,
  cursorChar = '|',
  loop = true,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Main typewriter logic
  useEffect(() => {
    if (texts.length === 0) return;

    const currentFullText = texts[currentTextIndex];
    
    const typewriterTimeout = setTimeout(() => {
      if (isPaused) {
        // After pause, start deleting
        setIsPaused(false);
        setIsTyping(false);
      } else if (isTyping) {
        // Typing phase
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        } else {
          // Finished typing, start pause
          setIsPaused(true);
        }
      } else {
        // Deleting phase
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next text
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setIsTyping(true);
        }
      }
    }, isPaused ? pauseDuration : isTyping ? typingSpeed : deletingSpeed);

    return () => clearTimeout(typewriterTimeout);
  }, [
    currentText,
    currentTextIndex,
    isTyping,
    isPaused,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span 
      className={`inline-block ${className}`} 
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap',
        width: 'max-content',
        ...style
      }}
    >
      <span className="typewriter-text">
        {currentText}
      </span>
      {showCursor && (
        <span className="animate-pulse ml-1">
          {cursorChar}
        </span>
      )}
    </span>
  );
};