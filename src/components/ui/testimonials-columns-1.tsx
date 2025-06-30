"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-3 sm:gap-6 pb-3 sm:pb-6"
        style={{ backgroundColor: '#212121' }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl border border-brand-light-text/10 shadow-lg shadow-brand-accent-start/10 max-w-xs w-full" 
                  key={i}
                  style={{ backgroundColor: '#eeede8' }}
                >
                  <div className="text-sm sm:text-base font-manrope text-brand-light-text leading-relaxed">{text}</div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <img
                      width={32}
                      height={32}
                      src={image}
                      alt={name}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="text-sm sm:text-base font-manrope font-medium text-brand-light-text">{name}</div>
                      <div className="text-xs sm:text-sm font-manrope text-brand-muted-text">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    text: "Reborn completely changed how I use my downtime. It feels like I've reclaimed hours of my life to grow mentally.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    name: "Emma Johnson",
    role: "Marketing Manager",
  },
  {
    text: "As a new mom, Reborn helped me find peace and purpose during chaotic days. The interactive format is perfect.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    name: "Sarah Williams",
    role: "New Mother",
  },
  {
    text: "The podcast-style audiobooks make complex topics so much easier to understand and retain.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    name: "Michael Chen",
    role: "Software Engineer",
  },
  {
    text: "I've learned more in 3 months with Reborn than I did in years of traditional reading. Game changer!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    name: "David Rodriguez",
    role: "Entrepreneur",
  },
  {
    text: "The real-time examples and interactive quizzes keep me engaged like no other learning platform has before.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    name: "Lisa Thompson",
    role: "Teacher",
  },
  {
    text: "Finally, a learning platform that fits into my busy lifestyle perfectly. I can learn while commuting!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    name: "James Wilson",
    role: "Business Consultant",
  },
  {
    text: "The quality of content and production value is incredible. It's like having a personal tutor.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    name: "Maria Garcia",
    role: "Designer",
  },
  {
    text: "Reborn transformed my daily commute into productive learning time. I actually look forward to traffic now!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    name: "Robert Kim",
    role: "Sales Director",
  },
  {
    text: "The way they break down complex concepts into digestible, engaging content is absolutely brilliant.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    name: "Jennifer Lee",
    role: "Product Manager",
  },
];