"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_FEE_PERCENTAGE = exports.DEFAULT_CURRENCY = exports.CATEGORY_ICONS = exports.CATEGORY_LABELS = void 0;
const types_1 = require("./types");
exports.CATEGORY_LABELS = {
    // Home & Property Services - Repairs & Maintenance
    [types_1.ServiceCategory.ELECTRICIAN]: 'Electrician',
    [types_1.ServiceCategory.PLUMBER]: 'Plumber',
    [types_1.ServiceCategory.HANDYMAN]: 'Handyman',
    [types_1.ServiceCategory.HVAC_AC_REPAIR]: 'HVAC / AC Repair',
    [types_1.ServiceCategory.APPLIANCE_REPAIR]: 'Appliance Repair',
    [types_1.ServiceCategory.GAS_TECHNICIAN]: 'Gas Technician',
    // Renovation & Installation
    [types_1.ServiceCategory.PAINTING]: 'Painting',
    [types_1.ServiceCategory.FLOORING]: 'Flooring',
    [types_1.ServiceCategory.TILE_WORK]: 'Tile Work',
    [types_1.ServiceCategory.KITCHEN_BATHROOM_REMODELING]: 'Kitchen & Bathroom Remodeling',
    [types_1.ServiceCategory.DOOR_WINDOW_INSTALLATION]: 'Door & Window Installation',
    // Outdoor & Property Care
    [types_1.ServiceCategory.GARDENING_LAWN_MOWING]: 'Gardening & Lawn Mowing',
    [types_1.ServiceCategory.TREE_TRIMMING]: 'Tree Trimming',
    [types_1.ServiceCategory.FENCE_INSTALLATION]: 'Fence Installation',
    [types_1.ServiceCategory.PRESSURE_WASHING]: 'Pressure Washing',
    [types_1.ServiceCategory.SNOW_REMOVAL]: 'Snow Removal',
    // Cleaning Services
    [types_1.ServiceCategory.HOME_CLEANING]: 'Home Cleaning',
    [types_1.ServiceCategory.DEEP_CLEANING]: 'Deep Cleaning',
    [types_1.ServiceCategory.OFFICE_CLEANING]: 'Office Cleaning',
    [types_1.ServiceCategory.MOVE_IN_OUT_CLEANING]: 'Move-in / Move-out Cleaning',
    [types_1.ServiceCategory.CARPET_SOFA_CLEANING]: 'Carpet & Sofa Cleaning',
    [types_1.ServiceCategory.POST_CONSTRUCTION_CLEANING]: 'Post-construction Cleaning',
    // Beauty, Grooming & Wellness - Hair & Grooming
    [types_1.ServiceCategory.HAIRCUT]: 'Haircut',
    [types_1.ServiceCategory.HAIRSTYLIST]: 'Hairstylist',
    [types_1.ServiceCategory.BARBER]: 'Barber',
    [types_1.ServiceCategory.BEARD_GROOMING]: 'Beard Grooming',
    // Beauty Services
    [types_1.ServiceCategory.MANICURE_PEDICURE]: 'Manicure / Pedicure',
    [types_1.ServiceCategory.MAKEUP_ARTIST]: 'Makeup Artist',
    [types_1.ServiceCategory.NAIL_TECHNICIAN]: 'Nail Technician',
    [types_1.ServiceCategory.EYELASH_EYEBROW_SERVICES]: 'Eyelash / Eyebrow Services',
    // Wellness
    [types_1.ServiceCategory.MASSAGE_THERAPY]: 'Massage Therapy',
    [types_1.ServiceCategory.PHYSIOTHERAPY]: 'Physiotherapy',
    [types_1.ServiceCategory.YOGA_INSTRUCTOR]: 'Yoga Instructor',
    [types_1.ServiceCategory.PERSONAL_TRAINER]: 'Personal Trainer',
    // Tech & Smart Home
    [types_1.ServiceCategory.TV_MOUNTING]: 'TV Mounting',
    [types_1.ServiceCategory.WIFI_SETUP]: 'Wi-Fi Setup',
    [types_1.ServiceCategory.SMART_HOME_INSTALLATION]: 'Smart Home Installation',
    [types_1.ServiceCategory.CCTV_INSTALLATION]: 'CCTV Installation',
    [types_1.ServiceCategory.COMPUTER_LAPTOP_REPAIR]: 'Computer & Laptop Repair',
    [types_1.ServiceCategory.PRINTER_SETUP]: 'Printer Setup',
    // Moving & Logistics
    [types_1.ServiceCategory.HOUSE_SHIFTING]: 'House Shifting',
    [types_1.ServiceCategory.FURNITURE_MOVING]: 'Furniture Moving',
    [types_1.ServiceCategory.SMALL_DELIVERIES]: 'Small Deliveries',
    [types_1.ServiceCategory.PACKING_UNPACKING]: 'Packing & Unpacking',
    [types_1.ServiceCategory.JUNK_REMOVAL]: 'Junk Removal',
    // Daily Help & Personal Assistance
    [types_1.ServiceCategory.COOKING_HOME_CHEF]: 'Cooking / Home Chef',
    [types_1.ServiceCategory.MEAL_PREP]: 'Meal Prep',
    [types_1.ServiceCategory.BABYSITTING]: 'Babysitting',
    [types_1.ServiceCategory.ELDERLY_CARE]: 'Elderly Care',
    [types_1.ServiceCategory.HOME_HELPER]: 'Home Helper',
    // Pet Services
    [types_1.ServiceCategory.DOG_WALKING]: 'Dog Walking',
    [types_1.ServiceCategory.PET_SITTING]: 'Pet Sitting',
    [types_1.ServiceCategory.PET_GROOMING]: 'Pet Grooming',
    [types_1.ServiceCategory.VET_VISIT_ASSISTANCE]: 'Vet Visit Assistance',
    // Events & Occasions
    [types_1.ServiceCategory.PARTY_DECORATORS]: 'Party Decorators',
    [types_1.ServiceCategory.CATERERS]: 'Caterers',
    [types_1.ServiceCategory.DJS]: 'DJs',
    [types_1.ServiceCategory.PHOTOGRAPHERS]: 'Photographers',
    [types_1.ServiceCategory.VIDEOGRAPHERS]: 'Videographers',
    // Learning & Education
    [types_1.ServiceCategory.HOME_TUTORS]: 'Home Tutors',
    [types_1.ServiceCategory.MUSIC_TEACHERS]: 'Music Teachers',
    [types_1.ServiceCategory.LANGUAGE_TUTORS]: 'Language Tutors',
    [types_1.ServiceCategory.FITNESS_TRAINERS]: 'Fitness Trainers',
    // Quick Tasks (On-Demand)
    [types_1.ServiceCategory.FURNITURE_ASSEMBLY]: 'Furniture Assembly',
    [types_1.ServiceCategory.MOUNTING_DRILLING]: 'Mounting / Drilling',
    [types_1.ServiceCategory.SMALL_FIXES]: 'Small Fixes',
    [types_1.ServiceCategory.EMERGENCY_ELECTRICIAN]: 'Emergency Electrician',
    [types_1.ServiceCategory.EMERGENCY_PLUMBER]: 'Emergency Plumber'
};
exports.CATEGORY_ICONS = {
    // Home & Property Services - Repairs & Maintenance
    [types_1.ServiceCategory.ELECTRICIAN]: '⚡',
    [types_1.ServiceCategory.PLUMBER]: '🔧',
    [types_1.ServiceCategory.HANDYMAN]: '🛠️',
    [types_1.ServiceCategory.HVAC_AC_REPAIR]: '❄️',
    [types_1.ServiceCategory.APPLIANCE_REPAIR]: '🔌',
    [types_1.ServiceCategory.GAS_TECHNICIAN]: '🔥',
    // Renovation & Installation
    [types_1.ServiceCategory.PAINTING]: '🎨',
    [types_1.ServiceCategory.FLOORING]: '🪵',
    [types_1.ServiceCategory.TILE_WORK]: '🧱',
    [types_1.ServiceCategory.KITCHEN_BATHROOM_REMODELING]: '🏗️',
    [types_1.ServiceCategory.DOOR_WINDOW_INSTALLATION]: '🚪',
    // Outdoor & Property Care
    [types_1.ServiceCategory.GARDENING_LAWN_MOWING]: '🌿',
    [types_1.ServiceCategory.TREE_TRIMMING]: '🌳',
    [types_1.ServiceCategory.FENCE_INSTALLATION]: '🪵',
    [types_1.ServiceCategory.PRESSURE_WASHING]: '💦',
    [types_1.ServiceCategory.SNOW_REMOVAL]: '❄️',
    // Cleaning Services
    [types_1.ServiceCategory.HOME_CLEANING]: '🧹',
    [types_1.ServiceCategory.DEEP_CLEANING]: '✨',
    [types_1.ServiceCategory.OFFICE_CLEANING]: '🏢',
    [types_1.ServiceCategory.MOVE_IN_OUT_CLEANING]: '📦',
    [types_1.ServiceCategory.CARPET_SOFA_CLEANING]: '🛋️',
    [types_1.ServiceCategory.POST_CONSTRUCTION_CLEANING]: '🏗️',
    // Beauty, Grooming & Wellness - Hair & Grooming
    [types_1.ServiceCategory.HAIRCUT]: '✂️',
    [types_1.ServiceCategory.HAIRSTYLIST]: '💇',
    [types_1.ServiceCategory.BARBER]: '💈',
    [types_1.ServiceCategory.BEARD_GROOMING]: '🧔',
    // Beauty Services
    [types_1.ServiceCategory.MANICURE_PEDICURE]: '💅',
    [types_1.ServiceCategory.MAKEUP_ARTIST]: '💄',
    [types_1.ServiceCategory.NAIL_TECHNICIAN]: '💅',
    [types_1.ServiceCategory.EYELASH_EYEBROW_SERVICES]: '👁️',
    // Wellness
    [types_1.ServiceCategory.MASSAGE_THERAPY]: '💆',
    [types_1.ServiceCategory.PHYSIOTHERAPY]: '🏥',
    [types_1.ServiceCategory.YOGA_INSTRUCTOR]: '🧘',
    [types_1.ServiceCategory.PERSONAL_TRAINER]: '💪',
    // Tech & Smart Home
    [types_1.ServiceCategory.TV_MOUNTING]: '📺',
    [types_1.ServiceCategory.WIFI_SETUP]: '📡',
    [types_1.ServiceCategory.SMART_HOME_INSTALLATION]: '🏠',
    [types_1.ServiceCategory.CCTV_INSTALLATION]: '📹',
    [types_1.ServiceCategory.COMPUTER_LAPTOP_REPAIR]: '💻',
    [types_1.ServiceCategory.PRINTER_SETUP]: '🖨️',
    // Moving & Logistics
    [types_1.ServiceCategory.HOUSE_SHIFTING]: '🚚',
    [types_1.ServiceCategory.FURNITURE_MOVING]: '📦',
    [types_1.ServiceCategory.SMALL_DELIVERIES]: '🚴',
    [types_1.ServiceCategory.PACKING_UNPACKING]: '📦',
    [types_1.ServiceCategory.JUNK_REMOVAL]: '🗑️',
    // Daily Help & Personal Assistance
    [types_1.ServiceCategory.COOKING_HOME_CHEF]: '👨‍🍳',
    [types_1.ServiceCategory.MEAL_PREP]: '🍱',
    [types_1.ServiceCategory.BABYSITTING]: '👶',
    [types_1.ServiceCategory.ELDERLY_CARE]: '👴',
    [types_1.ServiceCategory.HOME_HELPER]: '🏠',
    // Pet Services
    [types_1.ServiceCategory.DOG_WALKING]: '🐶',
    [types_1.ServiceCategory.PET_SITTING]: '🐾',
    [types_1.ServiceCategory.PET_GROOMING]: '✂️',
    [types_1.ServiceCategory.VET_VISIT_ASSISTANCE]: '🏥',
    // Events & Occasions
    [types_1.ServiceCategory.PARTY_DECORATORS]: '🎉',
    [types_1.ServiceCategory.CATERERS]: '🍽️',
    [types_1.ServiceCategory.DJS]: '🎧',
    [types_1.ServiceCategory.PHOTOGRAPHERS]: '📷',
    [types_1.ServiceCategory.VIDEOGRAPHERS]: '🎥',
    // Learning & Education
    [types_1.ServiceCategory.HOME_TUTORS]: '📚',
    [types_1.ServiceCategory.MUSIC_TEACHERS]: '🎵',
    [types_1.ServiceCategory.LANGUAGE_TUTORS]: '🗣️',
    [types_1.ServiceCategory.FITNESS_TRAINERS]: '🏋️',
    // Quick Tasks (On-Demand)
    [types_1.ServiceCategory.FURNITURE_ASSEMBLY]: '🔨',
    [types_1.ServiceCategory.MOUNTING_DRILLING]: '🔩',
    [types_1.ServiceCategory.SMALL_FIXES]: '🔧',
    [types_1.ServiceCategory.EMERGENCY_ELECTRICIAN]: '⚡',
    [types_1.ServiceCategory.EMERGENCY_PLUMBER]: '🚨'
};
exports.DEFAULT_CURRENCY = 'USD';
exports.PLATFORM_FEE_PERCENTAGE = 0.15;
//# sourceMappingURL=constants.js.map