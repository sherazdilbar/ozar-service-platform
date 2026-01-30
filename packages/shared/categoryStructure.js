"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_GROUPS = void 0;
exports.getCategoryGroup = getCategoryGroup;
exports.getAllCategories = getAllCategories;
const types_1 = require("./types");
exports.CATEGORY_GROUPS = [
    {
        id: 'home_repairs',
        label: 'Home & Property Services',
        icon: '🏠',
        description: 'Repairs, maintenance, and property care',
        subcategories: [
            types_1.ServiceCategory.ELECTRICIAN,
            types_1.ServiceCategory.PLUMBER,
            types_1.ServiceCategory.HANDYMAN,
            types_1.ServiceCategory.HVAC_AC_REPAIR,
            types_1.ServiceCategory.APPLIANCE_REPAIR,
            types_1.ServiceCategory.GAS_TECHNICIAN,
            types_1.ServiceCategory.PAINTING,
            types_1.ServiceCategory.FLOORING,
            types_1.ServiceCategory.TILE_WORK,
            types_1.ServiceCategory.KITCHEN_BATHROOM_REMODELING,
            types_1.ServiceCategory.DOOR_WINDOW_INSTALLATION,
            types_1.ServiceCategory.GARDENING_LAWN_MOWING,
            types_1.ServiceCategory.TREE_TRIMMING,
            types_1.ServiceCategory.FENCE_INSTALLATION,
            types_1.ServiceCategory.PRESSURE_WASHING,
            types_1.ServiceCategory.SNOW_REMOVAL,
        ],
    },
    {
        id: 'cleaning',
        label: 'Cleaning Services',
        icon: '🧹',
        description: 'Professional cleaning for homes and offices',
        subcategories: [
            types_1.ServiceCategory.HOME_CLEANING,
            types_1.ServiceCategory.DEEP_CLEANING,
            types_1.ServiceCategory.OFFICE_CLEANING,
            types_1.ServiceCategory.MOVE_IN_OUT_CLEANING,
            types_1.ServiceCategory.CARPET_SOFA_CLEANING,
            types_1.ServiceCategory.POST_CONSTRUCTION_CLEANING,
        ],
    },
    {
        id: 'beauty_wellness',
        label: 'Beauty, Grooming & Wellness',
        icon: '💇',
        description: 'Personal care and wellness services',
        subcategories: [
            types_1.ServiceCategory.HAIRCUT,
            types_1.ServiceCategory.HAIRSTYLIST,
            types_1.ServiceCategory.BARBER,
            types_1.ServiceCategory.BEARD_GROOMING,
            types_1.ServiceCategory.MANICURE_PEDICURE,
            types_1.ServiceCategory.MAKEUP_ARTIST,
            types_1.ServiceCategory.NAIL_TECHNICIAN,
            types_1.ServiceCategory.EYELASH_EYEBROW_SERVICES,
            types_1.ServiceCategory.MASSAGE_THERAPY,
            types_1.ServiceCategory.PHYSIOTHERAPY,
            types_1.ServiceCategory.YOGA_INSTRUCTOR,
            types_1.ServiceCategory.PERSONAL_TRAINER,
        ],
    },
    {
        id: 'tech_smart_home',
        label: 'Tech & Smart Home',
        icon: '💻',
        description: 'Technology and smart home solutions',
        subcategories: [
            types_1.ServiceCategory.TV_MOUNTING,
            types_1.ServiceCategory.WIFI_SETUP,
            types_1.ServiceCategory.SMART_HOME_INSTALLATION,
            types_1.ServiceCategory.CCTV_INSTALLATION,
            types_1.ServiceCategory.COMPUTER_LAPTOP_REPAIR,
            types_1.ServiceCategory.PRINTER_SETUP,
        ],
    },
    {
        id: 'moving_logistics',
        label: 'Moving & Logistics',
        icon: '🚚',
        description: 'Moving, delivery, and logistics services',
        subcategories: [
            types_1.ServiceCategory.HOUSE_SHIFTING,
            types_1.ServiceCategory.FURNITURE_MOVING,
            types_1.ServiceCategory.SMALL_DELIVERIES,
            types_1.ServiceCategory.PACKING_UNPACKING,
            types_1.ServiceCategory.JUNK_REMOVAL,
        ],
    },
    {
        id: 'daily_help',
        label: 'Daily Help & Personal Assistance',
        icon: '👨‍🍳',
        description: 'Home help and personal care services',
        subcategories: [
            types_1.ServiceCategory.COOKING_HOME_CHEF,
            types_1.ServiceCategory.MEAL_PREP,
            types_1.ServiceCategory.BABYSITTING,
            types_1.ServiceCategory.ELDERLY_CARE,
            types_1.ServiceCategory.HOME_HELPER,
        ],
    },
    {
        id: 'pet_services',
        label: 'Pet Services',
        icon: '🐶',
        description: 'Care and services for your pets',
        subcategories: [
            types_1.ServiceCategory.DOG_WALKING,
            types_1.ServiceCategory.PET_SITTING,
            types_1.ServiceCategory.PET_GROOMING,
            types_1.ServiceCategory.VET_VISIT_ASSISTANCE,
        ],
    },
    {
        id: 'events',
        label: 'Events & Occasions',
        icon: '🎉',
        description: 'Make your events memorable',
        subcategories: [
            types_1.ServiceCategory.PARTY_DECORATORS,
            types_1.ServiceCategory.CATERERS,
            types_1.ServiceCategory.DJS,
            types_1.ServiceCategory.PHOTOGRAPHERS,
            types_1.ServiceCategory.VIDEOGRAPHERS,
        ],
    },
    {
        id: 'learning',
        label: 'Learning & Education',
        icon: '📚',
        description: 'Tutoring and skill development',
        subcategories: [
            types_1.ServiceCategory.HOME_TUTORS,
            types_1.ServiceCategory.MUSIC_TEACHERS,
            types_1.ServiceCategory.LANGUAGE_TUTORS,
            types_1.ServiceCategory.FITNESS_TRAINERS,
        ],
    },
    {
        id: 'quick_tasks',
        label: 'Quick Tasks',
        icon: '⚡',
        description: 'On-demand help for urgent needs',
        subcategories: [
            types_1.ServiceCategory.FURNITURE_ASSEMBLY,
            types_1.ServiceCategory.MOUNTING_DRILLING,
            types_1.ServiceCategory.SMALL_FIXES,
            types_1.ServiceCategory.EMERGENCY_ELECTRICIAN,
            types_1.ServiceCategory.EMERGENCY_PLUMBER,
        ],
    },
];
// Helper function to get group for a category
function getCategoryGroup(category) {
    return exports.CATEGORY_GROUPS.find(group => group.subcategories.includes(category));
}
// Helper to get all categories flattened
function getAllCategories() {
    return exports.CATEGORY_GROUPS.flatMap(group => group.subcategories);
}
//# sourceMappingURL=categoryStructure.js.map