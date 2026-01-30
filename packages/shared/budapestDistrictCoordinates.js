"use strict";
// Budapest District Center Coordinates
// These are the approximate center points of each district for accurate map placement
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUDAPEST_CENTER = exports.BUDAPEST_DISTRICT_COORDINATES = void 0;
exports.getDistrictCoordinates = getDistrictCoordinates;
exports.findNearestDistrict = findNearestDistrict;
exports.isWithinBudapest = isWithinBudapest;
exports.getDistrictsWithinRadius = getDistrictsWithinRadius;
exports.BUDAPEST_DISTRICT_COORDINATES = {
    'I': { lat: 47.4979, lng: 19.0402, name: 'Várnegyed' },
    'II': { lat: 47.5167, lng: 19.0247, name: 'Rózsadomb' },
    'III': { lat: 47.5429, lng: 19.0521, name: 'Óbuda-Békásmegyer' },
    'IV': { lat: 47.5615, lng: 19.0885, name: 'Újpest' },
    'V': { lat: 47.4969, lng: 19.0531, name: 'Belváros-Lipótváros' },
    'VI': { lat: 47.5069, lng: 19.0625, name: 'Terézváros' },
    'VII': { lat: 47.4969, lng: 19.0708, name: 'Erzsébetváros' },
    'VIII': { lat: 47.4869, lng: 19.0708, name: 'Józsefváros' },
    'IX': { lat: 47.4769, lng: 19.0625, name: 'Ferencváros' },
    'X': { lat: 47.4769, lng: 19.1458, name: 'Kőbánya' },
    'XI': { lat: 47.4669, lng: 19.0458, name: 'Újbuda' },
    'XII': { lat: 47.5069, lng: 18.9958, name: 'Hegyvidék' },
    'XIII': { lat: 47.5169, lng: 19.0625, name: 'Újlipótváros' },
    'XIV': { lat: 47.5169, lng: 19.1042, name: 'Zugló' },
    'XV': { lat: 47.5569, lng: 19.1208, name: 'Rákospalota' },
    'XVI': { lat: 47.5169, lng: 19.1625, name: 'Mátyásföld' },
    'XVII': { lat: 47.4769, lng: 19.2542, name: 'Rákosmente' },
    'XVIII': { lat: 47.4369, lng: 19.1792, name: 'Pestszentlőrinc' },
    'XIX': { lat: 47.4369, lng: 19.1458, name: 'Kispest' },
    'XX': { lat: 47.4369, lng: 19.1042, name: 'Pesterzsébet' },
    'XXI': { lat: 47.4269, lng: 19.0708, name: 'Csepel' },
    'XXII': { lat: 47.4169, lng: 18.9625, name: 'Budafok-Tétény' },
    'XXIII': { lat: 47.4069, lng: 19.1458, name: 'Soroksár' },
};
// Get coordinates for a district
function getDistrictCoordinates(district) {
    const coords = exports.BUDAPEST_DISTRICT_COORDINATES[district];
    return coords ? { lat: coords.lat, lng: coords.lng } : null;
}
// Find nearest district from coordinates
function findNearestDistrict(lat, lng) {
    let nearestDistrict = null;
    let minDistance = Infinity;
    Object.entries(exports.BUDAPEST_DISTRICT_COORDINATES).forEach(([district, coords]) => {
        const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestDistrict = district;
        }
    });
    return nearestDistrict;
}
// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}
// Check if coordinates are within Budapest bounds
function isWithinBudapest(lat, lng) {
    // Budapest approximate bounds
    const bounds = {
        north: 47.65,
        south: 47.35,
        east: 19.35,
        west: 18.90,
    };
    return (lat >= bounds.south &&
        lat <= bounds.north &&
        lng >= bounds.west &&
        lng <= bounds.east);
}
// Get all districts within a radius from a point
function getDistrictsWithinRadius(lat, lng, radiusKm) {
    const districts = [];
    Object.entries(exports.BUDAPEST_DISTRICT_COORDINATES).forEach(([district, coords]) => {
        const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
        if (distance <= radiusKm) {
            districts.push(district);
        }
    });
    return districts;
}
// Budapest city center (Deák Ferenc tér)
exports.BUDAPEST_CENTER = {
    lat: 47.4979,
    lng: 19.0402,
};
//# sourceMappingURL=budapestDistrictCoordinates.js.map