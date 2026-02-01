'use client';

import { useState, useCallback, useRef } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import type { MapRef, ViewStateChangeInfo } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ProProfile } from '@ozar/shared';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapSimpleProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  pros?: ProProfile[];
  onProClick?: (pro: ProProfile) => void;
  height?: string;
}

export default function MapSimple({
  center = [46.6753, 24.7136], // Riyadh default
  zoom = 12,
  pros = [],
  onProClick,
  height = '500px',
}: MapSimpleProps) {
  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
  });

  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((e: any) => {
    console.error('Map error:', e);
    setError('Failed to load map. Check your Mapbox token.');
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div 
        className="flex items-center justify-center bg-red-50 rounded-lg"
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">⚠️ Mapbox Token Missing</p>
          <p className="text-sm text-red-500">
            Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ height }}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center p-4">
            <p className="text-red-600 font-medium mb-2">⚠️ Map Error</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}
      
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeInfo) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onError={handleError}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Professional Markers */}
        {pros.map((pro) => (
          <Marker
            key={pro.id}
            longitude={pro.location.lng}
            latitude={pro.location.lat}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              onProClick?.(pro);
            }}
          >
            <div
              className="cursor-pointer transform hover:scale-110 transition-transform"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#00BCD4',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🔧
            </div>
          </Marker>
        ))}
      </Map>

      {/* Status Indicator */}
      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md text-sm z-10">
        ✅ Map Ready
      </div>
    </div>
  );
}
