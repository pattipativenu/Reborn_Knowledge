// Book Insights Parser - Extract ALL key insights from full_text_content exactly as they appear
export interface BookInsights {
  keyPoints: string[];
  practicePoints: string[];
  hasRealContent: boolean;
  contentSource: 'database' | 'fallback';
}

// Enhanced parser that captures ALL content without limitations and preserves exact structure
export const parseBookInsights = (fullTextContent: string | null, bookTitle: string, category: string): BookInsights => {
  console.log(`[InsightsParser] Parsing insights for: ${bookTitle}`);
  console.log(`[InsightsParser] Full text content length: ${fullTextContent?.length || 0}`);
  
  if (!fullTextContent || fullTextContent.trim() === '' || fullTextContent.trim().toLowerCase() === 'null') {
    console.log(`[InsightsParser] No valid content found, using fallback insights`);
    return generateFallbackInsights(bookTitle, category);
  }

  const content = fullTextContent.trim();
  console.log(`[InsightsParser] Content preview: ${content.substring(0, 300)}...`);

  // Try multiple parsing strategies in order of preference
  const insights = tryParseKeyInsightsFormat(content) ||
                  tryParseStructuredContent(content) || 
                  tryParseAlternativeFormats(content) || 
                  tryParseNaturalLanguage(content);

  if (insights && (insights.keyPoints.length > 0 || insights.practicePoints.length > 0)) {
    console.log(`[InsightsParser] Successfully parsed ${insights.keyPoints.length} key points and ${insights.practicePoints.length} practice points`);
    return {
      ...insights,
      hasRealContent: true,
      contentSource: 'database'
    };
  }

  console.log(`[InsightsParser] Parsing failed, using fallback insights`);
  return generateFallbackInsights(bookTitle, category);
};

// Strategy 1: Parse "Key Insights:" format specifically with enhanced numbered point extraction
const tryParseKeyInsightsFormat = (content: string): BookInsights | null => {
  try {
    console.log('[InsightsParser] Trying Key Insights format parsing...');
    
    // Enhanced regex to capture Key Insights section until practice section or separator
    const keyInsightsMatch = content.match(/Key Insights?:\s*(.*?)(?:_{10,}|Ready to [Pp]ut.*?into [Pp]ractice|Put into Practice|________________|$)/is);
    
    // Enhanced regex for practice sections with various headers
    const practiceMatch = content.match(/(?:Ready to [Pp]ut.*?into [Pp]ractice|Put into Practice)[^:]*:?\s*(.*?)$/is);
    
    if (keyInsightsMatch) {
      const keyInsightsContent = keyInsightsMatch[1];
      console.log(`[InsightsParser] Found Key Insights content: ${keyInsightsContent.substring(0, 200)}...`);
      
      // Use enhanced numbered point extraction for key insights
      const keyPoints = extractNumberedPoints(keyInsightsContent);
      
      // Use enhanced bullet point extraction for practice points that handles headings with "in:" descriptions
      const practicePoints = practiceMatch ? extractEnhancedBulletPoints(practiceMatch[1]) : [];
      
      console.log(`[InsightsParser] Key Insights parsing found ${keyPoints.length} key points, ${practicePoints.length} practice points`);
      
      if (keyPoints.length > 0 || practicePoints.length > 0) {
        return { keyPoints, practicePoints, hasRealContent: true, contentSource: 'database' };
      }
    }
  } catch (error) {
    console.log('[InsightsParser] Key Insights parsing error:', error);
  }
  return null;
};

// Strategy 2: Parse structured content with KEY_POINTS and PRACTICE_POINTS sections
const tryParseStructuredContent = (content: string): BookInsights | null => {
  try {
    console.log('[InsightsParser] Trying structured content parsing...');
    
    // Look for KEY_POINTS section with comprehensive regex
    const keyPointsMatch = content.match(/KEY_POINTS:\s*((?:(?:•[^\n]*(?:\n|$))+|(?:[^\n]*(?:\n|$))+)*?)(?=PRACTICE_POINTS:|$)/is);
    const practicePointsMatch = content.match(/PRACTICE_POINTS:\s*((?:(?:•[^\n]*(?:\n|$))+|(?:[^\n]*(?:\n|$))+)*?)$/is);
    
    if (keyPointsMatch || practicePointsMatch) {
      const keyPoints = keyPointsMatch ? extractPointsFromBlock(keyPointsMatch[1]) : [];
      const practicePoints = practicePointsMatch ? extractEnhancedBulletPoints(practicePointsMatch[1]) : [];
      
      console.log(`[InsightsParser] Structured parsing found ${keyPoints.length} key points, ${practicePoints.length} practice points`);
      
      if (keyPoints.length > 0 || practicePoints.length > 0) {
        return { keyPoints, practicePoints, hasRealContent: true, contentSource: 'database' };
      }
    }
  } catch (error) {
    console.log('[InsightsParser] Structured parsing error:', error);
  }
  return null;
};

