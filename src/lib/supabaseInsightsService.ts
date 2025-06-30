// Supabase Insights Service - Fetch and cache book insights with comprehensive parsing
import { supabase, DatabaseBook } from './supabaseClient';
import { parseBookInsights, BookInsights, validateInsights } from './bookInsightsParser';

interface CachedInsights {
  [bookId: string]: {
    insights: BookInsights;
    timestamp: number;
    version: string;
  };
}

// Cache insights in memory to avoid repeated parsing
const insightsCache: CachedInsights = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const CACHE_VERSION = '2.0'; // Updated version for comprehensive parsing

// Fetch all books with insights from Supabase
export const fetchBooksWithInsights = async (): Promise<{
  books: DatabaseBook[];
  insightsCount: number;
  totalBooks: number;
}> => {
  console.log('[InsightsService] Fetching books with insights from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .not('audio_file_url', 'is', null)
      .not('image_url', 'is', null)
      .neq('audio_file_url', '')
      .neq('image_url', '')
      .order('id', { ascending: false });

    if (error) {
      console.error('[InsightsService] Error fetching books:', error);
      throw error;
    }

    const books = data || [];
    console.log(`[InsightsService] Fetched ${books.length} total books from database`);

    // Count books that have actual insights content
    let insightsCount = 0;
    const booksWithContent: string[] = [];
    
    for (const book of books) {
      if (book.full_text_content && 
          book.full_text_content.trim() !== '' && 
          book.full_text_content.trim().toLowerCase() !== 'null') {
        insightsCount++;
        booksWithContent.push(book.title || book.id);
      }
    }

    console.log(`[InsightsService] Found ${insightsCount} books with full_text_content:`);
    console.log(`[InsightsService] Books with content: ${booksWithContent.slice(0, 5).join(', ')}${booksWithContent.length > 5 ? ` and ${booksWithContent.length - 5} more...` : ''}`);

    return {
      books,
      insightsCount,
      totalBooks: books.length
    };
  } catch (error) {
    console.error('[InsightsService] Failed to fetch books:', error);
    throw error;
  }
};

