"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

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

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  // Optimized confetti function with error handling
  const triggerConfetti = useCallback(() => {
    try {
      if (switchRef.current) {
        const rect = switchRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Use requestAnimationFrame to ensure smooth animation
        requestAnimationFrame(() => {
          confetti({
            particleCount: 30, // Reduced particle count for better performance
            spread: 45, // Reduced spread
            origin: {
              x: x / window.innerWidth,
              y: y / window.innerHeight,
            },
            colors: [
              "#fece0a",
              "#ff9f4f", 
              "#ffd700",
              "#ff6b6b",
            ],
            ticks: 150, // Reduced duration
            gravity: 1.2,
            decay: 0.94,
            startVelocity: 25, // Reduced velocity
            shapes: ["circle"],
            disableForReducedMotion: true, // Respect user preferences
          });
        });
      }
    } catch (error) {
      console.warn('Confetti animation failed:', error);
      // Continue without confetti if it fails
    }
  }, []);

  // Optimized toggle handler with immediate state update
  const handleToggle = useCallback((checked: boolean) => {
    // Update state immediately to prevent blank screen
    setIsMonthly(!checked);
    
    // Trigger confetti only if switching to annual (checked = true)
    if (checked && switchRef.current) {
      // Use a small delay to ensure state has updated
      setTimeout(triggerConfetti, 50);
    }
  }, [triggerConfetti]);

  // Memoized price display component to prevent unnecessary re-renders
  const PriceDisplay = useCallback(({ plan }: { plan: PricingPlan }) => (
    <div className="mt-6 flex items-center justify-center gap-x-2">
      <span className="text-5xl font-bold tracking-tight text-black">
        <NumberFlow
          value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)}
          format={{
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }}
          formatter={(value) => `$${value}`}
          transformTiming={{
            duration: 400, // Reduced duration for faster transitions
            easing: "ease-out",
          }}
          willChange
          className="font-variant-numeric: tabular-nums"
        />
      </span>
      {plan.period !== t('subscription.forever') && (
        <span className="text-sm font-semibold leading-6 tracking-wide text-black">
          / {plan.period}
        </span>
      )}
    </div>
  ), [isMonthly]);

  return (
    <div className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
          {title}
        </h2>
        <p className="text-gray-600 text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center mb-10 gap-4">
        <span className="font-semibold text-black">Monthly</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <Switch
            ref={switchRef as any}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative data-[state=checked]:bg-[#fece0a] data-[state=unchecked]:bg-gray-300"
          />
        </label>
        <span className="font-semibold text-black">
          Annual <span className="text-[#fece0a] font-bold">(Save 20%)</span>
        </span>
      </div>

      {/* Wrap pricing cards in AnimatePresence for smooth transitions */}
      <AnimatePresence>
        <motion.div
          key={isMonthly ? 'monthly' : 'annual'} // Key ensures re-render on state change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
        {plans.map((plan, index) => (
          <motion.div
            key={`${plan.name}-${isMonthly ? 'monthly' : 'annual'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : { opacity: 1, y: 0 }
            }
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.1 * index,
            }}
            className={cn(
              `rounded-2xl border-2 p-6 bg-white text-center lg:flex lg:flex-col lg:justify-center relative`,
              plan.isPopular ? "border-[#fece0a]" : "border-black",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0"
                : "z-10",
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-[#fece0a] py-1 px-3 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-white h-4 w-4 fill-current" />
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
                {isMonthly ? 'billed monthly' : 'billed annually'}
              </p>

              <ul className="mt-5 gap-3 flex flex-col text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-[#e8641d] mt-1 flex-shrink-0" />
                    <span className="text-black text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-6 border-gray-200" />

              <button
                className={cn(
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter py-3 px-6 rounded-lg border-2 transition-all duration-300",
                  plan.isPopular
                    ? "bg-[#fece0a] text-black border-[#fece0a] hover:bg-[#e6b809]"
                    : "bg-white text-black border-black hover:bg-black hover:text-white"
                )}
              >
                {plan.buttonText}
              </button>
              
              <p className="mt-4 text-xs leading-5 text-grey-600">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}