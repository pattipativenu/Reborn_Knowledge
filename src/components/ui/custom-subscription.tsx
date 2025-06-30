import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FlowButton } from '@/components/ui/flow-button';

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface CustomSubscriptionProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  forceBlackText?: boolean;
}

export function CustomSubscription({
  plans,
  title = "Choose Your Plan",
  description = "Upgrade or change your subscription plan\nAll plans include access to our audiobook library and core features.",
  forceBlackText = false,
}: CustomSubscriptionProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const { t } = useLanguage();

  // Simple toggle handler without complex animations
  const handleToggle = useCallback(() => {
    setIsMonthly(prev => !prev);
  }, []);

  // Simple price display without complex animations
  const PriceDisplay = ({ plan }: { plan: PricingPlan }) => (
    <div className="mt-6 flex items-center justify-center gap-x-2">
      <span className="text-5xl font-bold tracking-tight text-black transition-all duration-300">
        ${isMonthly ? plan.price : plan.yearlyPrice}
      </span>
      {plan.period !== t('subscription.forever') && (
        <span className="text-sm font-semibold leading-6 tracking-wide text-black">
          / {plan.period}
        </span>
      )}
    </div>
  );

  // Get button color based on plan type
  const getButtonColor = (plan: PricingPlan) => {
    if (plan.buttonText.toLowerCase().includes('downgrade')) {
      return '#ef4444'; // Red for downgrade
    }
    if (plan.buttonText.toLowerCase().includes('current')) {
      return '#9ca3af'; // Subdued gray for current plan
    }
    return '#fece0a'; // Default yellow
  };

  // Get button styling based on plan type
  const getButtonClassName = (plan: PricingPlan) => {
    let baseClass = "w-full text-center";
    
    if (plan.buttonText.toLowerCase().includes('current')) {
      baseClass += " opacity-75"; // Make current plan button subdued
    }
    
    return baseClass;
  };

  return (
    <div className="py-12 px-6">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
          {title}
        </h2>
        <p className="text-gray-600 text-lg whitespace-pre-line max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Simple toggle without complex animations */}
      <div className="flex justify-center items-center mb-10 gap-4">
        <span className={`font-semibold transition-colors duration-300 ${isMonthly ? 'text-black' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={handleToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#fece0a] focus:ring-offset-2"
          style={{ backgroundColor: isMonthly ? '#d1d5db' : '#fece0a' }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
              isMonthly ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </button>
        <span className={`font-semibold transition-colors duration-300 ${!isMonthly ? 'text-black' : 'text-gray-500'}`}>
          Annual <span className="text-[#fece0a] font-bold">(Save 20%)</span>
        </span>
      </div>

      {/* Pricing cards with simple transitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-2xl border-2 p-6 bg-white text-center relative transition-all duration-300 hover:shadow-lg ${
              plan.isPopular ? 'border-[#fece0a] shadow-lg' : 'border-gray-200'
            } ${!plan.isPopular ? 'mt-5' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-[#fece0a] py-1 px-3 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-black h-4 w-4 fill-current" />
                <span className="text-black ml-1 font-sans font-semibold">
                  Popular
                </span>
              </div>
            )}
            
            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold text-black mb-4">
                {plan.name}
              </p>
              
              <PriceDisplay plan={plan} />

              <p className="text-xs leading-5 text-gray-600 mb-6">
                {isMonthly ? t('subscription.billedMonthly') : t('subscription.billedAnnually')}
              </p>

              <ul className="mt-5 gap-3 flex flex-col text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-black text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-6 border-gray-200" />

              <FlowButton
                text={plan.buttonText}
                onClick={() => {}}
                className={getButtonClassName(plan)}
                circleColor={getButtonColor(plan)}
                forceBlackText={forceBlackText}
              />
              
              <p className="mt-4 text-xs leading-5 text-gray-600">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}