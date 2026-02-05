'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_GROUPS, ServiceCategory, CATEGORY_LABELS } from '@ozar/shared';
import { 
  ChevronLeft, ChevronRight, Home, Sparkles, Scissors, Monitor, Truck, ChefHat, Dog, PartyPopper, BookOpen, Zap, X,
  Zap as Electric, Droplet, Wrench, Wind, Refrigerator, Flame, PaintBucket, Grid3x3, Bath, DoorOpen,
  Trees, Fence, Spray, Snowflake, SparklesIcon, Building2, Package, Sofa, Armchair,
  ScissorsIcon, User, Smile, Hand, Stethoscope, Activity, Dumbbell,
  Tv, Wifi, Home as SmartHome, Camera, Laptop, Printer,
  TruckIcon, Box, PackageCheck, Trash2,
  ChefHat as Cook, UtensilsCrossed, Baby, HeartPulse, Users,
  PawPrint, Bone, Scissors as PetScissors, Cross,
  Cake, UtensilsIcon, Music, CameraIcon, Video,
  GraduationCap, Guitar, Languages, Dumbbell as Fitness,
  Hammer, Drill, Tool, AlertCircle
} from 'lucide-react';

interface CategoryGroupCarouselProps {
  selected?: ServiceCategory;
  onCategorySelect?: (category: ServiceCategory) => void;
}

// Map category IDs to Lucide icons
const CATEGORY_GROUP_ICONS: Record<string, any> = {
  home_repairs: Home,
  cleaning: Sparkles,
  beauty_wellness: Scissors,
  tech_smart_home: Monitor,
  moving_logistics: Truck,
  daily_help: ChefHat,
  pet_services: Dog,
  events: PartyPopper,
  learning: BookOpen,
  quick_tasks: Zap,
};

// Map subcategory services to Lucide icons
const SUBCATEGORY_ICONS: Record<string, any> = {
  // Home & Property
  ELECTRICIAN: Electric,
  PLUMBER: Droplet,
  HANDYMAN: Wrench,
  HVAC_AC_REPAIR: Wind,
  APPLIANCE_REPAIR: Refrigerator,
  GAS_TECHNICIAN: Flame,
  PAINTING: PaintBucket,
  FLOORING: Grid3x3,
  TILE_WORK: Grid3x3,
  KITCHEN_BATHROOM_REMODELING: Bath,
  DOOR_WINDOW_INSTALLATION: DoorOpen,
  GARDENING_LAWN_MOWING: Trees,
  TREE_TRIMMING: Trees,
  FENCE_INSTALLATION: Fence,
  PRESSURE_WASHING: Spray,
  SNOW_REMOVAL: Snowflake,
  
  // Cleaning
  HOME_CLEANING: SparklesIcon,
  DEEP_CLEANING: Sparkles,
  OFFICE_CLEANING: Building2,
  MOVE_IN_OUT_CLEANING: Package,
  CARPET_SOFA_CLEANING: Sofa,
  POST_CONSTRUCTION_CLEANING: Armchair,
  
  // Beauty & Wellness
  HAIRCUT: ScissorsIcon,
  HAIRSTYLIST: ScissorsIcon,
  BARBER: ScissorsIcon,
  BEARD_GROOMING: User,
  MANICURE_PEDICURE: Hand,
  MAKEUP_ARTIST: Smile,
  NAIL_TECHNICIAN: Hand,
  EYELASH_EYEBROW_SERVICES: Smile,
  MASSAGE_THERAPY: Stethoscope,
  PHYSIOTHERAPY: Activity,
  YOGA_INSTRUCTOR: Activity,
  PERSONAL_TRAINER: Dumbbell,
  
  // Tech & Smart Home
  TV_MOUNTING: Tv,
  WIFI_SETUP: Wifi,
  SMART_HOME_INSTALLATION: SmartHome,
  CCTV_INSTALLATION: Camera,
  COMPUTER_LAPTOP_REPAIR: Laptop,
  PRINTER_SETUP: Printer,
  
  // Moving & Logistics
  HOUSE_SHIFTING: TruckIcon,
  FURNITURE_MOVING: Sofa,
  SMALL_DELIVERIES: Box,
  PACKING_UNPACKING: PackageCheck,
  JUNK_REMOVAL: Trash2,
  
  // Daily Help
  COOKING_HOME_CHEF: Cook,
  MEAL_PREP: UtensilsCrossed,
  BABYSITTING: Baby,
  ELDERLY_CARE: HeartPulse,
  HOME_HELPER: Users,
  
  // Pet Services
  DOG_WALKING: PawPrint,
  PET_SITTING: Bone,
  PET_GROOMING: PetScissors,
  VET_VISIT_ASSISTANCE: Cross,
  
  // Events
  PARTY_DECORATORS: Cake,
  CATERERS: UtensilsIcon,
  DJS: Music,
  PHOTOGRAPHERS: CameraIcon,
  VIDEOGRAPHERS: Video,
  
  // Learning
  HOME_TUTORS: GraduationCap,
  MUSIC_TEACHERS: Guitar,
  LANGUAGE_TUTORS: Languages,
  FITNESS_TRAINERS: Fitness,
  
  // Quick Tasks
  FURNITURE_ASSEMBLY: Hammer,
  MOUNTING_DRILLING: Drill,
  SMALL_FIXES: Tool,
  EMERGENCY_ELECTRICIAN: AlertCircle,
  EMERGENCY_PLUMBER: AlertCircle,
};

