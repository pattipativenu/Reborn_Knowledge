"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Brand {
  name: string;
  logo: string;
}

interface BrandsScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  brands: Brand[];
  speed?: number;
}

export const BrandsScroll = React.forwardRef<HTMLDivElement, BrandsScrollProps>(
  ({ 
    className,
    title = "Trusted and Loved by the World's Leading Tech Companies",
    brands,
    speed = 80, // Slower motion - increased from 50 to 80 seconds
    ...props 
  }, ref) => {
    // Triple the brands array for seamless infinite loop
    const extendedBrands = [...brands, ...brands, ...brands];

    return (
      <div
        ref={ref}
        className={cn("py-16 bg-brand-dark-bg overflow-hidden", className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <p className="text-base sm:text-lg font-manrope text-brand-muted-text text-center mb-12 max-w-4xl mx-auto px-4">
              "{title}"
            </p>
          )}

          {/* Infinite scrolling container */}
          <div className="relative">
            {/* Gradient fade effects on sides for smooth visual transitions */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-dark-bg via-brand-dark-bg/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-dark-bg via-brand-dark-bg/80 to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling brands container with perfect loop */}
            <div className="flex overflow-hidden">
              <motion.div
                className="flex items-center gap-16 sm:gap-20 md:gap-24 whitespace-nowrap"
                animate={{
                  x: [0, `-${100 / 3}%`] // Move exactly one-third to create seamless loop
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: speed,
                    ease: "linear",
                  },
                }}
                style={{
                  width: "max-content"
                }}
              >
                {extendedBrands.map((brand, index) => (
                  <motion.div 
                    key={`${brand.name}-${index}`} 
                    className="flex-shrink-0 flex items-center justify-center group cursor-pointer"
                    style={{
                      width: '200px', // Increased from 160px
                      height: '80px'  // Increased from 60px
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      duration: 0.3 
                    }}
                  >
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="opacity-70 group-hover:opacity-100 transition-all duration-500 filter grayscale group-hover:grayscale-0"
                      style={{
                        width: '150px',      // Increased from 120px
                        height: '50px',      // Increased from 40px
                        objectFit: 'contain' // Maintain aspect ratio within fixed dimensions
                      }}
                      onError={(e) => {
                        // Fallback to a simple text logo if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-text text-brand-dark-text font-semibold text-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500'; // Increased from text-lg to text-xl
                          fallback.textContent = brand.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BrandsScroll.displayName = "BrandsScroll";