// Get insights for a specific book (with caching)
export const getBookInsights = async (bookId: string, bookTitle: string, category: string): Promise<BookInsights> => {
  console.log(`[InsightsService] Getting insights for book: ${bookTitle} (${bookId})`);

  // Check cache first
  const cached = insightsCache[bookId];
  if (cached && 
      cached.version === CACHE_VERSION &&
      Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[InsightsService] Using cached insights for ${bookTitle}:`, {
      keyPointsCount: cached.insights.keyPoints.length,
      practicePointsCount: cached.insights.practicePoints.length,
      hasRealContent: cached.insights.hasRealContent
    });
    return cached.insights;
  }

  try {
    // Fetch specific book from database
    console.log(`[InsightsService] Fetching fresh data for book ${bookId} from database...`);
    const { data, error } = await supabase
      .from('books')
      .select('full_text_content, title, category_slug')
      .eq('id', bookId)
      .single();

    if (error) {
      console.error(`[InsightsService] Error fetching book ${bookId}:`, error);
      throw error;
    }

    if (!data) {
      console.log(`[InsightsService] No data found for book ${bookId}`);
      throw new Error('Book not found');
    }

    console.log(`[InsightsService] Raw book data fetched:`, {
      title: data.title,
      category_slug: data.category_slug,
      hasFullTextContent: !!data.full_text_content,
      contentLength: data.full_text_content?.length || 0,
      contentType: typeof data.full_text_content,
      isNullString: data.full_text_content === 'null',
      isEmpty: data.full_text_content === '',
      contentStart: data.full_text_content ? data.full_text_content.substring(0, 200) : 'NO CONTENT'
    });

    // Parse insights from full_text_content with comprehensive parsing
    console.log(`[InsightsService] Starting comprehensive parsing for ${bookTitle}...`);
    const insights = parseBookInsights(data.full_text_content, bookTitle, category);
    const validatedInsights = validateInsights(insights);

    // Cache the insights
    insightsCache[bookId] = {
      insights: validatedInsights,
      timestamp: Date.now(),
      version: CACHE_VERSION
    };

    console.log(`[InsightsService] Successfully processed insights for ${bookTitle}:`, {
      keyPointsCount: validatedInsights.keyPoints.length,
      practicePointsCount: validatedInsights.practicePoints.length,
      hasRealContent: validatedInsights.hasRealContent,
      contentSource: validatedInsights.contentSource,
      firstKeyPoint: validatedInsights.keyPoints[0]?.substring(0, 100) + '...' || 'None',
      firstPracticePoint: validatedInsights.practicePoints[0]?.substring(0, 100) + '...' || 'None'
    });

    return validatedInsights;
  } catch (error) {
    console.error(`[InsightsService] Failed to get insights for book ${bookId}:`, error);
    
    // Return fallback insights on error
    console.log(`[InsightsService] Using fallback insights for ${bookTitle} due to error`);
    const fallbackInsights = parseBookInsights(null, bookTitle, category);
    return validateInsights(fallbackInsights);
  }
};

// Batch fetch insights for multiple books
export const getBatchBookInsights = async (books: { id: string; title: string; category: string }[]): Promise<{ [bookId: string]: BookInsights }> => {
  console.log(`[InsightsService] Batch fetching insights for ${books.length} books`);

  const results: { [bookId: string]: BookInsights } = {};
  let successCount = 0;
  let fallbackCount = 0;

  // Process books in chunks to avoid overwhelming the database
  const chunkSize = 5; // Reduced chunk size for more careful processing
  for (let i = 0; i < books.length; i += chunkSize) {
    const chunk = books.slice(i, i + chunkSize);
    console.log(`[InsightsService] Processing chunk ${Math.floor(i/chunkSize) + 1} of ${Math.ceil(books.length/chunkSize)} (${chunk.length} books)`);
    
    const chunkPromises = chunk.map(async (book) => {
      try {
        const insights = await getBookInsights(book.id, book.title, book.category);
        results[book.id] = insights;
        if (insights.hasRealContent) {
          successCount++;
        } else {
          fallbackCount++;
        }
        console.log(`[InsightsService] ✓ Processed ${book.title}: ${insights.keyPoints.length} key points, ${insights.practicePoints.length} practice points (${insights.contentSource})`);
      } catch (error) {
        console.error(`[InsightsService] ✗ Failed to get insights for ${book.title}:`, error);
        // Use fallback for failed books
        results[book.id] = parseBookInsights(null, book.title, book.category);
        fallbackCount++;
      }
    });

    await Promise.all(chunkPromises);
    
    // Small delay between chunks to be respectful to the database
    if (i + chunkSize < books.length) {
      console.log(`[InsightsService] Waiting 200ms before next chunk...`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log(`[InsightsService] Batch processing completed:`, {
    totalProcessed: Object.keys(results).length,
    successfulParsing: successCount,
    fallbackUsed: fallbackCount,
    successRate: `${Math.round((successCount / books.length) * 100)}%`
  });

  return results;
};

// Clear insights cache
export const clearInsightsCache = (): void => {
  const beforeCount = Object.keys(insightsCache).length;
  Object.keys(insightsCache).forEach(key => delete insightsCache[key]);
  console.log(`[InsightsService] Insights cache cleared (removed ${beforeCount} cached items)`);
};

// Get detailed cache statistics
export const getCacheStats = () => {
  const totalCached = Object.keys(insightsCache).length;
  const realContentCount = Object.values(insightsCache).filter(cached => cached.insights.hasRealContent).length;
  const avgKeyPoints = Object.values(insightsCache).reduce((sum, cached) => sum + cached.insights.keyPoints.length, 0) / totalCached || 0;
  const avgPracticePoints = Object.values(insightsCache).reduce((sum, cached) => sum + cached.insights.practicePoints.length, 0) / totalCached || 0;
  
  return {
    totalCached,
    realContentCount,
    fallbackCount: totalCached - realContentCount,
    cacheVersion: CACHE_VERSION,
    averageKeyPoints: Math.round(avgKeyPoints * 10) / 10,
    averagePracticePoints: Math.round(avgPracticePoints * 10) / 10,
    successRate: totalCached > 0 ? `${Math.round((realContentCount / totalCached) * 100)}%` : '0%'
  };
};

// Debug function to inspect a specific book's content
export const debugBookContent = async (bookId: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, full_text_content')
      .eq('id', bookId)
      .single();

    if (error) throw error;

    console.log(`[InsightsService] DEBUG - Book Content for ${data.title}:`);
    console.log(`[InsightsService] Content length: ${data.full_text_content?.length || 0}`);
    console.log(`[InsightsService] Content type: ${typeof data.full_text_content}`);
    console.log(`[InsightsService] Is null string: ${data.full_text_content === 'null'}`);
    console.log(`[InsightsService] Is empty: ${data.full_text_content === ''}`);
    console.log(`[InsightsService] Raw content preview (first 500 chars):`);
    console.log(data.full_text_content ? data.full_text_content.substring(0, 500) : 'NO CONTENT');
    
    if (data.full_text_content) {
      const insights = parseBookInsights(data.full_text_content, data.title, 'Unknown');
      console.log(`[InsightsService] Parsed insights:`, {
        keyPointsCount: insights.keyPoints.length,
        practicePointsCount: insights.practicePoints.length,
        hasRealContent: insights.hasRealContent,
        firstKeyPoint: insights.keyPoints[0] || 'None',
        firstPracticePoint: insights.practicePoints[0] || 'None'
      });
    }
  } catch (error) {
    console.error(`[InsightsService] Debug failed for book ${bookId}:`, error);
  }
};