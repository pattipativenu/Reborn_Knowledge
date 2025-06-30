import { DatabaseBook } from './supabaseClient';

// Centralized Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  narrator: string;
  cover: string;
  progress: number;
  duration: string;
  durationSeconds: number;
  rating: number;
  numberOfRatings: number;
  category: string;
  isDownloaded: boolean;
  isFavorite: boolean;
  lastPlayed?: string;
  description: string;
  audioUrl?: string;
  hasRealInsights?: boolean;
  fullTextContent?: string;
}

// Fixed rating and rater constants
export const FIXED_RATING_RANGE = { min: 3.7, max: 5.0 };
export const FIXED_RATERS_RANGE = { min: 11000, max: 70000 };

// Category color mapping - centralized for consistency
export const categoryColors: { [key: string]: string } = {
  'Productivity': '#d48638',
  'Startup & Business': '#f49632',
  'Marketing & Sales': '#ff7070',
  'Health & Fitness': '#00a071',
  'Mindfulness & Meditation': '#be9be1',
  'Leadership': '#fdc748',
  'Personal Growth': '#4f5961',
  'Money & Finance': '#c6d85f',
  'Habits & Psychology': '#f2ccdd',
  'Spirituality & Philosophy': '#fff4d7',
  'Relationships': '#feb5b4',
  'Time Management': '#a6cec5',
  'Career & Skills': '#04ada7',
  'Creativity & Writing': '#ff7070',
  'Science & Technology': '#f9d211'
};

// Helper function to format duration from database duration_seconds field
export const formatBookDuration = (durationSeconds: number | null): string => {
  if (!durationSeconds || typeof durationSeconds !== 'number' || isNaN(durationSeconds)) {
    return '0h 0m';
  }
  
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return '1m'; // Minimum display
  }
};

// Helper function to clean book titles - remove dashes and capitalize
export const cleanBookTitle = (title: string | null): string => {
  if (!title) return 'Unknown Title';
  
  // Replace hyphens with spaces and remove extra spaces
  const cleanedTitle = title
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize each word (title case)
  return cleanedTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Generate consistent rating based on book ID (deterministic)
export const generateConsistentRating = (bookId: string): number => {
  // Create a simple hash from the book ID
  let hash = 0;
  for (let i = 0; i < bookId.length; i++) {
    const char = bookId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use absolute value and modulo to get a consistent number between 0 and 1
  const normalizedHash = Math.abs(hash) / 2147483647; // Max 32-bit integer
  
  // Map to rating range (3.7 - 5.0)
  const rating = FIXED_RATING_RANGE.min + (normalizedHash * (FIXED_RATING_RANGE.max - FIXED_RATING_RANGE.min));
  
  // Round to 1 decimal place and ensure it's within range
  return Math.max(FIXED_RATING_RANGE.min, Math.min(FIXED_RATING_RANGE.max, Number(rating.toFixed(1))));
};

// Generate consistent number of ratings based on book ID (deterministic)
export const generateConsistentRaterCount = (bookId: string): number => {
  // Create a different hash for rater count
  let hash = 0;
  for (let i = 0; i < bookId.length; i++) {
    const char = bookId.charCodeAt(i);
    hash = ((hash << 3) - hash) + char + i; // Slightly different algorithm
    hash = hash & hash;
  }
  
  const normalizedHash = Math.abs(hash) / 2147483647;
  
  // Map to rater count range (11,000 - 70,000)
  const raterCount = FIXED_RATERS_RANGE.min + (normalizedHash * (FIXED_RATERS_RANGE.max - FIXED_RATERS_RANGE.min));
  
  // Round to nearest 100 for cleaner numbers
  return Math.round(raterCount / 100) * 100;
};

// Format number of ratings for display
export const formatRatingCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

// Get category color with fallback
export const getCategoryColor = (category: string): string => {
  return categoryColors[category] || '#4f5961';
};

// Function to convert database book to UI book format with consistent ratings
export const convertDatabaseBookToBook = (dbBook: DatabaseBook, hasRealInsights: boolean = false): Book => {
  // Use duration_seconds directly from database
  const durationSeconds = dbBook.duration_seconds || 0;
  const formattedDuration = formatBookDuration(durationSeconds);

  console.log(`[BookUtils] Converting book "${dbBook.title}":`, {
    durationSeconds: durationSeconds,
    formattedDuration: formattedDuration,
    hasRealInsights: hasRealInsights
  });

  // Generate consistent, fixed rating and rater count based on book ID
  const rating = generateConsistentRating(dbBook.id);
  const numberOfRatings = generateConsistentRaterCount(dbBook.id);

  // Generate a random progress for demo purposes (0-100)
  const generateRandomProgress = (): number => {
    return Math.floor(Math.random() * 101);
  };

  // Map category slug to display name
  const getCategoryDisplayName = (slug: string | null): string => {
    if (!slug) return 'Personal Growth';
    
    const categoryMap: { [key: string]: string } = {
      'startup-business': 'Startup & Business',
      'marketing-sales': 'Marketing & Sales',
      'health-fitness': 'Health & Fitness',
      'mindfulness-meditation': 'Mindfulness & Meditation',
      'leadership': 'Leadership',
      'personal-growth': 'Personal Growth',
      'money-finance': 'Money & Finance',
      'habits-psychology': 'Habits & Psychology',
      'spirituality-philosophy': 'Spirituality & Philosophy',
      'relationships': 'Relationships',
      'time-management': 'Time Management',
      'career-skills': 'Career & Skills',
      'creativity-writing': 'Creativity & Writing',
      'science-technology': 'Science & Technology',
      'productivity': 'Productivity'
    };
    
    return categoryMap[slug] || 'Personal Growth';
  };

  // Generate random last played time
  const generateLastPlayed = (): string => {
    const options = ['2 hours ago', '1 day ago', '3 days ago', '5 days ago', '1 week ago'];
    return options[Math.floor(Math.random() * options.length)];
  };

  return {
    id: dbBook.id,
    title: cleanBookTitle(dbBook.title), // Clean title - remove dashes and capitalize
    author: dbBook.author || 'Unknown Author',
    narrator: 'Tara & James (AI characters)', // UPDATED: All books narrated by AI characters
    cover: dbBook.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    progress: generateRandomProgress(),
    duration: formattedDuration,
    durationSeconds: durationSeconds,
    rating: rating,
    numberOfRatings: numberOfRatings,
    category: getCategoryDisplayName(dbBook.category_slug),
    isDownloaded: Math.random() > 0.5, // Random download status
    isFavorite: Math.random() > 0.7, // Random favorite status
    lastPlayed: generateLastPlayed(),
    description: dbBook.description || 'No description available.',
    audioUrl: dbBook.audio_file_url, // Add audio URL for player
    hasRealInsights: hasRealInsights,
    fullTextContent: dbBook.full_text_content
  };
};

// URL parameter utilities
export const createBookPlayerUrl = (bookId: string): string => {
  return `/book-player/${bookId}`;
};

export const createLibraryUrl = (category?: string): string => {
  if (!category || category === 'all') {
    return '/my-library';
  }
  return `/my-library?category=${encodeURIComponent(category)}`;
};

export const createKidsUrl = (category?: string, ageGroup?: string): string => {
  const params = new URLSearchParams();
  if (category && category !== 'all') {
    params.set('category', category);
  }
  if (ageGroup && ageGroup !== 'all') {
    params.set('age', ageGroup);
  }
  
  const queryString = params.toString();
  return queryString ? `/kids?${queryString}` : '/kids';
};