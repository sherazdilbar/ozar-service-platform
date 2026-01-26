'use client';

import { useState } from 'react';

interface FilterBarProps {
  availableNow: boolean;
  onAvailableNowChange: (value: boolean) => void;
  radiusKm: number;
  onRadiusChange: (value: number) => void;
  sortBy: 'recommended' | 'nearest' | 'rating' | 'price';
  onSortChange: (value: 'recommended' | 'nearest' | 'rating' | 'price') => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceRangeChange?: (min: number | undefined, max: number | undefined) => void;
  minRating?: number;
  onMinRatingChange?: (rating: number | undefined) => void;
}

const RADIUS_OPTIONS = [1, 3, 5, 10];
const RATING_OPTIONS = [3, 3.5, 4, 4.5];

export default function FilterBar({
  availableNow,
  onAvailableNowChange,
  radiusKm,
  onRadiusChange,
  sortBy,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [tempMinPrice, setTempMinPrice] = useState(minPrice?.toString() || '');
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice?.toString() || '');

  const handleApplyPriceFilter = () => {
    const min = tempMinPrice ? parseInt(tempMinPrice) : undefined;
    const max = tempMaxPrice ? parseInt(tempMaxPrice) : undefined;
    onPriceRangeChange?.(min, max);
  };

  const activeFiltersCount = [
    minPrice !== undefined,
    maxPrice !== undefined,
    minRating !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Available Now Toggle */}
        <button
          onClick={() => onAvailableNowChange(!availableNow)}
          className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            availableNow
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          ⚡ Available Now
        </button>

        {/* Radius Selector */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
          {RADIUS_OPTIONS.map(radius => (
            <button
              key={radius}
              onClick={() => onRadiusChange(radius)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                radiusKm === radius
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {radius}km
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 font-medium text-sm cursor-pointer hover:bg-gray-50 transition-all"
        >
          <option value="recommended">Recommended</option>
          <option value="nearest">Nearest</option>
          <option value="rating">Top Rated</option>
          <option value="price">Price: Low to High</option>
        </select>

        {/* More Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 font-medium text-sm hover:bg-gray-50 transition-all whitespace-nowrap flex items-center gap-2"
        >
          🔍 Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          {/* Price Range */}
          {onPriceRangeChange && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleApplyPriceFilter}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Minimum Rating */}
          {onMinRatingChange && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⭐ Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMinRatingChange(undefined)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    minRating === undefined
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Any
                </button>
                {RATING_OPTIONS.map(rating => (
                  <button
                    key={rating}
                    onClick={() => onMinRatingChange(rating)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      minRating === rating
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating}+
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setTempMinPrice('');
                setTempMaxPrice('');
                onPriceRangeChange?.(undefined, undefined);
                onMinRatingChange?.(undefined);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
