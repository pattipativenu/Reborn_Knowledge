import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { createLibraryUrl } from '@/lib/bookUtils';
import gsap from 'gsap';

const ShuffleHero = () => {
  const navigate = useNavigate();

  // The project data for the gallery - exactly as provided
  const projects = [
    { title: "Startup & Business", color: "#f49632" },
    { title: "Marketing & Sales", color: "#ff7070" },
    { title: "Health & Fitness", color: "#00a071" },
    { title: "Mindfulness & Meditation", color: "#be9be1" },
    { title: "Leadership", color: "#fdc748" },
    { title: "Personal Growth", color: "#ea7e4f" },
    { title: "Money & Finance", color: "#c6d85f" },
    { title: "Productivity", color: "#d48638" },
    { title: "More...", color: "#A9A9A9" }
  ];

  // Handle mouse enter event for a project item
  const manageMouseEnter = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
    gsap.to(e.currentTarget, {
      top: "-2vw",
      backgroundColor: color,
      borderTopColor: color,
      borderBottomColor: color,
      duration: 0.3
    });
  };

  // Handle mouse leave event, resetting the item's style
  const manageMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      top: "0",
      backgroundColor: "#212121",
      borderTopColor: "#212121",
      borderBottomColor: "#212121",
      duration: 0.3,
      delay: 0.1
    });
  };

  // Handle category click with URL-based navigation
  const handleCategoryClick = (categoryTitle: string) => {
    if (categoryTitle === "More...") {
      // Navigate to My Library without specific category
      navigate('/my-library');
    } else {
      // Navigate to My Library with the selected category using URL parameters
      navigate(createLibraryUrl(categoryTitle));
    }
  };

  // Scrolling Text Component
  const ScrollingText = ({ text }: { text: string }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      const checkOverflow = () => {
        if (textRef.current && containerRef.current) {
          const textWidth = textRef.current.scrollWidth;
          const containerWidth = containerRef.current.clientWidth;
          setIsOverflowing(textWidth > containerWidth);
        }
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    const scrollDistance = isOverflowing && textRef.current && containerRef.current 
      ? textRef.current.scrollWidth - containerRef.current.clientWidth + 20 // Add 20px padding
      : 0;

    return (
      <div 
        ref={containerRef}
        className="overflow-hidden w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.p
          ref={textRef}
          className="pointer-events-none text-white uppercase font-bold whitespace-nowrap"
          style={{
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            padding: 'clamp(0.5rem, 1vw, 1.5rem) clamp(1rem, 2vw, 2rem)',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2
          }}
          animate={{
            x: isHovered && isOverflowing ? -scrollDistance : 0
          }}
          transition={{
            duration: isOverflowing ? Math.max(2, scrollDistance / 50) : 0.3,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      </div>
    );
  };

  return (
    <section className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-12 max-w-7xl mx-auto">
      {/* Left Side - Category List */}
      <div className="flex flex-col justify-center">
        <span className="block mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-brand-accent-start font-medium">
        </span>
        
        {/* Category Container with perfect height alignment */}
        <div 
          className="relative w-full"
          style={{
            // Ensure perfect height alignment with shuffle grid
            height: '500px', // Match the shuffle grid height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Map over the projects array to create interactive items */}
          {projects.map((project, index) => (
            <div
              key={index}
              className="cursor-pointer relative group"
              style={{
                // Apply the original styles with responsive sizing
                borderTop: '1px solid #212121',
                borderBottom: '1px solid #212121',
                position: 'relative',
                marginBottom: '-2vw', // Slightly reduced for better fit
                backgroundColor: '#212121',
                zIndex: 1
              }}
              onMouseEnter={(e) => manageMouseEnter(e, project.color)}
              onMouseLeave={(e) => manageMouseLeave(e)}
              onClick={() => handleCategoryClick(project.title)}
            >
              <ScrollingText text={project.title} />
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Shuffle Grid */}
      <div className="flex items-center justify-center">
        <ShuffleGrid />
      </div>
    </section>
  );
};

const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

interface SquareData {
  id: number;
  src: string;
}

const squareData: SquareData[] = [
  {
    id: 1,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/1.jpg",
  },
  {
    id: 2,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/2.jpg",
  },
  {
    id: 3,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/3.jpg",
  },
  {
    id: 4,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/4.jpg",
  },
  {
    id: 5,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/5.jpg",
  },
  {
    id: 6,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/6.jpg",
  },
  {
    id: 7,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/7.jpg",
  },
  {
    id: 8,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/8.jpg",
  },
  {
    id: 9,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/9.jpg",
  },
  {
    id: 10,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/10.jpg",
  },
  {
    id: 11,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/11.jpg",
  },
  {
    id: 12,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/12.jpg",
  },
  {
    id: 13,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/13.jpg",
  },
  {
    id: 14,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/14.jpg",
  },
  {
    id: 15,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/15.jpg",
  },
  {
    id: 16,
    src: "https://storage.googleapis.com/reborn_knowledge/book_covers/16.jpg",
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-lg overflow-hidden shadow-lg"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] gap-1 sm:gap-2 max-w-full">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;