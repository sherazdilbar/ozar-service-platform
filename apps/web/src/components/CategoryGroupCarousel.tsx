'use client';

import { useState, useRef } from 'react';
import { CATEGORY_GROUPS, ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CategoryGroupCarouselProps {
  selected?: ServiceCategory;
  onCategorySelect?: (category: ServiceCategory) => void;
}

export default function CategoryGroupCarousel({ selected, onCategorySelect }: CategoryGroupCarouselProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
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

  const handleGroupClick = (groupId: string) => {
    // Allow expanding/collapsing to show subcategories
    setSelectedGroup(selectedGroup === groupId ? null : groupId);
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    // Call the callback to navigate to search with category filter
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const selectedGroupData = CATEGORY_GROUPS.find(g => g.id === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Main Category Groups Carousel */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Category Groups Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORY_GROUPS.map((group) => {
            const isSelected = selectedGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className={`flex flex-col items-center gap-2 min-w-[120px] px-6 py-4 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500 dark:border-teal-400 shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-4xl">
                  {group.icon}
                </span>
                <span
                  className={`text-sm font-semibold text-center leading-tight ${
                    isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {group.label}
                </span>
                <span
                  className={`text-xs text-center ${
                    isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {group.subcategories.length} services
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

      {/* Subcategory Cards Grid */}
      {selectedGroupData && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-3xl">{selectedGroupData.icon}</span>
                {selectedGroupData.label}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {selectedGroupData.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedGroup(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedGroupData.subcategories.map((category) => {
              const isSelected = selected === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`group relative overflow-hidden rounded-xl transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'ring-2 ring-teal-500 shadow-lg scale-105 bg-teal-50 dark:bg-teal-900/20'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md'
                  }`}
                >
                  {/* Card Content */}
                  <div className="aspect-[4/3] p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-3 transform transition-transform group-hover:scale-110">
                      {CATEGORY_ICONS[category]}
                    </div>
                    <h5 className={`font-semibold text-sm leading-tight ${
                      isSelected 
                        ? 'text-teal-700 dark:text-teal-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {CATEGORY_LABELS[category]}
                    </h5>
                  </div>
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
