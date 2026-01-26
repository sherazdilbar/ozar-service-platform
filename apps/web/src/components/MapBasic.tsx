'use client';

import { useEffect, useRef } from 'react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapBasicProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  height?: string;
}

export default function MapBasic({
  center = [46.6753, 24.7136], // Riyadh default
  zoom = 12,
  height = '500px',
}: MapBasicProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Dynamically import mapbox-gl to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      if (!MAPBOX_TOKEN) {
        console.error('Mapbox token not found!');
        return;
      }

      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      console.log('🗺️ Initializing Mapbox...');
      console.log('Token:', MAPBOX_TOKEN.substring(0, 20) + '...');
      console.log('Center:', center);
      console.log('Zoom:', zoom);

      try {
        const map = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: center,
          zoom: zoom,
        });

        map.on('load', () => {
          console.log('✅ Map loaded successfully!');
        });

        map.on('error', (e) => {
          console.error('❌ Map error:', e);
        });

        // Add navigation control
        map.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

        mapRef.current = map;
      } catch (error) {
        console.error('❌ Failed to create map:', error);
      }
    }).catch((error) => {
      console.error('❌ Failed to load mapbox-gl:', error);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  if (!MAPBOX_TOKEN) {
    return (
      <div 
        className="flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200"
        style={{ height }}
      >
        <div className="text-center p-6">
          <p className="text-red-600 font-bold text-lg mb-2">⚠️ Mapbox Token Missing</p>
          <p className="text-sm text-red-500 mb-4">
            NEXT_PUBLIC_MAPBOX_TOKEN is not set in .env.local
          </p>
          <code className="text-xs bg-red-100 px-2 py-1 rounded">
            apps/web/.env.local
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={{ backgroundColor: '#e5e7eb' }}
      />
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm z-10 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">Mapbox Loading...</span>
        </div>
      </div>
    </div>
  );
}
