"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityStatus = exports.VerificationStatus = exports.PricingModel = exports.ServiceCategory = exports.UserRole = exports.BookingStatus = void 0;
// Core Enums
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["DRAFT"] = "DRAFT";
    BookingStatus["REQUESTED"] = "REQUESTED";
    BookingStatus["OFFERED"] = "OFFERED";
    BookingStatus["ACCEPTED"] = "ACCEPTED";
    BookingStatus["PAYMENT_AUTHORIZED"] = "PAYMENT_AUTHORIZED";
    BookingStatus["SCHEDULED"] = "SCHEDULED";
    BookingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["CAPTURED"] = "CAPTURED";
    BookingStatus["CANCELLED_BY_CUSTOMER"] = "CANCELLED_BY_CUSTOMER";
    BookingStatus["CANCELLED_BY_PRO"] = "CANCELLED_BY_PRO";
    BookingStatus["NO_SHOW"] = "NO_SHOW";
    BookingStatus["DISPUTED"] = "DISPUTED";
    BookingStatus["REFUNDED"] = "REFUNDED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["PRO"] = "PRO";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ServiceCategory;
(function (ServiceCategory) {
    // 1. Home & Property Services - Repairs & Maintenance
    ServiceCategory["ELECTRICIAN"] = "ELECTRICIAN";
    ServiceCategory["PLUMBER"] = "PLUMBER";
    ServiceCategory["HANDYMAN"] = "HANDYMAN";
    ServiceCategory["HVAC_AC_REPAIR"] = "HVAC_AC_REPAIR";
    ServiceCategory["APPLIANCE_REPAIR"] = "APPLIANCE_REPAIR";
    ServiceCategory["GAS_TECHNICIAN"] = "GAS_TECHNICIAN";
    // 1. Home & Property Services - Renovation & Installation
    ServiceCategory["PAINTING"] = "PAINTING";
    ServiceCategory["FLOORING"] = "FLOORING";
    ServiceCategory["TILE_WORK"] = "TILE_WORK";
    ServiceCategory["KITCHEN_BATHROOM_REMODELING"] = "KITCHEN_BATHROOM_REMODELING";
    ServiceCategory["DOOR_WINDOW_INSTALLATION"] = "DOOR_WINDOW_INSTALLATION";
    // 1. Home & Property Services - Outdoor & Property Care
    ServiceCategory["GARDENING_LAWN_MOWING"] = "GARDENING_LAWN_MOWING";
    ServiceCategory["TREE_TRIMMING"] = "TREE_TRIMMING";
    ServiceCategory["FENCE_INSTALLATION"] = "FENCE_INSTALLATION";
    ServiceCategory["PRESSURE_WASHING"] = "PRESSURE_WASHING";
    ServiceCategory["SNOW_REMOVAL"] = "SNOW_REMOVAL";
    // 2. Cleaning Services
    ServiceCategory["HOME_CLEANING"] = "HOME_CLEANING";
    ServiceCategory["DEEP_CLEANING"] = "DEEP_CLEANING";
    ServiceCategory["OFFICE_CLEANING"] = "OFFICE_CLEANING";
    ServiceCategory["MOVE_IN_OUT_CLEANING"] = "MOVE_IN_OUT_CLEANING";
    ServiceCategory["CARPET_SOFA_CLEANING"] = "CARPET_SOFA_CLEANING";
    ServiceCategory["POST_CONSTRUCTION_CLEANING"] = "POST_CONSTRUCTION_CLEANING";
    // 3. Beauty, Grooming & Wellness - Hair & Grooming
    ServiceCategory["HAIRCUT"] = "HAIRCUT";
    ServiceCategory["HAIRSTYLIST"] = "HAIRSTYLIST";
    ServiceCategory["BARBER"] = "BARBER";
    ServiceCategory["BEARD_GROOMING"] = "BEARD_GROOMING";
    // 3. Beauty, Grooming & Wellness - Beauty Services
    ServiceCategory["MANICURE_PEDICURE"] = "MANICURE_PEDICURE";
    ServiceCategory["MAKEUP_ARTIST"] = "MAKEUP_ARTIST";
    ServiceCategory["NAIL_TECHNICIAN"] = "NAIL_TECHNICIAN";
    ServiceCategory["EYELASH_EYEBROW_SERVICES"] = "EYELASH_EYEBROW_SERVICES";
    // 3. Beauty, Grooming & Wellness - Wellness
    ServiceCategory["MASSAGE_THERAPY"] = "MASSAGE_THERAPY";
    ServiceCategory["PHYSIOTHERAPY"] = "PHYSIOTHERAPY";
    ServiceCategory["YOGA_INSTRUCTOR"] = "YOGA_INSTRUCTOR";
    ServiceCategory["PERSONAL_TRAINER"] = "PERSONAL_TRAINER";
    // 4. Tech & Smart Home
    ServiceCategory["TV_MOUNTING"] = "TV_MOUNTING";
    ServiceCategory["WIFI_SETUP"] = "WIFI_SETUP";
    ServiceCategory["SMART_HOME_INSTALLATION"] = "SMART_HOME_INSTALLATION";
    ServiceCategory["CCTV_INSTALLATION"] = "CCTV_INSTALLATION";
    ServiceCategory["COMPUTER_LAPTOP_REPAIR"] = "COMPUTER_LAPTOP_REPAIR";
    ServiceCategory["PRINTER_SETUP"] = "PRINTER_SETUP";
    // 5. Moving & Logistics
    ServiceCategory["HOUSE_SHIFTING"] = "HOUSE_SHIFTING";
    ServiceCategory["FURNITURE_MOVING"] = "FURNITURE_MOVING";
    ServiceCategory["SMALL_DELIVERIES"] = "SMALL_DELIVERIES";
    ServiceCategory["PACKING_UNPACKING"] = "PACKING_UNPACKING";
    ServiceCategory["JUNK_REMOVAL"] = "JUNK_REMOVAL";
    // 6. Daily Help & Personal Assistance
    ServiceCategory["COOKING_HOME_CHEF"] = "COOKING_HOME_CHEF";
    ServiceCategory["MEAL_PREP"] = "MEAL_PREP";
    ServiceCategory["BABYSITTING"] = "BABYSITTING";
    ServiceCategory["ELDERLY_CARE"] = "ELDERLY_CARE";
    ServiceCategory["HOME_HELPER"] = "HOME_HELPER";
    // 7. Pet Services
    ServiceCategory["DOG_WALKING"] = "DOG_WALKING";
    ServiceCategory["PET_SITTING"] = "PET_SITTING";
    ServiceCategory["PET_GROOMING"] = "PET_GROOMING";
    ServiceCategory["VET_VISIT_ASSISTANCE"] = "VET_VISIT_ASSISTANCE";
    // 8. Events & Occasions
    ServiceCategory["PARTY_DECORATORS"] = "PARTY_DECORATORS";
    ServiceCategory["CATERERS"] = "CATERERS";
    ServiceCategory["DJS"] = "DJS";
    ServiceCategory["PHOTOGRAPHERS"] = "PHOTOGRAPHERS";
    ServiceCategory["VIDEOGRAPHERS"] = "VIDEOGRAPHERS";
    // 9. Learning & Education
    ServiceCategory["HOME_TUTORS"] = "HOME_TUTORS";
    ServiceCategory["MUSIC_TEACHERS"] = "MUSIC_TEACHERS";
    ServiceCategory["LANGUAGE_TUTORS"] = "LANGUAGE_TUTORS";
    ServiceCategory["FITNESS_TRAINERS"] = "FITNESS_TRAINERS";
    // 10. Quick Tasks (On-Demand)
    ServiceCategory["FURNITURE_ASSEMBLY"] = "FURNITURE_ASSEMBLY";
    ServiceCategory["MOUNTING_DRILLING"] = "MOUNTING_DRILLING";
    ServiceCategory["SMALL_FIXES"] = "SMALL_FIXES";
    ServiceCategory["EMERGENCY_ELECTRICIAN"] = "EMERGENCY_ELECTRICIAN";
    ServiceCategory["EMERGENCY_PLUMBER"] = "EMERGENCY_PLUMBER";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
var PricingModel;
(function (PricingModel) {
    PricingModel["HOURLY"] = "HOURLY";
    PricingModel["FIXED"] = "FIXED";
    PricingModel["INSPECTION"] = "INSPECTION";
})(PricingModel || (exports.PricingModel = PricingModel = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "PENDING";
    VerificationStatus["APPROVED"] = "APPROVED";
    VerificationStatus["REJECTED"] = "REJECTED";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["AVAILABLE_NOW"] = "AVAILABLE_NOW";
    AvailabilityStatus["AVAILABLE_SOON"] = "AVAILABLE_SOON";
    AvailabilityStatus["BUSY"] = "BUSY";
    AvailabilityStatus["OFFLINE"] = "OFFLINE";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
//# sourceMappingURL=types.js.map