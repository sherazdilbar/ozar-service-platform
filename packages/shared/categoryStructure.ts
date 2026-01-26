import { ServiceCategory } from './types';

export interface CategoryGroup {
  id: string;
  label: string;
  icon: string;
  description: string;
  subcategories: ServiceCategory[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'home_repairs',
    label: 'Home & Property Services',
    icon: '🏠',
    description: 'Repairs, maintenance, and property care',
    subcategories: [
      ServiceCategory.ELECTRICIAN,
      ServiceCategory.PLUMBER,
      ServiceCategory.HANDYMAN,
      ServiceCategory.HVAC_AC_REPAIR,
      ServiceCategory.APPLIANCE_REPAIR,
      ServiceCategory.GAS_TECHNICIAN,
      ServiceCategory.PAINTING,
      ServiceCategory.FLOORING,
      ServiceCategory.TILE_WORK,
      ServiceCategory.KITCHEN_BATHROOM_REMODELING,
      ServiceCategory.DOOR_WINDOW_INSTALLATION,
      ServiceCategory.GARDENING_LAWN_MOWING,
      ServiceCategory.TREE_TRIMMING,
      ServiceCategory.FENCE_INSTALLATION,
      ServiceCategory.PRESSURE_WASHING,
      ServiceCategory.SNOW_REMOVAL,
    ],
  },
  {
    id: 'cleaning',
    label: 'Cleaning Services',
    icon: '🧹',
    description: 'Professional cleaning for homes and offices',
    subcategories: [
      ServiceCategory.HOME_CLEANING,
      ServiceCategory.DEEP_CLEANING,
      ServiceCategory.OFFICE_CLEANING,
      ServiceCategory.MOVE_IN_OUT_CLEANING,
      ServiceCategory.CARPET_SOFA_CLEANING,
      ServiceCategory.POST_CONSTRUCTION_CLEANING,
    ],
  },
  {
    id: 'beauty_wellness',
    label: 'Beauty, Grooming & Wellness',
    icon: '💇',
    description: 'Personal care and wellness services',
    subcategories: [
      ServiceCategory.HAIRCUT,
      ServiceCategory.HAIRSTYLIST,
      ServiceCategory.BARBER,
      ServiceCategory.BEARD_GROOMING,
      ServiceCategory.MANICURE_PEDICURE,
      ServiceCategory.MAKEUP_ARTIST,
      ServiceCategory.NAIL_TECHNICIAN,
      ServiceCategory.EYELASH_EYEBROW_SERVICES,
      ServiceCategory.MASSAGE_THERAPY,
      ServiceCategory.PHYSIOTHERAPY,
      ServiceCategory.YOGA_INSTRUCTOR,
      ServiceCategory.PERSONAL_TRAINER,
    ],
  },
  {
    id: 'tech_smart_home',
    label: 'Tech & Smart Home',
    icon: '💻',
    description: 'Technology and smart home solutions',
    subcategories: [
      ServiceCategory.TV_MOUNTING,
      ServiceCategory.WIFI_SETUP,
      ServiceCategory.SMART_HOME_INSTALLATION,
      ServiceCategory.CCTV_INSTALLATION,
      ServiceCategory.COMPUTER_LAPTOP_REPAIR,
      ServiceCategory.PRINTER_SETUP,
    ],
  },
  {
    id: 'moving_logistics',
    label: 'Moving & Logistics',
    icon: '🚚',
    description: 'Moving, delivery, and logistics services',
    subcategories: [
      ServiceCategory.HOUSE_SHIFTING,
      ServiceCategory.FURNITURE_MOVING,
      ServiceCategory.SMALL_DELIVERIES,
      ServiceCategory.PACKING_UNPACKING,
      ServiceCategory.JUNK_REMOVAL,
    ],
  },
  {
    id: 'daily_help',
    label: 'Daily Help & Personal Assistance',
    icon: '👨‍🍳',
    description: 'Home help and personal care services',
    subcategories: [
      ServiceCategory.COOKING_HOME_CHEF,
      ServiceCategory.MEAL_PREP,
      ServiceCategory.BABYSITTING,
      ServiceCategory.ELDERLY_CARE,
      ServiceCategory.HOME_HELPER,
    ],
  },
  {
    id: 'pet_services',
    label: 'Pet Services',
    icon: '🐶',
    description: 'Care and services for your pets',
    subcategories: [
      ServiceCategory.DOG_WALKING,
      ServiceCategory.PET_SITTING,
      ServiceCategory.PET_GROOMING,
      ServiceCategory.VET_VISIT_ASSISTANCE,
    ],
  },
  {
    id: 'events',
    label: 'Events & Occasions',
    icon: '🎉',
    description: 'Make your events memorable',
    subcategories: [
      ServiceCategory.PARTY_DECORATORS,
      ServiceCategory.CATERERS,
      ServiceCategory.DJS,
      ServiceCategory.PHOTOGRAPHERS,
      ServiceCategory.VIDEOGRAPHERS,
    ],
  },
  {
    id: 'learning',
    label: 'Learning & Education',
    icon: '📚',
    description: 'Tutoring and skill development',
    subcategories: [
      ServiceCategory.HOME_TUTORS,
      ServiceCategory.MUSIC_TEACHERS,
      ServiceCategory.LANGUAGE_TUTORS,
      ServiceCategory.FITNESS_TRAINERS,
    ],
  },
  {
    id: 'quick_tasks',
    label: 'Quick Tasks',
    icon: '⚡',
    description: 'On-demand help for urgent needs',
    subcategories: [
      ServiceCategory.FURNITURE_ASSEMBLY,
      ServiceCategory.MOUNTING_DRILLING,
      ServiceCategory.SMALL_FIXES,
      ServiceCategory.EMERGENCY_ELECTRICIAN,
      ServiceCategory.EMERGENCY_PLUMBER,
    ],
  },
];

// Helper function to get group for a category
export function getCategoryGroup(category: ServiceCategory): CategoryGroup | undefined {
  return CATEGORY_GROUPS.find(group => group.subcategories.includes(category));
}

// Helper to get all categories flattened
export function getAllCategories(): ServiceCategory[] {
  return CATEGORY_GROUPS.flatMap(group => group.subcategories);
}