// Strategy 3: Parse alternative formats (numbered lists, different bullet styles)
const tryParseAlternativeFormats = (content: string): BookInsights | null => {
  try {
    console.log('[InsightsParser] Trying alternative formats parsing...');
    
    // Split content into sections based on common headers
    const sections = content.split(/(?=(?:Key Insights?|Practice|Implementation|Action|Ready to put))/i);
    
    let keyPoints: string[] = [];
    let practicePoints: string[] = [];
    
    for (const section of sections) {
      if (/^(?:Key Insights?|Insights?)/i.test(section.trim())) {
        keyPoints = extractNumberedPoints(section) || extractPointsFromBlock(section);
      } else if (/^(?:Practice|Implementation|Action|Ready to put)/i.test(section.trim())) {
        practicePoints = extractEnhancedBulletPoints(section) || extractPointsFromBlock(section);
      }
    }
    
    console.log(`[InsightsParser] Alternative parsing found ${keyPoints.length} key points, ${practicePoints.length} practice points`);
    
    if (keyPoints.length > 0 || practicePoints.length > 0) {
      return { keyPoints, practicePoints, hasRealContent: true, contentSource: 'database' };
    }
  } catch (error) {
    console.log('[InsightsParser] Alternative format parsing error:', error);
  }
  return null;
};

// Strategy 4: Parse natural language content as fallback
const tryParseNaturalLanguage = (content: string): BookInsights | null => {
  try {
    console.log('[InsightsParser] Trying natural language parsing...');
    
    const allPoints = extractPointsFromBlock(content);
    
    if (allPoints.length >= 3) {
      // Split items between key points and practice points (70/30 split)
      const splitIndex = Math.ceil(allPoints.length * 0.7);
      const keyPoints = allPoints.slice(0, splitIndex);
      const practicePoints = allPoints.slice(splitIndex);
      
      console.log(`[InsightsParser] Natural language parsing found ${keyPoints.length} key points, ${practicePoints.length} practice points`);
      
      return { 
        keyPoints, 
        practicePoints, 
        hasRealContent: true, 
        contentSource: 'database' 
      };
    }
  } catch (error) {
    console.log('[InsightsParser] Natural language parsing error:', error);
  }
  return null;
};

// NEW: Enhanced function to extract numbered points with ALL their content including actionable steps
const extractNumberedPoints = (text: string): string[] => {
  if (!text || text.trim() === '') return [];
  
  const points: string[] = [];
  const cleanText = text.trim();
  
  console.log(`[InsightsParser] Extracting numbered points from block (${cleanText.length} chars)`);
  
  // Enhanced regex to capture numbered points with ALL their content including nested bullet points
  // This captures everything from "1." until the next number or end of content
  const numberedMatches = cleanText.match(/(\d+)\.\s*([^]*?)(?=(?:\d+\.|$))/g);
  
  if (numberedMatches && numberedMatches.length > 0) {
    console.log(`[InsightsParser] Found ${numberedMatches.length} numbered points`);
    
    for (const match of numberedMatches) {
      // Remove the number prefix but keep ALL content including actionable steps
      const cleanPoint = match.replace(/^\d+\.\s*/, '').trim();
      
      if (cleanPoint.length > 0) {
        // Preserve line breaks and bullet points within the numbered item
        const formattedPoint = cleanPoint
          .replace(/\n\s*\*\s*/g, '\n• ') // Convert * bullets to •
          .replace(/\n\s*-\s*/g, '\n• ') // Convert - bullets to •
          .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
          .trim();
        
        points.push(formattedPoint);
        console.log(`[InsightsParser] Extracted numbered point ${points.length}: ${formattedPoint.substring(0, 100)}...`);
      }
    }
  }
  
  return points;
};

