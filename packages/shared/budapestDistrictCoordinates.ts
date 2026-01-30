// Budapest District Center Coordinates
// These are the approximate center points of each district for accurate map placement

export const BUDAPEST_DISTRICT_COORDINATES = {
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
} as const;

// Get coordinates for a district
export function getDistrictCoordinates(district: string): { lat: number; lng: number } | null {
  const coords = BUDAPEST_DISTRICT_COORDINATES[district as keyof typeof BUDAPEST_DISTRICT_COORDINATES];
  return coords ? { lat: coords.lat, lng: coords.lng } : null;
}

// Find nearest district from coordinates
export function findNearestDistrict(lat: number, lng: number): string | null {
  let nearestDistrict: string | null = null;
  let minDistance = Infinity;

  Object.entries(BUDAPEST_DISTRICT_COORDINATES).forEach(([district, coords]) => {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestDistrict = district;
    }
  });

  return nearestDistrict;
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Check if coordinates are within Budapest bounds
export function isWithinBudapest(lat: number, lng: number): boolean {
  // Budapest approximate bounds
  const bounds = {
    north: 47.65,
    south: 47.35,
    east: 19.35,
    west: 18.90,
  };

  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}

// Get all districts within a radius from a point
export function getDistrictsWithinRadius(lat: number, lng: number, radiusKm: number): string[] {
  const districts: string[] = [];

  Object.entries(BUDAPEST_DISTRICT_COORDINATES).forEach(([district, coords]) => {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
    if (distance <= radiusKm) {
      districts.push(district);
    }
  });

  return districts;
}

// Budapest city center (Deák Ferenc tér)
export const BUDAPEST_CENTER = {
  lat: 47.4979,
  lng: 19.0402,
};
