import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Check, AlertCircle } from 'lucide-react';
import { createLibraryUrl } from '@/lib/bookUtils';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  // Navigation items
  const navItems = [
    { label: t('nav.kids'), onClick: () => navigate('/kids') },
    { label: t('nav.myLibrary'), onClick: () => navigate('/my-library') },
    { label: t('nav.account'), onClick: () => navigate('/account') },
    { label: 'Home', onClick: () => navigate('/') }
  ];

  // All categories from your library
  const allCategories = [
    'Startup & Business',
    'Marketing & Sales', 
    'Health & Fitness',
    'Mindfulness & Meditation',
    'Leadership',
    'Personal Growth',
    'Money & Finance',
    'Habits & Psychology',
    'Spirituality & Philosophy',
    'Relationships',
    'Time Management',
    'Career & Skills',
    'Creativity & Writing',
    'Science & Technology',
    'Productivity'
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailStatus('error');
      setEmailMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailStatus('error');
      setEmailMessage('Please enter a valid email address');
      return;
    }

    // Simulate API call
    setEmailStatus('success');
    setEmailMessage('Thank you! You\'ve been added to our waiting list.');
    setEmail('');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setEmailStatus('idle');
      setEmailMessage('');
    }, 3000);
  };

  const handleCategoryClick = (category: string) => {
    navigate(createLibraryUrl(category));
  };

  // Legal document handlers
  const handlePrivacyPolicy = () => {
    // Create a simple modal or navigate to a dedicated page
    alert(`Privacy Policy

REBORN Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

1. Information We Collect
We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support.

2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

3. Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. Your Rights
You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.

6. Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@reborn.com.`);
  };

  const handleTermsOfService = () => {
    alert(`Terms of Service

REBORN Terms of Service

Last updated: ${new Date().toLocaleDateString()}

1. Acceptance of Terms
By accessing and using REBORN, you accept and agree to be bound by the terms and provision of this agreement.

2. Service Description
REBORN is a podcast-style audiobook platform that provides interactive learning experiences through audio content.

3. User Accounts
You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.

4. Subscription and Payment
Our service is offered through various subscription plans. Payment is required in advance and subscriptions will automatically renew.

5. Content Usage
You may access and use our content for personal, non-commercial use only. You may not redistribute, modify, or create derivative works.

6. Prohibited Uses
You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.

7. Limitation of Liability
REBORN shall not be liable for any indirect, incidental, special, consequential, or punitive damages.

8. Termination
We may terminate or suspend your account and access to the service immediately, without prior notice.

9. Contact Information
For questions about these Terms, please contact us at legal@reborn.com.`);
  };

  return (
    <footer 
      className="relative w-full z-10 h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-hidden"
      style={{
        backgroundImage: 'url(https://vleyzwirrsmwjotumxnf.supabase.co/storage/v1/object/public/assets/hero/footer.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Enhanced dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Footer Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-outfit font-bold text-brand-dark-text mb-3 sm:mb-4 uppercase tracking-wide">
                {t('nav.reborn')}
              </h3>
              <p className="text-brand-dark-text/90 font-manrope text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                Transform your learning journey with our podcast-style audiobook platform.
              </p>
              
              {/* Contact Info - No phone number as requested */}
              <div className="space-y-2 text-sm text-brand-dark-text/80">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>support@rebornknowledge.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>London, United Kingdom</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h4 className="text-base sm:text-lg font-outfit font-bold text-brand-dark-text mb-3 sm:mb-4">
                Navigation
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={item.onClick}
                      className="text-brand-dark-text/80 hover:text-brand-accent-start font-manrope text-sm sm:text-base transition-colors duration-300 text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* All Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h4 className="text-base sm:text-lg font-outfit font-bold text-brand-dark-text mb-3 sm:mb-4">
                Categories
              </h4>
              <div className="max-h-48 sm:max-h-64 overflow-y-auto pr-2">
                <ul className="space-y-1 sm:space-y-2">
                  {allCategories.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className="text-brand-dark-text/80 hover:text-brand-accent-start font-manrope text-xs sm:text-sm transition-colors duration-300 text-left block"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Social Media & Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <h4 className="text-base sm:text-lg font-outfit font-bold text-brand-dark-text mb-3 sm:mb-4">
                Connect With Us
              </h4>
              
              {/* Social Media Icons */}
              <div className="flex gap-3 mb-4 sm:mb-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="p-2 bg-white/10 hover:bg-brand-accent-start/20 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <Icon size={16} className="text-brand-dark-text hover:text-brand-accent-start transition-colors" />
                    </a>
                  );
                })}
              </div>

              {/* Enhanced Newsletter Signup with Validation */}
              <div>
                <p className="text-brand-dark-text/90 font-manrope text-sm mb-3">
                  Join our waiting list and get updates
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-brand-dark-text placeholder-brand-dark-text/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent-start focus:border-transparent"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-brand-accent-start hover:bg-brand-accent-end text-black font-manrope font-medium text-sm rounded-lg transition-colors duration-300 flex items-center gap-1"
                    >
                      {emailStatus === 'success' ? <Check size={14} /> : null}
                      Subscribe
                    </button>
                  </div>
                  
                  {/* Email Status Message */}
                  {emailMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 text-xs ${
                        emailStatus === 'success' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}
                    >
                      {emailStatus === 'success' ? (
                        <Check size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {emailMessage}
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/20 bg-black/40 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-brand-dark-text/80 font-manrope text-xs sm:text-sm text-center sm:text-left">
                © 2025 REBORN. All rights reserved.
              </p>
              <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
                <button 
                  onClick={handlePrivacyPolicy}
                  className="text-brand-dark-text/80 hover:text-brand-accent-start font-manrope transition-colors duration-300"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={handleTermsOfService}
                  className="text-brand-dark-text/80 hover:text-brand-accent-start font-manrope transition-colors duration-300"
                >
                  Terms of Service
                </button>
                <button className="text-brand-dark-text/80 hover:text-brand-accent-start font-manrope transition-colors duration-300">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;