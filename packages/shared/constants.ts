import { ServiceCategory } from './types';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  // Home & Property Services - Repairs & Maintenance
  [ServiceCategory.ELECTRICIAN]: 'Electrician',
  [ServiceCategory.PLUMBER]: 'Plumber',
  [ServiceCategory.HANDYMAN]: 'Handyman',
  [ServiceCategory.HVAC_AC_REPAIR]: 'HVAC / AC Repair',
  [ServiceCategory.APPLIANCE_REPAIR]: 'Appliance Repair',
  [ServiceCategory.GAS_TECHNICIAN]: 'Gas Technician',
  
  // Renovation & Installation
  [ServiceCategory.PAINTING]: 'Painting',
  [ServiceCategory.FLOORING]: 'Flooring',
  [ServiceCategory.TILE_WORK]: 'Tile Work',
  [ServiceCategory.KITCHEN_BATHROOM_REMODELING]: 'Kitchen & Bathroom Remodeling',
  [ServiceCategory.DOOR_WINDOW_INSTALLATION]: 'Door & Window Installation',
  
  // Outdoor & Property Care
  [ServiceCategory.GARDENING_LAWN_MOWING]: 'Gardening & Lawn Mowing',
  [ServiceCategory.TREE_TRIMMING]: 'Tree Trimming',
  [ServiceCategory.FENCE_INSTALLATION]: 'Fence Installation',
  [ServiceCategory.PRESSURE_WASHING]: 'Pressure Washing',
  [ServiceCategory.SNOW_REMOVAL]: 'Snow Removal',
  
  // Cleaning Services
  [ServiceCategory.HOME_CLEANING]: 'Home Cleaning',
  [ServiceCategory.DEEP_CLEANING]: 'Deep Cleaning',
  [ServiceCategory.OFFICE_CLEANING]: 'Office Cleaning',
  [ServiceCategory.MOVE_IN_OUT_CLEANING]: 'Move-in / Move-out Cleaning',
  [ServiceCategory.CARPET_SOFA_CLEANING]: 'Carpet & Sofa Cleaning',
  [ServiceCategory.POST_CONSTRUCTION_CLEANING]: 'Post-construction Cleaning',
  
  // Beauty, Grooming & Wellness - Hair & Grooming
  [ServiceCategory.HAIRCUT]: 'Haircut',
  [ServiceCategory.HAIRSTYLIST]: 'Hairstylist',
  [ServiceCategory.BARBER]: 'Barber',
  [ServiceCategory.BEARD_GROOMING]: 'Beard Grooming',
  
  // Beauty Services
  [ServiceCategory.MANICURE_PEDICURE]: 'Manicure / Pedicure',
  [ServiceCategory.MAKEUP_ARTIST]: 'Makeup Artist',
  [ServiceCategory.NAIL_TECHNICIAN]: 'Nail Technician',
  [ServiceCategory.EYELASH_EYEBROW_SERVICES]: 'Eyelash / Eyebrow Services',
  
  // Wellness
  [ServiceCategory.MASSAGE_THERAPY]: 'Massage Therapy',
  [ServiceCategory.PHYSIOTHERAPY]: 'Physiotherapy',
  [ServiceCategory.YOGA_INSTRUCTOR]: 'Yoga Instructor',
  [ServiceCategory.PERSONAL_TRAINER]: 'Personal Trainer',
  
  // Tech & Smart Home
  [ServiceCategory.TV_MOUNTING]: 'TV Mounting',
  [ServiceCategory.WIFI_SETUP]: 'Wi-Fi Setup',
  [ServiceCategory.SMART_HOME_INSTALLATION]: 'Smart Home Installation',
  [ServiceCategory.CCTV_INSTALLATION]: 'CCTV Installation',
  [ServiceCategory.COMPUTER_LAPTOP_REPAIR]: 'Computer & Laptop Repair',
  [ServiceCategory.PRINTER_SETUP]: 'Printer Setup',
  
  // Moving & Logistics
  [ServiceCategory.HOUSE_SHIFTING]: 'House Shifting',
  [ServiceCategory.FURNITURE_MOVING]: 'Furniture Moving',
  [ServiceCategory.SMALL_DELIVERIES]: 'Small Deliveries',
  [ServiceCategory.PACKING_UNPACKING]: 'Packing & Unpacking',
  [ServiceCategory.JUNK_REMOVAL]: 'Junk Removal',
  
  // Daily Help & Personal Assistance
  [ServiceCategory.COOKING_HOME_CHEF]: 'Cooking / Home Chef',
  [ServiceCategory.MEAL_PREP]: 'Meal Prep',
  [ServiceCategory.BABYSITTING]: 'Babysitting',
  [ServiceCategory.ELDERLY_CARE]: 'Elderly Care',
  [ServiceCategory.HOME_HELPER]: 'Home Helper',
  
  // Pet Services
  [ServiceCategory.DOG_WALKING]: 'Dog Walking',
  [ServiceCategory.PET_SITTING]: 'Pet Sitting',
  [ServiceCategory.PET_GROOMING]: 'Pet Grooming',
  [ServiceCategory.VET_VISIT_ASSISTANCE]: 'Vet Visit Assistance',
  
  // Events & Occasions
  [ServiceCategory.PARTY_DECORATORS]: 'Party Decorators',
  [ServiceCategory.CATERERS]: 'Caterers',
  [ServiceCategory.DJS]: 'DJs',
  [ServiceCategory.PHOTOGRAPHERS]: 'Photographers',
  [ServiceCategory.VIDEOGRAPHERS]: 'Videographers',
  
  // Learning & Education
  [ServiceCategory.HOME_TUTORS]: 'Home Tutors',
  [ServiceCategory.MUSIC_TEACHERS]: 'Music Teachers',
  [ServiceCategory.LANGUAGE_TUTORS]: 'Language Tutors',
  [ServiceCategory.FITNESS_TRAINERS]: 'Fitness Trainers',
  
  // Quick Tasks (On-Demand)
  [ServiceCategory.FURNITURE_ASSEMBLY]: 'Furniture Assembly',
  [ServiceCategory.MOUNTING_DRILLING]: 'Mounting / Drilling',
  [ServiceCategory.SMALL_FIXES]: 'Small Fixes',
  [ServiceCategory.EMERGENCY_ELECTRICIAN]: 'Emergency Electrician',
  [ServiceCategory.EMERGENCY_PLUMBER]: 'Emergency Plumber'
};

