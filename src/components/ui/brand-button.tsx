import React from 'react';
import { MagnetizeButton } from './magnetize-button';
import { cn } from '@/lib/utils';

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  if (variant === 'primary') {
    return (
      <MagnetizeButton
        className={cn(
          'brand-button-primary min-w-40 h-12 px-8',
          className
        )}
        particleCount={15}
        attractRadius={60}
        {...props}
      >
        {children}
      </MagnetizeButton>
    );
  }

  return (
    <button
      className={cn(
        'brand-button-secondary h-12 px-8',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};