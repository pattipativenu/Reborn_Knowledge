import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Volume2, 
  Clock, 
  Play, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Trash2,
  CheckCircle,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/ui/back-button';
import { AvatarSelector } from '@/components/ui/avatar-selector';
import { GenreSelector } from '@/components/ui/genre-selector';
import { ListeningAnalyticsModal } from '@/components/ui/listening-analytics-modal';
import { FavoriteBooksModal } from '@/components/ui/favorite-books-modal';
import { CompletedBooksModal } from '@/components/ui/completed-books-modal';
import { CustomSubscription } from '@/components/ui/custom-subscription';
import { FlowButton } from '@/components/ui/flow-button';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '../components/Navbar';

type TabType = 'profile' | 'subscription' | 'payment' | 'preferences' | 'security';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  totalListening: string;
  booksCompleted: number;
  favoriteGenres: string[];
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

// Default user profile data
const defaultUserProfile: UserProfile = {
  fullName: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  memberSince: 'January 2023',
  totalListening: '127 hours',
  booksCompleted: 81, // Updated from 110 to 81
  favoriteGenres: ['Personal Growth', 'Leadership', 'Productivity']
};

// Function to load user profile from sessionStorage
const loadUserProfile = (): UserProfile => {
  try {
    const savedProfile = sessionStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Merge with default to ensure all fields exist
      return { ...defaultUserProfile, ...parsed };
    }
  } catch (error) {
    console.error('Error loading user profile from sessionStorage:', error);
  }
  return defaultUserProfile;
};

// Function to save user profile to sessionStorage
const saveUserProfile = (profile: UserProfile): void => {
  try {
    sessionStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile to sessionStorage:', error);
  }
};

// Function to load preferences from sessionStorage
const loadPreferences = () => {
  try {
    const savedPreferences = sessionStorage.getItem('userPreferences');
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
  } catch (error) {
    console.error('Error loading preferences from sessionStorage:', error);
  }
  
  // Default preferences
  return {
    notifications: {
      newReleases: true,
      recommendations: true,
      promotions: false,
      reminders: true
    },
    playback: {
      autoPlayNext: true,
      sleepTimer: '30 minutes',
      playbackSpeed: '1.0x'
    }
  };
};

