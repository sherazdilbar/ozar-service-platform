'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const professions = [
  'cleaner',
  'handyman',
  'plumber',
  'electrician',
  'painter',
  'gardener',
  'beautician',
  'tutor',
  'chef',
];

export default function RotatingText() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % professions.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block min-w-[280px] md:min-w-[400px] text-left text-teal-600 dark:text-teal-400 relative">
      <span
        className={`absolute left-0 top-0 text-5xl md:text-7xl lg:text-8xl font-extrabold transition-all duration-500 ${
          isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}
      >
        {t(`hero.rotatingProfessions.${professions[currentIndex]}`)}
      </span>
      <span className="invisible text-5xl md:text-7xl lg:text-8xl font-extrabold">{t(`hero.rotatingProfessions.${professions[0]}`)}</span>
    </span>
  );
}
