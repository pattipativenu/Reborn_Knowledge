import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  pageBackgroundColor?: string;
  variant?: 'default' | 'account';
}

export function BackButton({ onClick, className = "", pageBackgroundColor = "#ffffff", variant = 'default' }: BackButtonProps) {
  // Special styling for account page
  if (variant === 'account') {
    return (
      <Button 
        className={`group relative overflow-hidden transition-all duration-500 border-0 outline-none shadow-none ${className}`}
        onClick={onClick}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          color: '#000000',
          padding: '12px 32px',
          borderRadius: '6px',
        }}
      >
        <span 
          className="w-20 translate-x-2 transition-opacity duration-500 group-hover:opacity-0 font-medium"
          style={{ 
            color: '#000000',
            backgroundColor: 'transparent',
          }}
        >
          Back
        </span>
        <i 
          className="absolute inset-0 z-10 grid w-1/4 place-items-center transition-all duration-500 group-hover:w-full"
          style={{
            backgroundColor: '#fece0a', // Changed to yellow
          }}
        >
          <ArrowLeft
            className="transition-colors duration-500"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            style={{ color: '#000000' }} // Black arrow
          />
        </i>
      </Button>
    );
  }

  // Default styling for other pages
  // For gradient backgrounds, extract a representative color or use a transparent approach
  const getBackgroundStyle = () => {
    if (pageBackgroundColor.includes('linear-gradient') || pageBackgroundColor.includes('gradient')) {
      // For gradients, make the button completely transparent to blend seamlessly
      return {
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Very subtle white overlay
      };
    }
    
    // For solid colors, use the exact color
    return {
      backgroundColor: pageBackgroundColor,
    };
  };

  // Determine text color based on background
  const getTextColor = () => {
    if (pageBackgroundColor.includes('linear-gradient') || pageBackgroundColor.includes('gradient')) {
      return '#ffffff'; // White text for gradient backgrounds (usually dark)
    }
    
    // For solid colors, calculate contrast
    const hex = pageBackgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const backgroundStyle = getBackgroundStyle();
  const textColor = getTextColor();
  const arrowColor = '#000000'; // Arrow is always black for contrast on white hover overlay

  return (
    <Button 
      className={`group relative overflow-hidden transition-all duration-500 border-0 outline-none shadow-none ${className}`}
      onClick={onClick}
      style={{
        ...backgroundStyle,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        color: textColor,
        padding: '12px 32px',
        borderRadius: '6px',
      }}
    >
      <span 
        className="w-20 translate-x-2 transition-opacity duration-500 group-hover:opacity-0 font-medium"
        style={{ 
          color: textColor,
          backgroundColor: 'transparent',
        }}
      >
        Back
      </span>
      <i 
        className="absolute inset-0 z-10 grid w-1/4 place-items-center transition-all duration-500 group-hover:w-full"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white overlay on hover
        }}
      >
        <ArrowLeft
          className="transition-colors duration-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          style={{ color: arrowColor }}
        />
      </i>
    </Button>
  );
}