'use client';

import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';

interface CategoryPillsProps {
  selected?: ServiceCategory;
  onSelect: (category?: ServiceCategory) => void;
}

export default function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  const categories = Object.values(ServiceCategory);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(undefined)}
        className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors flex-shrink-0 ${
          !selected
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors flex-shrink-0 ${
            selected === category
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1">{CATEGORY_ICONS[category]}</span>
          {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}
