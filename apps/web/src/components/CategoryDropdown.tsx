'use client';

import { useState, useRef, useEffect } from 'react';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_GROUPS, CategoryGroup } from '@ozar/shared';
import { ChevronDown, X } from 'lucide-react';

interface CategoryDropdownProps {
  selected?: ServiceCategory;
  onSelect: (category?: ServiceCategory) => void;
  placeholder?: string;
}

export default function CategoryDropdown({ selected, onSelect, placeholder = 'All Categories' }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category: ServiceCategory) => {
    onSelect(category);
    setIsOpen(false);
    setExpandedGroup(null);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          {selected ? (
            <>
              <span className="text-xl">{CATEGORY_ICONS[selected]}</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {CATEGORY_LABELS[selected]}
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selected && (
            <button
              onClick={handleClearSelection}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-[500px] overflow-y-auto">
          {/* All Categories Option */}
          <button
            onClick={() => {
              onSelect(undefined);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
              !selected ? 'bg-purple-50 dark:bg-purple-900/20' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔍</span>
              <span className="font-medium text-gray-900 dark:text-white">All Categories</span>
            </div>
          </button>

          {/* Category Groups */}
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{group.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{group.description}</div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedGroup === group.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Subcategories */}
              {expandedGroup === group.id && (
                <div className="bg-gray-50 dark:bg-gray-900/50">
                  {group.subcategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full px-6 py-2.5 text-left hover:bg-white dark:hover:bg-gray-800 transition-colors ${
                        selected === category ? 'bg-purple-50 dark:bg-purple-900/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                        <span className={`text-sm ${
                          selected === category
                            ? 'text-purple-600 dark:text-purple-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {CATEGORY_LABELS[category]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