export default function CategoryGroupCarousel({ selected, onCategorySelect }: CategoryGroupCarouselProps) {
  const { t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleGroupClick = (groupId: string) => {
    // Toggle subcategory expansion
    setSelectedGroup(selectedGroup === groupId ? null : groupId);
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const selectedGroupData = CATEGORY_GROUPS.find(g => g.id === selectedGroup);

  return (
    <div className="space-y-8">
      {/* Centered Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t('categories.title')}</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('categories.subtitle')}</p>
      </div>

      {/* Category Grid/Carousel with Side Navigation */}
      <div className="relative">
        {/* Left Arrow - Outside */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:block absolute -left-12 lg:-left-16 xl:-left-20 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-6 md:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORY_GROUPS.map((group) => {
            const Icon = CATEGORY_GROUP_ICONS[group.id] || Home;
            const isSelected = selectedGroup === group.id;
            
            return (
              <button
                key={group.id}
                onClick={() => handleGroupClick(group.id)}
                className={`group relative flex flex-col items-center gap-3 min-w-[140px] md:min-w-0 p-6 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500 dark:border-teal-400 shadow-lg'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-lg'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-teal-100 dark:bg-teal-800/50'
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30'
                }`}>
                  <Icon className={`w-6 h-6 transition-colors ${
                    isSelected
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                  }`} />
                </div>

                {/* Category Name */}
                <div className="text-center">
                  <h4 className={`text-sm font-semibold mb-1 leading-tight ${
                    isSelected
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {group.label}
                  </h4>
                  <p className={`text-xs ${
                    isSelected
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {group.subcategories.length} services
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Arrow - Outside */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:block absolute -right-12 lg:-right-16 xl:-right-20 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Subcategory Cards Grid */}
      {selectedGroupData && (
        <div className="animate-fade-in mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                {(() => {
                  const Icon = CATEGORY_GROUP_ICONS[selectedGroupData.id] || Home;
                  return <Icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />;
                })()}
                {selectedGroupData.label}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
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
              const Icon = SUBCATEGORY_ICONS[category] || Wrench;
              
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
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl mb-3 transition-all ${
                      isSelected
                        ? 'bg-teal-100 dark:bg-teal-800/50'
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30'
                    }`}>
                      <Icon className={`w-7 h-7 transition-colors ${
                        isSelected
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                      }`} />
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
