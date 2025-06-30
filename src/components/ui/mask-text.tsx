'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MaskTextProps {
  phrases: string[];
  tag?: 'h1' | 'h2' | 'p';
  className?: string;
}

export const MaskText: React.FC<MaskTextProps> = ({
  phrases,
  tag = 'h1',
  className,
}) => {
  // Animation variants for the mask effect
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.075,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: '100%',
    },
    visible: {
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1], // cubic-bezier(0.33, 1, 0.68, 1)
      },
    },
  };

  // Get the appropriate styling based on tag and background context
  const getTagStyles = (tag: 'h1' | 'h2' | 'p') => {
    switch (tag) {
      case 'h1':
        return 'brand-hero-text text-brand-dark-text';
      case 'h2':
        return 'brand-h2 text-brand-light-text';
      case 'p':
        return 'brand-body text-brand-dark-text/90';
      default:
        return 'brand-hero-text text-brand-dark-text';
    }
  };

  const MotionComponent = motion[tag];
  const tagStyles = getTagStyles(tag);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.75 }}
      className={cn('', className)}
    >
      {phrases.map((phrase, index) => (
        <div key={index} className="overflow-hidden">
          <MotionComponent
            variants={itemVariants}
            className={cn('block', tagStyles, className)}
          >
            {phrase}
          </MotionComponent>
        </div>
      ))}
    </motion.div>
  );
};