// ENHANCED: Function to extract bullet points with proper handling of headings and "in:" descriptions
const extractEnhancedBulletPoints = (text: string): string[] => {
  if (!text || text.trim() === '') return [];
  
  const points: string[] = [];
  const cleanText = text.trim();
  
  console.log(`[InsightsParser] Extracting enhanced bullet points from block (${cleanText.length} chars)`);
  
  // Enhanced regex to capture bullet points with multi-line support, including content until next bullet
  const bulletMatches = cleanText.match(/[•\-\*]\s*([^]*?)(?=[•\-\*]|$)/g);
  
  if (bulletMatches && bulletMatches.length > 0) {
    console.log(`[InsightsParser] Found ${bulletMatches.length} bullet points`);
    
    for (let i = 0; i < bulletMatches.length; i++) {
      const match = bulletMatches[i];
      const cleanPoint = match.replace(/^[•\-\*]\s*/, '').trim();
      
      if (cleanPoint.length > 0) {
        // Check if this point or the next point contains "in:" pattern
        const currentMatch = cleanPoint;
        const nextMatch = i + 1 < bulletMatches.length ? bulletMatches[i + 1].replace(/^[•\-\*]\s*/, '').trim() : '';
        
        // Case 1: Current point contains "in:" - likely a heading followed by description
        if (currentMatch.toLowerCase().includes('in:')) {
          // Split at "in:" and format properly
          const parts = currentMatch.split(/\s*in:\s*/i);
          if (parts.length >= 2) {
            const heading = parts[0].trim();
            const description = parts.slice(1).join(' in: ').trim();
            const formattedPoint = `${heading}-in: ${description}`;
            points.push(formattedPoint);
            console.log(`[InsightsParser] Combined heading+description point: ${formattedPoint.substring(0, 100)}...`);
            continue;
          }
        }
        
        // Case 2: Next point starts with "in:" - combine current heading with next description
        if (nextMatch.toLowerCase().startsWith('in:')) {
          const heading = currentMatch.trim();
          const description = nextMatch.replace(/^in:\s*/i, '').trim();
          const formattedPoint = `${heading}-in: ${description}`;
          points.push(formattedPoint);
          console.log(`[InsightsParser] Combined separate heading+description: ${formattedPoint.substring(0, 100)}...`);
          // Skip the next item since we've combined it
          i++;
          continue;
        }
        
        // Case 3: Regular bullet point - clean up and add
        const formattedPoint = currentMatch
          .replace(/\s+/g, ' ') // Normalize whitespace
          .replace(/\n+/g, ' ') // Convert line breaks to spaces for bullet points
          .trim();
        
        points.push(formattedPoint);
        console.log(`[InsightsParser] Regular bullet point: ${formattedPoint.substring(0, 100)}...`);
      }
    }
  }
  
  return points;
};

// Legacy function - keeping for backward compatibility but updated to use enhanced version
const extractBulletPoints = (text: string): string[] => {
  return extractEnhancedBulletPoints(text);
};