export const CATEGORY_ICONS: Record<ServiceCategory, string> = {
  // Home & Property Services - Repairs & Maintenance
  [ServiceCategory.ELECTRICIAN]: '⚡',
  [ServiceCategory.PLUMBER]: '🔧',
  [ServiceCategory.HANDYMAN]: '🛠️',
  [ServiceCategory.HVAC_AC_REPAIR]: '❄️',
  [ServiceCategory.APPLIANCE_REPAIR]: '🔌',
  [ServiceCategory.GAS_TECHNICIAN]: '🔥',
  
  // Renovation & Installation
  [ServiceCategory.PAINTING]: '🎨',
  [ServiceCategory.FLOORING]: '🪵',
  [ServiceCategory.TILE_WORK]: '🧱',
  [ServiceCategory.KITCHEN_BATHROOM_REMODELING]: '🏗️',
  [ServiceCategory.DOOR_WINDOW_INSTALLATION]: '🚪',
  
  // Outdoor & Property Care
  [ServiceCategory.GARDENING_LAWN_MOWING]: '🌿',
  [ServiceCategory.TREE_TRIMMING]: '🌳',
  [ServiceCategory.FENCE_INSTALLATION]: '🪵',
  [ServiceCategory.PRESSURE_WASHING]: '💦',
  [ServiceCategory.SNOW_REMOVAL]: '❄️',
  
  // Cleaning Services
  [ServiceCategory.HOME_CLEANING]: '🧹',
  [ServiceCategory.DEEP_CLEANING]: '✨',
  [ServiceCategory.OFFICE_CLEANING]: '🏢',
  [ServiceCategory.MOVE_IN_OUT_CLEANING]: '📦',
  [ServiceCategory.CARPET_SOFA_CLEANING]: '🛋️',
  [ServiceCategory.POST_CONSTRUCTION_CLEANING]: '🏗️',
  
  // Beauty, Grooming & Wellness - Hair & Grooming
  [ServiceCategory.HAIRCUT]: '✂️',
  [ServiceCategory.HAIRSTYLIST]: '💇',
  [ServiceCategory.BARBER]: '💈',
  [ServiceCategory.BEARD_GROOMING]: '🧔',
  
  // Beauty Services
  [ServiceCategory.MANICURE_PEDICURE]: '💅',
  [ServiceCategory.MAKEUP_ARTIST]: '💄',
  [ServiceCategory.NAIL_TECHNICIAN]: '💅',
  [ServiceCategory.EYELASH_EYEBROW_SERVICES]: '👁️',
  
  // Wellness
  [ServiceCategory.MASSAGE_THERAPY]: '💆',
  [ServiceCategory.PHYSIOTHERAPY]: '🏥',
  [ServiceCategory.YOGA_INSTRUCTOR]: '🧘',
  [ServiceCategory.PERSONAL_TRAINER]: '💪',
  
  // Tech & Smart Home
  [ServiceCategory.TV_MOUNTING]: '📺',
  [ServiceCategory.WIFI_SETUP]: '📡',
  [ServiceCategory.SMART_HOME_INSTALLATION]: '🏠',
  [ServiceCategory.CCTV_INSTALLATION]: '📹',
  [ServiceCategory.COMPUTER_LAPTOP_REPAIR]: '💻',
  [ServiceCategory.PRINTER_SETUP]: '🖨️',
  
  // Moving & Logistics
  [ServiceCategory.HOUSE_SHIFTING]: '🚚',
  [ServiceCategory.FURNITURE_MOVING]: '📦',
  [ServiceCategory.SMALL_DELIVERIES]: '🚴',
  [ServiceCategory.PACKING_UNPACKING]: '📦',
  [ServiceCategory.JUNK_REMOVAL]: '🗑️',
  
  // Daily Help & Personal Assistance
  [ServiceCategory.COOKING_HOME_CHEF]: '👨‍🍳',
  [ServiceCategory.MEAL_PREP]: '🍱',
  [ServiceCategory.BABYSITTING]: '👶',
  [ServiceCategory.ELDERLY_CARE]: '👴',
  [ServiceCategory.HOME_HELPER]: '🏠',
  
  // Pet Services
  [ServiceCategory.DOG_WALKING]: '🐶',
  [ServiceCategory.PET_SITTING]: '🐾',
  [ServiceCategory.PET_GROOMING]: '✂️',
  [ServiceCategory.VET_VISIT_ASSISTANCE]: '🏥',
  
  // Events & Occasions
  [ServiceCategory.PARTY_DECORATORS]: '🎉',
  [ServiceCategory.CATERERS]: '🍽️',
  [ServiceCategory.DJS]: '🎧',
  [ServiceCategory.PHOTOGRAPHERS]: '📷',
  [ServiceCategory.VIDEOGRAPHERS]: '🎥',
  
  // Learning & Education
  [ServiceCategory.HOME_TUTORS]: '📚',
  [ServiceCategory.MUSIC_TEACHERS]: '🎵',
  [ServiceCategory.LANGUAGE_TUTORS]: '🗣️',
  [ServiceCategory.FITNESS_TRAINERS]: '🏋️',
  
  // Quick Tasks (On-Demand)
  [ServiceCategory.FURNITURE_ASSEMBLY]: '🔨',
  [ServiceCategory.MOUNTING_DRILLING]: '🔩',
  [ServiceCategory.SMALL_FIXES]: '🔧',
  [ServiceCategory.EMERGENCY_ELECTRICIAN]: '⚡',
  [ServiceCategory.EMERGENCY_PLUMBER]: '🚨'
};

export const DEFAULT_CURRENCY = 'USD';
export const PLATFORM_FEE_PERCENTAGE = 0.15;