// Function to save preferences to sessionStorage
const savePreferences = (preferences: any): void => {
  try {
    sessionStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences to sessionStorage:', error);
  }
};

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { goBackWithScrollMemory } = useScrollMemory();
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showGenreSelector, setShowGenreSelector] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showFavoriteBooksModal, setShowFavoriteBooksModal] = useState(false);
  const [showCompletedBooksModal, setShowCompletedBooksModal] = useState(false);
  const [analyticsUserType, setAnalyticsUserType] = useState<'adult' | 'kid'>('adult');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'success'
  });

  // Ensure page starts at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // User profile state with persistence - load from sessionStorage on mount
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);

  // Save user profile to sessionStorage whenever it changes
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2027',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8888',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false
    }
  ]);

  // Preferences state with persistence
  const [preferences, setPreferences] = useState(loadPreferences);

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  // Security state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Show notification function
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Subscription plans data
  const subscriptionPlans = [
    {
      name: t('subscription.free'),
      price: '0',
      yearlyPrice: '0',
      period: t('subscription.forever'),
      features: [
        `3 ${t('features.booksPerMonth')}`,
        t('features.basicAudio'),
        t('features.limitedDownloads'),
        t('features.communitySupport')
      ],
      description: t('subscription.freeDescription'),
      buttonText: t('subscription.downgrade'),
      href: '#',
      isPopular: false
    },
    {
      name: t('subscription.premium'),
      price: '9',
      yearlyPrice: '7',
      period: t('subscription.month'),
      features: [
        t('features.unlimitedBooks'),
        t('features.highQualityAudio'),
        t('features.unlimitedDownloads'),
        t('features.earlyAccess'),
        t('features.prioritySupport'),
        t('features.advancedAnalytics')
      ],
      description: t('subscription.premiumDescription'),
      buttonText: t('subscription.downgrade'),
      href: '#',
      isPopular: true
    },
    {
      name: t('subscription.family'),
      price: '15',
      yearlyPrice: '12',
      period: t('subscription.month'),
      features: [
        t('features.unlimitedBooks'),
        t('features.familyMembers'),
        t('features.kidsContent'),
        t('features.individualProfiles'),
        t('features.parentalControls'),
        t('features.familySharing')
      ],
      description: t('subscription.familyDescription'),
      buttonText: t('subscription.currentPlan'),
      href: '#',
      isPopular: false
    }
  ];

  const tabs = [
    { id: 'profile', label: t('account.profile'), icon: User },
    { id: 'subscription', label: t('account.subscription'), icon: CreditCard },
    { id: 'payment', label: t('account.payment'), icon: CreditCard },
    { id: 'preferences', label: t('account.preferences'), icon: Settings },
    { id: 'security', label: t('account.security'), icon: Shield }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    showNotification('Profile updated successfully!');
  };

  const handleAvatarSelect = (avatar: string) => {
    setUserProfile(prev => ({ ...prev, avatar }));
    showNotification('Avatar updated successfully!');
  };

  const handleGenreSelect = (genres: string[]) => {
    setUserProfile(prev => ({ ...prev, favoriteGenres: genres }));
    showNotification('Favorite genres updated successfully!');
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    showNotification('Default payment method updated successfully!');
  };

  const handleUpdatePassword = () => {
    if (!passwords.current.trim()) {
      showNotification('Please enter your current password', 'error');
      return;
    }
    if (!passwords.new.trim()) {
      showNotification('Please enter a new password', 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    if (passwords.new.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }
    
    // Reset password fields
    setPasswords({ current: '', new: '', confirm: '' });
    showNotification('Password updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showNotification('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  const handleAnalyticsClick = (userType: 'adult' | 'kid' = 'adult') => {
    setAnalyticsUserType(userType);
    setShowAnalyticsModal(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header with enhanced shadow */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={() => setShowAvatarSelector(true)}
                    className="absolute -bottom-2 -right-2 bg-[#fece0a] text-black p-2 rounded-full hover:bg-[#e6b809] transition-colors shadow-lg"
                  >
                    <User size={16} />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black">{userProfile.fullName}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <p className="text-sm text-gray-500">{t('profile.memberSince')} {userProfile.memberSince}</p>
                </div>
                <div className="flex justify-center">
                  <FlowButton
                    text={isEditing ? t('profile.cancel') : t('profile.edit')}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-auto min-w-32"
                    forceBlackText={true}
                  />
                </div>
              </div>

              {/* Stats - removed Speed display and centered buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#fece0a]">{userProfile.totalListening}</div>
                  <div className="text-sm text-gray-600">{t('profile.totalListening')}</div>
                  <div className="flex justify-center mt-2">
                    <FlowButton 
                      text={t('profile.clickForDetails')}
                      onClick={() => handleAnalyticsClick('adult')}
                      className="text-xs px-3 py-1 min-w-20"
                      forceBlackText={true}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#fece0a]">{userProfile.booksCompleted}</div>
                  <div className="text-sm text-gray-600">{t('profile.booksCompleted')}</div>
                  <div className="flex justify-center mt-2">
                    <FlowButton 
                      text={t('profile.viewCompleted')}
                      onClick={() => setShowCompletedBooksModal(true)}
                      className="text-xs px-3 py-1 min-w-20"
                      forceBlackText={true}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#fece0a]">67</div>
                  <div className="text-sm text-gray-600">{t('profile.favoriteBooks')}</div>
                  <div className="flex justify-center mt-2">
                    <FlowButton 
                      text={t('profile.viewFavorites')}
                      onClick={() => setShowFavoriteBooksModal(true)}
                      className="text-xs px-3 py-1 min-w-20"
                      forceBlackText={true}
                    />
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-6"
                >
                  <h3 className="text-lg font-semibold mb-4 text-black">{t('profile.editProfile')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('profile.fullName')}
                      </label>
                      <input
                        type="text"
                        value={userProfile.fullName}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('profile.email')}
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('profile.phone')}
                      </label>
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {t('profile.favoriteGenres')}
                      </label>
                      <button
                        onClick={() => setShowGenreSelector(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      >
                        {userProfile.favoriteGenres.length > 0 
                          ? `${userProfile.favoriteGenres.length} genres selected`
                          : t('profile.addGenre')
                        }
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 justify-center">
                    <FlowButton
                      text={t('profile.save')}
                      onClick={handleSaveProfile}
                      className="w-auto min-w-32"
                      forceBlackText={true}
                    />
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    >
                      {t('profile.cancel')}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <CustomSubscription
                plans={subscriptionPlans}
                title={t('subscription.choosePlan')}
                description={t('subscription.description')}
                forceBlackText={true}
              />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">{t('payment.methods')}</h3>
                <FlowButton
                  text={t('payment.addMethod')}
                  onClick={() => showNotification('Add payment method feature coming soon!')}
                  className="w-auto min-w-32"
                  forceBlackText={true}
                />
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {method.type.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• {method.last4}</div>
                        <div className="text-sm text-gray-500">
                          {t('payment.expires')} {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {t('payment.default')}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(method.id)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          {t('payment.setDefault')}
                        </button>
                      )}
                      <button 
                        onClick={() => showNotification('Payment method removed successfully!')}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            {/* Notifications with enhanced shadow */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
                <Bell size={20} />
                {t('preferences.notifications')}
              </h3>
              <div className="space-y-4">
                {Object.entries(preferences.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">{t(`preferences.${key}`)}</div>
                      <div className="text-sm text-gray-500">{t(`preferences.${key}Description`)}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, [key]: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fece0a]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fece0a]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Language with enhanced shadow */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
                <Globe size={20} />
                {t('preferences.language')}
              </h3>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('preferences.preferredLanguage')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] bg-white text-black"
                >
                  <option value="en" className="text-black bg-white">{t('language.english')}</option>
                  <option value="es" className="text-black bg-white">{t('language.spanish')}</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">{t('preferences.languageDescription')}</p>
              </div>
            </div>

            {/* Playback Settings with enhanced shadow */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
                <Volume2 size={20} />
                {t('preferences.playbackSettings')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">{t('preferences.autoPlayNext')}</div>
                    <div className="text-sm text-gray-500">{t('preferences.autoPlayDescription')}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.playback.autoPlayNext}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        playback: { ...prev.playback, autoPlayNext: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fece0a]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fece0a]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('preferences.sleepTimer')}
                  </label>
                  <select
                    value={preferences.playback.sleepTimer}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        playback: { ...prev.playback, sleepTimer: e.target.value }
                      }));
                      showNotification('Sleep timer setting saved!');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] bg-white text-black"
                  >
                    <option value="15 minutes" className="text-black bg-white">15 minutes</option>
                    <option value="30 minutes" className="text-black bg-white">30 minutes</option>
                    <option value="45 minutes" className="text-black bg-white">45 minutes</option>
                    <option value="60 minutes" className="text-black bg-white">60 minutes</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">{t('preferences.sleepTimerDescription')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('preferences.playbackSpeed')}
                  </label>
                  <select
                    value={preferences.playback.playbackSpeed}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        playback: { ...prev.playback, playbackSpeed: e.target.value }
                      }));
                      showNotification('Playback speed setting saved!');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] bg-white text-black"
                  >
                    <option value="0.5x" className="text-black bg-white">0.5x</option>
                    <option value="0.75x" className="text-black bg-white">0.75x</option>
                    <option value="1.0x" className="text-black bg-white">1.0x</option>
                    <option value="1.25x" className="text-black bg-white">1.25x</option>
                    <option value="1.5x" className="text-black bg-white">1.5x</option>
                    <option value="2.0x" className="text-black bg-white">2.0x</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">{t('preferences.playbackSpeedDescription')}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Password Update with enhanced shadow */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-black">{t('security.settings')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('security.currentPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('security.newPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('security.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fece0a] text-black bg-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <FlowButton
                    text={t('security.updatePassword')}
                    onClick={handleUpdatePassword}
                    className="w-auto min-w-32"
                    forceBlackText={true}
                  />
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication with enhanced shadow */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-black">{t('security.twoFactor')}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black">{t('security.enable2FA')}</div>
                  <div className="text-sm text-gray-500">{t('security.enable2FADescription')}</div>
                </div>
                <FlowButton
                  text={twoFactorEnabled ? 'Enabled' : t('security.enable')}
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showNotification(
                      twoFactorEnabled 
                        ? '2FA disabled successfully!' 
                        : '2FA enabled successfully!'
                    );
                  }}
                  className={`w-auto min-w-24 ${
                    twoFactorEnabled
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : ''
                  }`}
                  circleColor={twoFactorEnabled ? '#10b981' : '#fece0a'}
                  forceBlackText={true}
                />
              </div>
            </div>

            {/* Danger Zone with Shaking Effect and enhanced shadow */}
            <motion.div 
              className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-lg"
              onHoverStart={() => {}}
              onMouseEnter={() => {}}
              whileHover={{
                x: [0, -2, 2, -2, 2, 0],
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }}
              onClick={handleDeleteAccount}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-black flex items-center gap-2">
                <AlertTriangle size={20} />
                {t('security.dangerZone')}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black">{t('security.deleteAccount')}</div>
                  <div className="text-sm text-red-600">{t('security.deleteAccountDescription')}</div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  {t('common.delete')}
                </button>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(238,237,232)' }}>
      {/* Fixed Navbar */}
      <Navbar isInteractive={true} backgroundColor="rgb(238,237,232)" />
      
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <X size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="pt-20 sm:pt-24">
        {/* Header */}
        <div style={{ backgroundColor: 'rgb(238,237,232)' }} className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <BackButton 
                onClick={goBackWithScrollMemory}
                variant="account"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-black">
                {t('account.title')}
              </h1>
              <p className="text-gray-600 mt-2">{t('account.subtitle')}</p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with enhanced shadow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#fece0a] text-black font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={userProfile.avatar}
      />

      <GenreSelector
        isOpen={showGenreSelector}
        onClose={() => setShowGenreSelector(false)}
        onSelect={handleGenreSelect}
        currentGenres={userProfile.favoriteGenres}
      />

      <ListeningAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        userType={analyticsUserType}
      />

      <FavoriteBooksModal
        isOpen={showFavoriteBooksModal}
        onClose={() => setShowFavoriteBooksModal(false)}
      />

      <CompletedBooksModal
        isOpen={showCompletedBooksModal}
        onClose={() => setShowCompletedBooksModal(false)}
      />
    </div>
  );
};

export default AccountPage;