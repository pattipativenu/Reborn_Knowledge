import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Clock, BookOpen, Target, Calendar, BarChart3, Users, Baby, Bell } from 'lucide-react';
import { FlowButton } from '@/components/ui/flow-button';

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

const ComingSoonCard: React.FC = () => {
  const handleRemindMe = () => {
    // Show a notification or handle the reminder functionality
    alert('Thanks! We\'ll remind you when Kids Analytics are ready! 🎉');
  };

  return (
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
      <p className="text-purple-600 text-lg mb-6">
        Kids analytics are being developed with extra care to provide safe and meaningful insights for young learners.
      </p>
      <div className="mt-6 mb-6 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
        <Baby size={16} />
        <span className="font-medium">Kid-Friendly Analytics</span>
      </div>
      
      {/* Remind Me Button */}
      <div className="mt-8">
        <button
          onClick={handleRemindMe}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Bell size={20} />
          <span>Remind Me</span>
        </button>
      </div>
    </motion.div>
  );
};

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