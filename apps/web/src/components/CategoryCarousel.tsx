'use client';

import { useRef } from 'react';
import { CATEGORY_GROUPS, ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryCarouselProps {
  selected?: ServiceCategory;
  onSelect: (category?: ServiceCategory) => void;
}

export default function CategoryCarousel({ selected, onSelect }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Get popular categories from each group (first 2-3 from each)
  const popularCategories: ServiceCategory[] = [
    // Home Services
    ServiceCategory.ELECTRICIAN,
    ServiceCategory.PLUMBER,
    ServiceCategory.HANDYMAN,
    ServiceCategory.HVAC_AC_REPAIR,
    ServiceCategory.PAINTING,
    // Cleaning
    ServiceCategory.HOME_CLEANING,
    ServiceCategory.DEEP_CLEANING,
    // Beauty & Wellness
    ServiceCategory.HAIRCUT,
    ServiceCategory.MASSAGE_THERAPY,
    ServiceCategory.PERSONAL_TRAINER,
    // Tech
    ServiceCategory.TV_MOUNTING,
    ServiceCategory.WIFI_SETUP,
    ServiceCategory.COMPUTER_LAPTOP_REPAIR,
    // Moving
    ServiceCategory.HOUSE_SHIFTING,
    ServiceCategory.FURNITURE_MOVING,
    // Daily Help
    ServiceCategory.COOKING_HOME_CHEF,
    ServiceCategory.BABYSITTING,
    ServiceCategory.ELDERLY_CARE,
    // Pets
    ServiceCategory.DOG_WALKING,
    ServiceCategory.PET_GROOMING,
    // Events
    ServiceCategory.PHOTOGRAPHERS,
    ServiceCategory.CATERERS,
    // Learning
    ServiceCategory.HOME_TUTORS,
    ServiceCategory.MUSIC_TEACHERS,
    // Quick Tasks
    ServiceCategory.FURNITURE_ASSEMBLY,
    ServiceCategory.EMERGENCY_ELECTRICIAN,
  ];

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Categories Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {popularCategories.map((category) => {
          const isSelected = selected === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(isSelected ? undefined : category)}
              className={`flex flex-col items-center gap-2 min-w-[100px] px-4 py-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-500 to-teal-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              <span className={`text-3xl ${isSelected ? 'drop-shadow-md' : ''}`}>
                {CATEGORY_ICONS[category]}
              </span>
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
