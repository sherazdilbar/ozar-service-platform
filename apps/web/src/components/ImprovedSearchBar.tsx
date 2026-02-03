'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
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

  return (
    <form 
      onSubmit={handleSearch}
      className={`max-w-4xl mx-auto ${className}`}
    >
      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex items-stretch bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 gap-3">
        {/* Service Search Input */}
        <div className="flex-1 flex items-center px-4 bg-gray-50 dark:bg-gray-700 rounded-xl h-14 border border-transparent focus-within:border-teal-200 dark:focus-within:border-teal-500 focus-within:bg-white dark:focus-within:bg-gray-600 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base text-gray-900 dark:text-white placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 font-medium"
          />
        </div>

        {/* District Selector */}
        <div 
          className="relative flex-1 flex items-center px-4 bg-gray-50 dark:bg-gray-700 rounded-xl h-14 border border-transparent focus-within:border-teal-200 dark:focus-within:border-teal-500 focus-within:bg-white dark:focus-within:bg-gray-600 transition-all cursor-pointer z-30"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDistrictDropdown(!showDistrictDropdown);
          }}
        >
          <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <div className="flex-1 flex items-center justify-between">
            <span className={`text-base font-medium ${selectedDistrict ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              {selectedDistrict 
                ? `${t('search.district')} ${selectedDistrict}`
                : t('search.selectDistrict')
              }
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${showDistrictDropdown ? 'rotate-180' : ''}`} />
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
                  setShowDistrictDropdown(false);
                }}
              />
              
              {/* Dropdown Menu */}
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto z-50"
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
                      setSelectedDistrict('');
                      setShowDistrictDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      !selectedDistrict
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('search.allDistricts')}
                  </button>

                  {/* District Options */}
                  {districtOptions.map((district) => (
                    <button
                      key={district}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedDistrict(district);
                        setShowDistrictDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        selectedDistrict === district
                          ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t('search.district')} {district}</span>
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
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 h-14 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-teal-500/30 active:scale-95 flex items-center justify-center"
        >
          {t('search.button')}
        </button>
      </div>

      {/* Mobile Layout - Vertical Stack */}
      <div className="md:hidden bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
        {/* Service Search Input */}
        <div className="flex items-center px-4 bg-gray-50 dark:bg-gray-700 rounded-xl h-14 border border-transparent focus-within:border-orange-200 dark:focus-within:border-orange-500 focus-within:bg-white dark:focus-within:bg-gray-600 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base text-gray-900 dark:text-white placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 font-medium"
          />
        </div>

        {/* District Selector */}
        <div className="relative flex items-center px-4 bg-gray-50 dark:bg-gray-700 rounded-xl h-14 border border-transparent focus-within:border-orange-200 dark:focus-within:border-orange-500 focus-within:bg-white dark:focus-within:bg-gray-600 transition-all">
          <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <button
            type="button"
            onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
            className="flex-1 flex items-center justify-between text-base bg-transparent border-none outline-none focus:ring-0 text-left"
          >
            <span className={`font-medium ${selectedDistrict ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              {selectedDistrict 
                ? `${t('search.district')} ${selectedDistrict}`
                : t('search.selectDistrict')
              }
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${showDistrictDropdown ? 'rotate-180' : ''}`} />
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto z-20">
                <div className="p-2">
                  {/* All Districts Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict('');
                      setShowDistrictDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      !selectedDistrict
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('search.allDistricts')}
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
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        selectedDistrict === district
                          ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t('search.district')} {district}</span>
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
          className="w-full bg-teal-600 hover:bg-teal-700 text-white h-14 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-teal-500/30 active:scale-95 flex items-center justify-center"
        >
          {t('search.button')}
        </button>
      </div>
    </form>
  );
}
