'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ProProfile } from '@ozar/shared';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  pros?: ProProfile[];
  onProClick?: (pro: ProProfile) => void;
  onMapClick?: (lngLat: [number, number]) => void;
  selectedLocation?: [number, number];
  showUserLocation?: boolean;
  height?: string;
}

export default function Map({
  center,
  zoom,
  pros,
  onProClick,
  onMapClick,
  selectedLocation,
  showUserLocation = false,
  height = '400px',
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set defaults
  const mapCenter = center || [46.6753, 24.7136]; // Riyadh default
  const mapZoom = zoom || 12;
  const mapPros = pros || [];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      console.log('Initializing map with token:', MAPBOX_TOKEN.substring(0, 20) + '...');
      console.log('Map center:', mapCenter, 'zoom:', mapZoom);

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: mapCenter,
        zoom: mapZoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully!');
        setMapLoaded(true);
        setError(null);
      });

      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
        setError('Failed to load map. Please check your Mapbox token.');
      });

      if (onMapClick) {
        map.current.on('click', (e) => {
          onMapClick([e.lngLat.lng, e.lngLat.lat]);
        });
      }
    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
      setError('Failed to initialize map: ' + (error as Error).message);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update center when it changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({ center: mapCenter, zoom: mapZoom });
    }
  }, [mapCenter[0], mapCenter[1], mapZoom, mapLoaded]);

  // Add pro markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    console.log('Adding markers for pros:', mapPros.length);
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for pros
    mapPros.forEach((pro) => {
      if (!map.current) return;

      console.log('Adding marker for:', pro.businessName, 'at', pro.location);

      const el = document.createElement('div');
      el.className = 'pro-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#00BCD4';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '18px';
      el.innerHTML = '🔧';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([pro.location.lng, pro.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`}</h3>
                <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${pro.categories.join(', ')}</p>
                <p style="font-size: 14px; font-weight: bold; color: #00BCD4; margin-bottom: 4px;">⭐ ${pro.rating} (${pro.reviewCount} reviews)</p>
                <p style="font-size: 12px; color: #666; margin-bottom: 4px;">Starting from ${pro.startingPrice} ${pro.currency}</p>
                <p style="font-size: 11px; color: #999; margin-top: 8px;">📍 ${pro.location.area}, ${pro.location.city}</p>
              </div>
            `)
        )
        .addTo(map.current);

      if (onProClick) {
        el.addEventListener('click', () => onProClick(pro));
      }

      markers.current.push(marker);
    });
    
    console.log('Total markers added:', markers.current.length);
  }, [mapPros, mapLoaded, onProClick]);

  // Add selected location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedLocation) return;

    const el = document.createElement('div');
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#FF6B35';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    el.innerHTML = '📍';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = '16px';

    const marker = new mapboxgl.Marker(el)
      .setLngLat(selectedLocation)
      .addTo(map.current);

    return () => {
      marker.remove();
    };
  }, [selectedLocation, mapLoaded]);

  return (
    <div className="relative w-full" style={{ height }}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg z-10">
          <div className="text-center p-4">
            <p className="text-red-600 font-medium mb-2">⚠️ Map Error</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={{ 
          minHeight: height,
          backgroundColor: '#e5e7eb' // Gray background while loading
        }}
      />
      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
            <p className="text-xs text-gray-500 mt-1">Connecting to Mapbox...</p>
          </div>
        </div>
      )}
      {mapLoaded && (
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md text-sm z-10">
          ✅ Map Ready
        </div>
      )}
    </div>
  );
}
