'use client';

import { ProProfile } from '@ozar/shared';
import ProCard from './ProCard';

interface MapPlaceholderProps {
  pros: ProProfile[];
  distances: Map<string, number>;
}

export default function MapPlaceholder({ pros, distances }: MapPlaceholderProps) {
  return (
    <div className="relative h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-gray-500 font-medium">Map View</p>
          <p className="text-sm text-gray-400">Showing {pros.length} professionals</p>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-4 max-h-[300px] overflow-y-auto">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="space-y-3">
          {pros.slice(0, 3).map(pro => (
            <ProCard 
              key={pro.id} 
              pro={pro} 
              distance={distances.get(pro.id) || 0} 
            />
          ))}
        </div>
        {pros.length > 3 && (
          <p className="text-center text-sm text-gray-500 mt-3">
            +{pros.length - 3} more professionals
          </p>
        )}
      </div>
    </div>
  );
}