// Enhanced dispatcher function that tries numbered points first, then bullet points, then fallback
const extractPointsFromBlock = (text: string): string[] => {
  if (!text || text.trim() === '') return [];
  
  console.log(`[InsightsParser] Using dispatcher to extract points from block`);
  
  // Try numbered points first (for key insights)
  const numberedPoints = extractNumberedPoints(text);
  if (numberedPoints.length > 0) {
    console.log(`[InsightsParser] Dispatcher found ${numberedPoints.length} numbered points`);
    return numberedPoints;
  }
  
  // Try enhanced bullet points (for practice points)
  const bulletPoints = extractEnhancedBulletPoints(text);
  if (bulletPoints.length > 0) {
    console.log(`[InsightsParser] Dispatcher found ${bulletPoints.length} enhanced bullet points`);
    return bulletPoints;
  }
  
  // Fallback to sentence/line extraction
  const cleanText = text.trim();
  const points: string[] = [];
  
  // Try extracting sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length > 0) {
    console.log(`[InsightsParser] Dispatcher found ${sentences.length} sentences as fallback`);
    points.push(...sentences.map(s => s.trim()).filter(s => s.length > 0));
  }
  
  // If still no points, split by newlines
  if (points.length === 0) {
    const lines = cleanText.split('\n').filter(line => line.trim().length > 10);
    if (lines.length > 0) {
      console.log(`[InsightsParser] Dispatcher found ${lines.length} lines as final fallback`);
      points.push(...lines.map(line => line.trim()).filter(line => line.length > 0));
    }
  }
  
  // Clean up points: remove headers but preserve ALL meaningful content
  const cleanedPoints = points
    .map(point => point.trim())
    .filter(point => {
      if (point.length === 0) return false;
      if (/^(?:Key Insights?|Practice|Implementation|Action|Ready to put)[^:]*:?\s*$/i.test(point)) return false;
      return true;
    })
    .map(point => {
      return point
        .replace(/^[•\-\*\d+\.\s]+/, '') // Remove leading bullets/numbers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    })
    .filter(point => point.length > 0);
  
  console.log(`[InsightsParser] Dispatcher extracted ${cleanedPoints.length} clean points`);
  return cleanedPoints;
};

// Generate category-specific fallback insights
const generateFallbackInsights = (bookTitle: string, category: string): BookInsights => {
  const categoryInsights = getCategorySpecificInsights(category);
  
  return {
    keyPoints: categoryInsights.keyPoints,
    practicePoints: categoryInsights.practicePoints,
    hasRealContent: false,
    contentSource: 'fallback'
  };
};

// Category-specific insights for different book types
const getCategorySpecificInsights = (category: string) => {
  const insightsMap: { [key: string]: { keyPoints: string[], practicePoints: string[] } } = {
    'Personal Growth': {
      keyPoints: [
        'Self-awareness is the foundation of all personal development and meaningful change',
        'Growth happens outside your comfort zone through consistent challenge and practice',
        'Your mindset determines your ability to overcome obstacles and achieve goals',
        'Small daily improvements compound into significant long-term results over time',
        'Feedback loops accelerate learning and skill development in any area',
        'Identity change precedes lasting behavioral transformation and habit formation',
        'Environment design shapes behavior more effectively than willpower alone',
        'Regular reflection enhances learning retention and practical application',
        'Social connections amplify individual growth efforts and provide accountability',
        'Progress tracking provides motivation and enables course correction when needed'
      ],
      practicePoints: [
        'Start each day with 10 minutes of reflection on personal goals and priorities',
        'Challenge yourself with one uncomfortable but growth-oriented task daily',
        'Keep a detailed growth journal to track insights, progress, and setbacks',
        'Seek feedback regularly from trusted mentors, peers, or coaches',
        'Design your physical and digital environment to support desired behaviors and outcomes'
      ]
    },
    'Productivity': {
      keyPoints: [
        'Focus on high-impact activities that directly move you toward your most important goals',
        'Time blocking creates structure and reduces decision fatigue throughout the day',
        'Single-tasking consistently outperforms multitasking in both quality and efficiency',
        'Energy management is more important than time management for peak performance',
        'Systems and automated processes eliminate the need for constant micro-decisions',
        'Regular breaks and recovery time enhance overall performance and prevent burnout',
        'Clear priorities prevent busy work from crowding out truly important tasks',
        'Strategic automation and delegation free up time for high-level thinking',
        'Weekly review sessions ensure you stay aligned with long-term objectives',
        'Learning to say no to good opportunities preserves time for truly great ones'
      ],
      practicePoints: [
        'Use time blocking to schedule your most important and challenging work first',
        'Identify your peak energy hours and fiercely protect them for deep work',
        'Implement the two-minute rule: do it now if it takes less than two minutes',
        'Conduct thorough weekly reviews to assess progress and adjust priorities',
        'Create detailed templates and checklists for all recurring tasks and processes'
      ]
    },
    'Leadership': {
      keyPoints: [
        'Effective leadership begins with leading yourself with discipline and integrity',
        'Trust is the foundational currency of all effective leadership relationships',
        'Clear, consistent communication prevents most organizational problems before they start',
        'Empowering others through delegation and development multiplies your leadership impact',
        'Emotional intelligence drives better decision-making and stronger team relationships',
        'Consistency between stated values and daily actions builds unshakeable credibility',
        'Active listening creates deeper understanding and stronger team connection',
        'Feedback should be specific, timely, and focused on growth rather than criticism',
        'Leading by example is more powerful than leading through directives alone',
        'Adaptability and resilience in challenges model the way forward for others'
      ],
      practicePoints: [
        'Schedule regular one-on-one meetings with each team member to build relationships',
        'Practice active listening by asking clarifying questions and summarizing what you hear',
        'Give specific, actionable feedback within 24 hours of relevant observations',
        'Share your decision-making process transparently to build trust and understanding',
        'Invest dedicated time in developing others through mentoring, coaching, and stretch assignments'
      ]
    },
    'Health & Fitness': {
      keyPoints: [
        'Consistency in small daily habits creates more sustainable health improvements than dramatic changes',
        'Proper nutrition provides the essential foundation for both physical and mental performance',
        'Regular exercise enhances physical strength, mental clarity, and emotional resilience',
        'Quality sleep directly impacts recovery, mood, cognitive function, and immune system',
        'Effective stress management techniques prevent burnout and long-term health deterioration',
        'Progressive overload principles apply to building any type of physical capacity or strength',
        'Adequate recovery and rest periods are essential components of any effective fitness program',
        'Proper hydration significantly affects energy levels, focus, and physical performance throughout the day',
        'Regular movement throughout the day effectively counters negative sedentary lifestyle effects',
        'Developing mind-body connection improves both exercise effectiveness and overall enjoyment'
      ],
      practicePoints: [
        'Start with just 10 minutes of daily movement, focusing on consistency over intensity',
        'Prepare healthy meals and snacks in advance to avoid poor food choices when busy',
        'Establish a consistent sleep schedule with 7-8 hours of quality sleep nightly',
        'Practice deep breathing or meditation for 5-10 minutes daily to manage stress',
        'Track your daily energy levels to identify patterns and optimize your routines accordingly'
      ]
    },
    'Mindfulness & Meditation': {
      keyPoints: [
        'Present moment awareness significantly reduces anxiety and increases overall life satisfaction',
        'Regular meditation practice literally rewires the brain for greater emotional regulation and resilience',
        'Mindfulness creates crucial space between external stimulus and your response choices',
        'Acceptance of current reality reduces unnecessary suffering caused by mental resistance',
        'Developing compassion for yourself and others enhances mental well-being and relationships',
        'Non-judgmental observation of thoughts and emotions develops emotional intelligence over time',
        'Conscious breathing awareness serves as a reliable anchor for attention in the present moment',
        'Consistent practice builds mental resilience and significantly improves stress tolerance',
        'Mindfulness enhances focus, creativity, and decision-making abilities in all areas of life',
        'Integration of mindfulness principles into daily activities maximizes the benefits of formal practice'
      ],
      practicePoints: [
        'Begin with just 5 minutes of daily meditation, gradually increasing duration as comfort grows',
        'Practice mindful breathing during natural transitions between different activities throughout the day',
        'Use body scan meditation techniques to develop awareness of physical sensations and tension',
        'Apply mindfulness principles to routine activities like eating, walking, or washing dishes',
        'Set random mindfulness reminder alerts throughout your day to return attention to the present moment'
      ]
    },
    'Philosophy': {
      keyPoints: [
        'Focus only on what you can control, release what you cannot',
        'External events are neutral; your judgment creates suffering or peace',
        'Practice voluntary discomfort to build resilience and gratitude',
        'View obstacles as training opportunities for virtue development',
        'Memento mori: Remember mortality to prioritize what truly matters',
        'Present moment awareness is the foundation of all wisdom',
        'Virtue is the only true good; everything else is indifferent',
        'Accept what happens, but work to influence outcomes ethically',
        'Your thoughts and reactions are the only things truly yours',
        'Practice evening reflection to review daily progress and setbacks'
      ],
      practicePoints: [
        'Start each day asking: "What is within my control today?"',
        'Practice the dichotomy of control in daily frustrations',
        'Write evening reflections on virtue and character growth',
        'Practice negative visualization for 5 minutes daily',
        'Choose discomfort intentionally to build mental strength'
      ]
    }
  };

  return insightsMap[category] || insightsMap['Personal Growth'];
};

// Validate insights without imposing arbitrary limits but ensure quality
export const validateInsights = (insights: BookInsights): BookInsights => {
  return {
    ...insights,
    keyPoints: insights.keyPoints
      .filter(point => point && point.trim().length > 10) // Minimum meaningful length
      .map(point => point.trim())
      .slice(0, 15), // Reasonable upper limit to prevent UI overflow
    practicePoints: insights.practicePoints
      .filter(point => point && point.trim().length > 10) // Minimum meaningful length
      .map(point => point.trim())
      .slice(0, 10) // Reasonable upper limit for practice points
  };
};