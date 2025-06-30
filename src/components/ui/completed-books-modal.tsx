import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Clock, BookOpen, Target, Calendar, BarChart3, Users, Baby } from 'lucide-react';

interface ListeningAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'adult' | 'kid';
}

interface ChartData {
  label: string;
  value: number;
  date?: string;
}

// Fixed data generators with approximate times
const generateDailyData = (): ChartData[] => {
  return [
    { label: 'Mon', value: 1.33, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 1:20
    { label: 'Tue', value: 1.38, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 1:23
    { label: 'Wed', value: 1.55, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 1:33
    { label: 'Thu', value: 1.72, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 1:43
    { label: 'Fri', value: 1.28, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 1:17
    { label: 'Sat', value: 2.15, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 2:09
    { label: 'Sun', value: 1.92, date: new Date().toLocaleDateString() } // 1:55
  ];
};

const generateWeeklyData = (): ChartData[] => {
  return [
    { label: '4 weeks ago', value: 8.75, date: new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 8:45
    { label: '3 weeks ago', value: 9.33, date: new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 9:20
    { label: '2 weeks ago', value: 10.58, date: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 10:35
    { label: 'Last week', value: 11.25, date: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 11:15
    { label: 'This week', value: 12.17, date: new Date().toLocaleDateString() } // 12:10
  ];
};

const generateMonthlyData = (): ChartData[] => {
  return [
    { label: '6 months ago', value: 28.5, date: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 28:30
    { label: '5 months ago', value: 30.75, date: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 30:45
    { label: '4 months ago', value: 32.33, date: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 32:20
    { label: '3 months ago', value: 35.17, date: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 35:10
    { label: '2 months ago', value: 37.42, date: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() }, // 37:25
    { label: 'Last month', value: 39.83, date: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() } // 39:50
  ];
};

const BarChart: React.FC<{ data: ChartData[]; title: string; color: string }> = ({ data, title, color }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 size={20} className="text-[#fece0a]" />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-20 text-sm text-gray-600 font-medium">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full flex items-center justify-end pr-2"
                style={{ backgroundColor: color }}
              >
                <span className="text-white text-xs font-medium">
                  {item.value.toFixed(1)}h
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ icon: React.ReactNode; title: string; value: string; subtitle: string; color: string }> = ({
  icon, title, value, subtitle, color
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{subtitle}</div>
  </motion.div>
);

const ComingSoonCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-12 text-center border border-purple-200"
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      className="text-6xl mb-4"
    >
      🚀
    </motion.div>
    <h3 className="text-2xl font-bold text-purple-800 mb-2">Coming Soon!</h3>
    <p className="text-purple-600 text-lg">
      Kids analytics are being developed with extra care to provide safe and meaningful insights for young learners.
    </p>
    <div className="mt-6 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
      <Baby size={16} />
      <span className="font-medium">Kid-Friendly Analytics</span>
    </div>
  </motion.div>
);

export const ListeningAnalyticsModal: React.FC<ListeningAnalyticsModalProps> = ({
  isOpen,
  onClose,
  userType
}) => {
  const [activeTab, setActiveTab] = useState<'days' | 'weeks' | 'months'>('days');
  const [dailyData] = useState<ChartData[]>(generateDailyData());
  const [weeklyData] = useState<ChartData[]>(generateWeeklyData());
  const [monthlyData] = useState<ChartData[]>(generateMonthlyData());

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const tabs = [
    { key: 'days', label: 'Last 7 Days', icon: Calendar },
    { key: 'weeks', label: 'Last 5 Weeks', icon: TrendingUp },
    { key: 'months', label: 'Last 6 Months', icon: BarChart3 }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'days': return dailyData;
      case 'weeks': return weeklyData;
      case 'months': return monthlyData;
      default: return dailyData;
    }
  };

  const getChartTitle = () => {
    switch (activeTab) {
      case 'days': return 'Daily Listening Hours';
      case 'weeks': return 'Weekly Listening Hours';
      case 'months': return 'Monthly Listening Hours';
      default: return 'Listening Hours';
    }
  };

  // Fixed average hours based on actual data
  const getAverageHours = () => {
    const data = getCurrentData();
    const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    return average.toFixed(1);
  };

  const getTotalHours = () => {
    const data = getCurrentData();
    return data.reduce((sum, item) => sum + item.value, 0).toFixed(1);
  };

  // Fixed improvement percentages
  const getImprovementPercentage = () => {
    switch (activeTab) {
      case 'days': return '12.5'; // 12.5% improvement
      case 'weeks': return '18.2'; // 18.2% improvement
      case 'months': return '25.8'; // 25.8% improvement
      default: return '15.0';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-50 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fece0a]/20 rounded-lg">
                  {userType === 'adult' ? (
                    <Users size={24} className="text-[#fece0a]" />
                  ) : (
                    <Baby size={24} className="text-purple-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userType === 'adult' ? 'Adult Listening Analytics' : 'Kids Listening Analytics'}
                  </h2>
                  <p className="text-gray-600">
                    {userType === 'adult' 
                      ? 'Detailed insights into your learning journey' 
                      : 'Safe analytics for young learners'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Close"
              >
                <X 
                  size={28} 
                  className="text-gray-600 group-hover:text-gray-800 transition-colors" 
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-6 pb-8">
              {userType === 'kid' ? (
                <ComingSoonCard />
              ) : (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      icon={<Clock size={20} className="text-[#fece0a]" />}
                      title="Average Hours"
                      value={`${getAverageHours()}h`}
                      subtitle={`Per ${activeTab.slice(0, -1)}`}
                      color="#fece0a"
                    />
                    <StatsCard
                      icon={<BookOpen size={20} className="text-blue-600" />}
                      title="Total Hours"
                      value={`${getTotalHours()}h`}
                      subtitle={`In selected period`}
                      color="#3b82f6"
                    />
                    <StatsCard
                      icon={<TrendingUp size={20} className="text-green-600" />}
                      title="Improvement"
                      value={`${getImprovementPercentage()}%`}
                      subtitle="Recent vs earlier period"
                      color="#16a34a"
                    />
                  </div>

                  {/* Time Period Tabs */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                              activeTab === tab.key
                                ? 'bg-[#fece0a] text-black shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <Icon size={16} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Chart */}
                    <BarChart
                      data={getCurrentData()}
                      title={getChartTitle()}
                      color="#fece0a"
                    />
                  </div>
                </>
              )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CompletedBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  category: string;
  completedDate: string;
  rating: number;
  duration: string;
}

interface ContributionData {
  date: string;
  count: number;
  category: string;
}

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2"
        >
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Category colors matching the category pages
const categoryColors: { [key: string]: string } = {
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

const categories = Object.keys(categoryColors);

// Generate random book data
const generateRandomBooks = (year: number): Book[] => {
  const titles = [
    'Atomic Habits', 'Think and Grow Rich', 'The 7 Habits', 'Sapiens', 'Educated',
    'The Psychology of Money', 'Mindset', 'The Lean Startup', 'Deep Work', 'Grit',
    'The Power of Now', 'Rich Dad Poor Dad', 'The Alchemist', 'Man\'s Search for Meaning',
    'The 4-Hour Workweek', 'Good to Great', 'The Subtle Art', 'Outliers', 'Daring Greatly',
    'The Compound Effect', 'The One Thing', 'Essentialism', 'The Miracle Morning'
  ];

  const authors = [
    'James Clear', 'Napoleon Hill', 'Stephen Covey', 'Yuval Harari', 'Tara Westover',
    'Morgan Housel', 'Carol Dweck', 'Eric Ries', 'Cal Newport', 'Angela Duckworth',
    'Eckhart Tolle', 'Robert Kiyosaki', 'Paulo Coelho', 'Viktor Frankl', 'Tim Ferriss'
  ];

  // Different book counts for different years
  const bookCounts = {
    2023: 28,
    2024: 45,
    2025: 50
  };

  const count = bookCounts[year as keyof typeof bookCounts] || 30;

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: titles[Math.floor(Math.random() * titles.length)],
    author: authors[Math.floor(Math.random() * authors.length)],
    cover: `https://storage.googleapis.com/reborn_knowledge/book_covers/${(index % 16) + 1}.jpg`,
    category: categories[Math.floor(Math.random() * categories.length)],
    completedDate: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    duration: `${Math.floor(Math.random() * 10) + 3}h ${Math.floor(Math.random() * 60)}m`
  }));
};

// Fixed contribution data with specific counts and category dominance
const generateContributionData = (year: number): ContributionData[] => {
  const data: ContributionData[] = [];
  const startDate = new Date(year, 0, 1);
  
  // For 2025, only generate data through June 30th
  const endDate = year === 2025 
    ? new Date(2025, 5, 30) // June 30, 2025
    : new Date(year, 11, 31);
  
  // Fixed contribution counts for each year
  const yearlyContributions = {
    2025: 81, // Updated from 123 to 81
    2024: 217,
    2023: 193
  };
  
  const totalContributions = yearlyContributions[year as keyof typeof yearlyContributions] || 100;
  
  // Get favorite category for the year and its dominance percentage
  const yearData = getConsistentYearData(year);
  const favoriteCategory = yearData.favoriteCategory;
  const dominancePercentage = year === 2023 ? 0.39 : year === 2024 ? 0.35 : 0.33; // 39% for 2023, 35% for 2024, 33% for 2025
  
  const favoriteCategoryContributions = Math.floor(totalContributions * dominancePercentage);
  const otherContributions = totalContributions - favoriteCategoryContributions;
  
  // Generate all dates in the range
  const allDates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().split('T')[0]);
  }
  
  // Shuffle dates for random distribution
  const shuffledDates = [...allDates].sort(() => Math.random() - 0.5);
  
  // Add favorite category contributions
  for (let i = 0; i < favoriteCategoryContributions; i++) {
    const dateIndex = Math.floor((i / favoriteCategoryContributions) * shuffledDates.length);
    const date = shuffledDates[dateIndex];
    const existingEntry = data.find(d => d.date === date);
    
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      data.push({
        date: date,
        count: 1,
        category: favoriteCategory
      });
    }
  }
  
  // Add other category contributions
  const otherCategories = categories.filter(cat => cat !== favoriteCategory);
  for (let i = 0; i < otherContributions; i++) {
    const dateIndex = Math.floor(Math.random() * shuffledDates.length);
    const date = shuffledDates[dateIndex];
    const category = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    
    const existingEntry = data.find(d => d.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      data.push({
        date: date,
        count: 1,
        category: category
      });
    }
  }
  
  return data;
};

// Consistent data for each year to ensure colors remain the same
const getConsistentYearData = (year: number) => {
  switch (year) {
    case 2025:
      return {
        listeningTime: { time: 'Morning', icon: Clock, color: '#f59e0b' },
        favoriteCategory: 'Personal Growth'
      };
    case 2024:
      return {
        listeningTime: { time: 'Evening', icon: Clock, color: '#ef4444' },
        favoriteCategory: 'Productivity'
      };
    case 2023:
      return {
        listeningTime: { time: 'Night', icon: Clock, color: '#8b5cf6' },
        favoriteCategory: 'Relationships'
      };
    default:
      return {
        listeningTime: { time: 'Morning', icon: Clock, color: '#f59e0b' },
        favoriteCategory: 'Personal Growth'
      };
  }
};

const ContributionGraph: React.FC<{ 
  year: number; 
  data: ContributionData[]; 
  onSquareClick: (category: string | null) => void;
}> = ({ year, data, onSquareClick }) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const weeks: Date[][] = [];
  
  // Generate weeks
  let currentWeek: Date[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push(new Date(d));
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getContributionForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return data.find(d => d.date === dateStr);
  };

  const getIntensityColor = (contribution: ContributionData | undefined, date: Date) => {
    // For 2025, only show colors for dates through June 30th
    if (year === 2025) {
      const june30 = new Date(2025, 5, 30); // June 30, 2025
      if (date > june30) {
        return '#ebedf0'; // Default gray for future dates
      }
    }
    
    if (!contribution) return '#ebedf0';
    
    const baseColor = categoryColors[contribution.category];
    const intensity = Math.min(contribution.count / 4, 1); // Max 4 books per day
    
    // Convert hex to RGB and apply opacity
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = ['Mon', 'Wed', 'Fri'];

  // Fixed contribution counts for display
  const getFixedContributionCount = (year: number) => {
    switch (year) {
      case 2025: return 81; // Updated from 123 to 81
      case 2024: return 217;
      case 2023: return 193;
      default: return data.length;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {getFixedContributionCount(year)} contributions in {year}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels - Precisely positioned to prevent overflow */}
          <div className="flex mb-2 relative">
            <div className="w-8"></div>
            <div className="flex-1 relative">
              {/* Fixed width container for months */}
              <div className="grid grid-cols-12 gap-0 w-full">
                {months.map((month, index) => (
                  <div 
                    key={month} 
                    className="text-xs text-gray-500 text-center truncate px-1"
                    style={{
                      fontSize: '10px',
                      lineHeight: '12px'
                    }}
                  >
                    {month}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Graph */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-between h-24 w-8 pr-2">
              {days.map(day => (
                <div key={day} className="text-xs text-gray-500 h-3 flex items-center">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Contribution squares - Contained within boundaries */}
            <div className="flex gap-1 flex-1 min-w-0">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 flex-shrink-0" style={{ width: '12px' }}>
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const date = week[dayIndex];
                    const contribution = date ? getContributionForDate(date) : undefined;
                    
                    return (
                      <motion.div
                        key={dayIndex}
                        className="rounded-sm cursor-pointer"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: date ? getIntensityColor(contribution, date) : 'transparent'
                        }}
                        whileHover={{ scale: 1.2 }}
                        title={date ? `${date.toDateString()}: ${contribution?.count || 0} books completed` : ''}
                        onClick={() => {
                          if (contribution) {
                            onSquareClick(contribution.category);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Learn how we count contributions
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Less</span>
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: level === 0 ? '#ebedf0' : `rgba(254, 206, 10, ${0.2 + level * 0.2})`
                  }}
                />
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollingBookRow: React.FC<{ books: Book[] }> = ({ books }) => {
  return (
    <div className="flex overflow-hidden py-4">
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{
          x: [0, -2000]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
        style={{ width: "max-content" }}
      >
        {[...books, ...books, ...books].map((book, index) => (
          <motion.div
            key={`${book.id}-${index}`}
            className="flex-shrink-0 w-24 group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/200x300/${book.category === 'Personal Growth' ? '4f5961' : 'fece0a'}/000000?text=${encodeURIComponent(book.title.slice(0, 10))}`;
                }}
              />
              
              {/* Completion badge */}
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 opacity-90">
                <BookOpen size={10} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export const CompletedBooksModal: React.FC<CompletedBooksModalProps> = ({ isOpen, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [books, setBooks] = useState<Book[]>([]);
  const [contributionData, setContributionData] = useState<ContributionData[]>([]);
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  const years = [2025, 2024, 2023];

  useEffect(() => {
    if (isOpen) {
      setBooks(generateRandomBooks(selectedYear));
      setContributionData(generateContributionData(selectedYear));
    }
  }, [isOpen, selectedYear]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSquareClick = (category: string | null) => {
    if (category) {
      setNotification({
        message: category,
        isVisible: true
      });
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Get consistent data for the selected year
  const yearData = getConsistentYearData(selectedYear);
  const listeningPreference = yearData.listeningTime;
  const mostFavoriteCategory = yearData.favoriteCategory;
  const favoriteColor = categoryColors[mostFavoriteCategory] || '#4f5961';
  const ListeningIcon = listeningPreference.icon;

  return (
    <>
      <Notification 
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-50 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Completed Books</h2>
                  <p className="text-gray-600">Your reading journey and achievements</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Year selector */}
                <div className="flex gap-2">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedYear === year
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  title="Close"
                >
                  <X 
                    size={28} 
                    className="text-gray-600 group-hover:text-gray-800 transition-colors" 
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-6">
                {/* Contribution Graph */}
                <ContributionGraph 
                  year={selectedYear} 
                  data={contributionData} 
                  onSquareClick={handleSquareClick}
                />

                {/* Scrolling Books Row */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-green-600" />
                    Books Completed in {selectedYear}
                  </h3>
                  <ScrollingBookRow books={books} />
                </div>

                {/* Stats Boxes - Single row with proper spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  {/* Most Listening Time */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${listeningPreference.color}20` }}>
                        <ListeningIcon size={20} style={{ color: listeningPreference.color }} />
                      </div>
                      <h3 className="font-semibold text-gray-800">Most Listening Time</h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{listeningPreference.time}</div>
                    <div className="text-sm text-gray-600 pb-2">Peak listening hours</div>
                  </div>

                  {/* Favorite Category */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="p-2 rounded-lg" 
                        style={{ backgroundColor: `${favoriteColor}20` }}
                      >
                        <BookOpen 
                          size={20} 
                          style={{ color: favoriteColor }} 
                          fill="currentColor" 
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800">Favorite Category</h3>
                    </div>
                    <div 
                      className="text-2xl font-bold mb-1" 
                      style={{ color: favoriteColor }}
                    >
                      {mostFavoriteCategory}
                    </div>
                    <div className="text-sm text-gray-600 pb-2">Most listened category</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};