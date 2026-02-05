'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
  className?: string;
}

function Counter({ value, suffix = '', label, delay = 0, className = '' }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
  const rounded = useTransform(springValue, (latest) => Math.floor(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);
    }
  }, [isInView, value, motionValue, delay]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={`flex flex-col items-center text-center p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-teal-100 ${className}`}
    >
      <div className="text-3xl md:text-4xl font-bold text-teal-700 mb-1 flex items-baseline">
        {displayValue}
        <span className="text-teal-500 ml-1 text-2xl">{suffix}</span>
      </div>
      <p className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wide">
        {label}
      </p>
    </motion.div>
  );
}

export function AnimatedStats() {
  const stats = [
    { value: 1000, suffix: '+', label: 'Happy Customers' },
    { value: 500, suffix: '+', label: 'Trusted Pros' },
    { value: 50, suffix: '+', label: 'Categories' },
    { value: 98, suffix: '%', label: 'Satisfaction' },
  ];

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, index) => (
          <Counter
            key={index}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            delay={0.5 + index * 0.1}
            className="transform hover:-translate-y-1 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
}
