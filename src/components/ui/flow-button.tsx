'use client';
import { ArrowRight } from 'lucide-react';

export function FlowButton({ 
  text = "Modern Button", 
  onClick, 
  className = "", 
  circleColor = "#fece0a",
  forceBlackText = false,
  ...props 
}: { 
  text?: string; 
  onClick?: () => void;
  className?: string;
  circleColor?: string;
  forceBlackText?: boolean;
  [key: string]: any;
}) {
  return (
    <button 
      className={`group relative flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-[#333333]/40 bg-transparent px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[12px] active:scale-[0.95] ${
        forceBlackText 
          ? 'text-black hover:text-black' 
          : 'text-white hover:text-black'
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Left arrow - conditional styling based on forceBlackText */}
      <ArrowRight 
        className={`absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          forceBlackText 
            ? 'stroke-black' 
            : 'stroke-white group-hover:stroke-black'
        }`}
      />

      {/* Text - conditional styling based on forceBlackText */}
      <span className={`relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out text-center ${
        forceBlackText 
          ? 'text-black' 
          : 'text-white group-hover:text-black'
      }`}>
        {text}
      </span>

      {/* Circle - Background that expands on hover with custom color */}
      <span 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ backgroundColor: circleColor }}
      />

      {/* Right arrow - conditional styling based on forceBlackText */}
      <ArrowRight 
        className={`absolute w-4 h-4 right-4 fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          forceBlackText 
            ? 'stroke-black' 
            : 'stroke-white group-hover:stroke-black'
        }`}
      />
    </button>
  );
}