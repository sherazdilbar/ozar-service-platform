'use client';

interface LocationSelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CITIES = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];

export default function LocationSelector({ selectedCity, onCityChange }: LocationSelectorProps) {
  return (
    <div className="relative">
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all">
        <span className="text-xl">📍</span>
        <div className="text-left">
          <div className="text-xs text-gray-500">Location</div>
          <div className="font-medium text-sm">{selectedCity}</div>
        </div>
        <span className="text-gray-400 text-sm">▼</span>
      </button>
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        {CITIES.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
}
