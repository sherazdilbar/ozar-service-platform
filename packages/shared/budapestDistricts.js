"use strict";
// Budapest Districts (Kerületek) - All 23 districts with Hungarian and English names
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISTRICT_ZONES = exports.BUDAPEST_DISTRICTS = void 0;
exports.getDistrictDisplayName = getDistrictDisplayName;
exports.getDistrictsInZone = getDistrictsInZone;
exports.isBudapest = isBudapest;
exports.getZoneForDistrict = getZoneForDistrict;
exports.BUDAPEST_DISTRICTS = {
    'I': { name: 'Várnegyed', nameEn: 'Castle District', zone: 'central' },
    'II': { name: 'Rózsadomb', nameEn: 'Rose Hill', zone: 'buda-hills' },
    'III': { name: 'Óbuda-Békásmegyer', nameEn: 'Old Buda', zone: 'north-buda' },
    'IV': { name: 'Újpest', nameEn: 'New Pest', zone: 'north-pest' },
    'V': { name: 'Belváros-Lipótváros', nameEn: 'Inner City', zone: 'central' },
    'VI': { name: 'Terézváros', nameEn: 'Theresa Town', zone: 'central' },
    'VII': { name: 'Erzsébetváros', nameEn: 'Elizabeth Town', zone: 'central' },
    'VIII': { name: 'Józsefváros', nameEn: 'Joseph Town', zone: 'mid-pest' },
    'IX': { name: 'Ferencváros', nameEn: 'Francis Town', zone: 'mid-pest' },
    'X': { name: 'Kőbánya', nameEn: 'Stone Quarry', zone: 'outer-pest' },
    'XI': { name: 'Újbuda', nameEn: 'New Buda', zone: 'south-buda' },
    'XII': { name: 'Hegyvidék', nameEn: 'Mountain District', zone: 'buda-hills' },
    'XIII': { name: 'Újlipótváros', nameEn: 'New Leopold Town', zone: 'central' },
    'XIV': { name: 'Zugló', nameEn: 'Zugló', zone: 'outer-pest' },
    'XV': { name: 'Rákospalota', nameEn: 'Rákospalota', zone: 'outer-pest' },
    'XVI': { name: 'Mátyásföld', nameEn: 'Mátyásföld', zone: 'outer-pest' },
    'XVII': { name: 'Rákosmente', nameEn: 'Rákosmente', zone: 'outer-pest' },
    'XVIII': { name: 'Pestszentlőrinc', nameEn: 'Pestszentlőrinc', zone: 'outer-pest' },
    'XIX': { name: 'Kispest', nameEn: 'Kispest', zone: 'outer-pest' },
    'XX': { name: 'Pesterzsébet', nameEn: 'Pesterzsébet', zone: 'outer-pest' },
    'XXI': { name: 'Csepel', nameEn: 'Csepel', zone: 'south-pest' },
    'XXII': { name: 'Budafok-Tétény', nameEn: 'Budafok', zone: 'south-buda' },
    'XXIII': { name: 'Soroksár', nameEn: 'Soroksár', zone: 'south-pest' },
};
exports.DISTRICT_ZONES = {
    'central': {
        name: 'Central Budapest',
        nameHu: 'Központi Budapest',
        districts: ['I', 'V', 'VI', 'VII', 'XIII'],
        description: 'City center, business district, premium areas',
    },
    'buda-hills': {
        name: 'Buda Hills',
        nameHu: 'Budai hegyek',
        districts: ['II', 'XII'],
        description: 'Hills, wealthy residential areas, green spaces',
    },
    'north-buda': {
        name: 'North Buda',
        nameHu: 'Észak-Buda',
        districts: ['III'],
        description: 'Old Buda, residential areas',
    },
    'north-pest': {
        name: 'North Pest',
        nameHu: 'Észak-Pest',
        districts: ['IV'],
        description: 'Northern Pest side',
    },
    'mid-pest': {
        name: 'Mid Pest',
        nameHu: 'Közép-Pest',
        districts: ['VIII', 'IX'],
        description: 'Central Pest, mixed residential and commercial',
    },
    'south-buda': {
        name: 'South Buda',
        nameHu: 'Dél-Buda',
        districts: ['XI', 'XXII'],
        description: 'Southern Buda side, growing areas',
    },
    'south-pest': {
        name: 'South Pest',
        nameHu: 'Dél-Pest',
        districts: ['XXI', 'XXIII'],
        description: 'Southern Pest side, suburban',
    },
    'outer-pest': {
        name: 'Outer Pest',
        nameHu: 'Külső-Pest',
        districts: ['X', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'],
        description: 'Outer districts, more affordable, suburban feel',
    },
};
// Helper function to get district display name
function getDistrictDisplayName(district, language = 'en') {
    const districtData = exports.BUDAPEST_DISTRICTS[district];
    return language === 'hu'
        ? `${district}. kerület - ${districtData.name}`
        : `District ${district} - ${districtData.nameEn}`;
}
// Helper function to get all districts in a zone
function getDistrictsInZone(zone) {
    return [...exports.DISTRICT_ZONES[zone].districts];
}
// Helper function to check if a city is Budapest
function isBudapest(city) {
    return city.toLowerCase() === 'budapest';
}
// Get zone for a district
function getZoneForDistrict(district) {
    return exports.BUDAPEST_DISTRICTS[district].zone;
}
//# sourceMappingURL=budapestDistricts.js.map