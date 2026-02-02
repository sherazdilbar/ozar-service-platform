'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { BUDAPEST_DISTRICTS, BudapestDistrict } from '@ozar/shared';

interface ImprovedSearchBarProps {
  initialQuery?: string;
  initialDistrict?: string;
  onSearch?: (query: string, district?: string) => void;
  className?: string;
}

export default function ImprovedSearchBar({
  initialQuery = '',
  initialDistrict = '',
  onSearch,
  className = '',
}: ImprovedSearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(searchQuery, selectedDistrict);
    } else {
      // Build search URL
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }
      if (selectedDistrict) {
        params.set('district', selectedDistrict);
      }
      
      const url = params.toString() ? `/search?${params.toString()}` : '/search';
      router.push(url);
    }
  };

  const districtOptions = Object.keys(BUDAPEST_DISTRICTS) as BudapestDistrict[];
  
  console.log('ImprovedSearchBar render:', {
    showDistrictDropdown,
    districtOptionsCount: districtOptions.length,
    selectedDistrict,
  });

  return (
    <form 
      onSubmit={handleSearch}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex items-stretch">
        {/* Service Search Input */}
        <div className="flex-1 flex items-center px-6 py-4 border-r border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="What service do you need?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none focus:ring-0"
          />
        </div>

        {/* District Selector */}
        <div 
          className="relative flex items-center px-6 py-4 border-r border-gray-200 dark:border-gray-700 min-w-[240px] z-30 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('District container clicked, current state:', showDistrictDropdown);
            setShowDistrictDropdown(!showDistrictDropdown);
          }}
        >
          <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <div className="flex-1 flex items-center justify-between text-base text-gray-900 dark:text-white">
            <span className={selectedDistrict ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
              {selectedDistrict 
                ? `District ${selectedDistrict} - ${BUDAPEST_DISTRICTS[selectedDistrict as BudapestDistrict].nameEn}`
                : 'Select District'
              }
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 transition-transform ${showDistrictDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown */}
          {showDistrictDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Backdrop clicked');
                  setShowDistrictDropdown(false);
                }}
              />
              
              {/* Dropdown Menu */}
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="p-2">
                  {/* All Districts Option */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('All Districts clicked');
                      setSelectedDistrict('');
                      setShowDistrictDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      !selectedDistrict
                        ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 font-semibold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All Districts
                  </button>

                  {/* District Options */}
                  {districtOptions.map((district) => (
                    <button
                      key={district}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('District clicked:', district);
                        setSelectedDistrict(district);
                        setShowDistrictDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedDistrict === district
                          ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">District {district}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {BUDAPEST_DISTRICTS[district].nameEn}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-base transition-all hover:shadow-lg flex-shrink-0"
        >
          Search
        </button>
      </div>

      {/* Mobile Layout - Vertical Stack */}
      <div className="md:hidden flex flex-col">
        {/* Service Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="What service do you need?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none focus:ring-0"
          />
        </div>

        {/* District Selector */}
        <div className="relative flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <button
            type="button"
            onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
            className="flex-1 flex items-center justify-between text-base text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 text-left"
          >
            <span className={selectedDistrict ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
              {selectedDistrict 
                ? `District ${selectedDistrict}`
                : 'Select District'
              }
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 transition-transform ${showDistrictDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Dropdown */}
          {showDistrictDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowDistrictDropdown(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-20">
                <div className="p-2">
                  {/* All Districts Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict('');
                      setShowDistrictDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      !selectedDistrict
                        ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 font-semibold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All Districts
                  </button>

                  {/* District Options */}
                  {districtOptions.map((district) => (
                    <button
                      key={district}
                      type="button"
                      onClick={() => {
                        setSelectedDistrict(district);
                        setShowDistrictDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedDistrict === district
                          ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">District {district}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {BUDAPEST_DISTRICTS[district].nameEn}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-base transition-all hover:shadow-lg"
        >
          Search
        </button>
      </div>
    </form>
  );
}
