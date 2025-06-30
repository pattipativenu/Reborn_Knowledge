import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { faqData, FAQItem } from '@/data/faqData';
import { NewsletterModal } from './NewsletterModal';

const FAQSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleNewsletterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNewsletterModal(true);
  };

  // Process FAQ answers to make "here" clickable in the 3rd question (index 2)
  const processAnswer = (answer: string, index: number) => {
    if (index === 2) { // Third question (0-indexed)
      return answer.replace(
        'click here to get the latest updates',
        'click <span class="newsletter-link" style="color: #3b82f6; text-decoration: underline; cursor: pointer; font-weight: 500;">here</span> to get the latest updates'
      );
    }
    return answer;
  };

  return (
    <>
      <section className="bg-brand-dark-bg pt-16 sm:pt-24 pb-8 sm:pb-6 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid background positioned above the heading */}
          <div className='absolute top-[-10vh] left-0 right-0 h-[40vh] sm:h-[50vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
          
          {/* Reduced heading size for single line display */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-outfit font-bold text-brand-dark-text text-center mb-12 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {t('faq.title')}
          </motion.h2>

          <div className="space-y-4 relative z-10">
            {faqData.map((faq: FAQItem, index: number) => (
              <motion.div
                key={index}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-brand-accent-start shadow-xl' 
                    : 'border-gray-200 shadow-md hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: openIndex === index ? 1 : 1.01 }}
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-manrope font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={24} className="text-brand-accent-start" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="h-px bg-gray-200 mb-4"></div>
                        <div 
                          className="text-gray-700 leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: processAnswer(faq.answer, index) }}
                          onClick={(e) => {
                            if ((e.target as HTMLElement).classList.contains('newsletter-link')) {
                              handleNewsletterClick(e);
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Modal */}
      <NewsletterModal 
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </>
  );
};

export default FAQSection;