'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProProfile } from '@ozar/shared';
import Image from 'next/image';
import { Star, MapPin, Award, TrendingUp, X } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface DynamicMapProps {
  pros: ProProfile[];
  onProClick?: (pro: ProProfile) => void;
  height?: string;
}

export default function DynamicMap({
  pros,
  onProClick,
  height = '100vh',
}: DynamicMapProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<ProProfile | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          console.log('📍 User location:', latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Default to Riyadh if geolocation fails
          setUserLocation([46.6753, 24.7136]);
        }
      );
    } else {
      // Default to Riyadh if geolocation not supported
      setUserLocation([46.6753, 24.7136]);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !userLocation) return;

    console.log('🗺️ Initializing map with user location:', userLocation);

    import('mapbox-gl').then((mapboxgl) => {
      if (!MAPBOX_TOKEN) {
        console.error('❌ Mapbox token missing!');
        setError('Mapbox token not configured');
        return;
      }

      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      console.log('✅ Mapbox token set');
      console.log('📍 Creating map at:', userLocation);

      try {
        const map = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: userLocation,
          zoom: 13,
        });

        console.log('✅ Map instance created');

        // Add controls
        map.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
        map.addControl(
          new mapboxgl.default.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
            showUserHeading: true,
          }),
          'top-right'
        );

        map.on('load', () => {
          console.log('✅ Map loaded successfully!');
          setMapLoaded(true);

          // Add user location marker
          new mapboxgl.default.Marker({ color: '#FF6B35' })
            .setLngLat(userLocation)
            .setPopup(
              new mapboxgl.default.Popup().setHTML('<div style="padding: 8px;"><strong>📍 Your Location</strong></div>')
            )
            .addTo(map);
          
          console.log('✅ User location marker added');
        });

        map.on('error', (e) => {
          console.error('❌ Map error:', e);
          setError('Failed to load map');
        });

        mapRef.current = map;
        console.log('✅ Map reference stored');
      } catch (error) {
        console.error('❌ Failed to create map:', error);
        setError('Failed to initialize map');
      }
    }).catch((error) => {
      console.error('❌ Failed to import mapbox-gl:', error);
      setError('Failed to load map library');
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [userLocation]);

  // Add professional markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    import('mapbox-gl').then((mapboxgl) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      console.log('Adding markers for', pros.length, 'professionals');

      // Add markers for each professional
      pros.forEach((pro) => {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'pro-marker';
        el.style.width = '48px';
        el.style.height = '48px';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.willChange = 'transform';
        
        // Create the visual marker (inner element)
        const visual = document.createElement('div');
        visual.style.width = '100%';
        visual.style.height = '100%';
        visual.style.borderRadius = '50%';
        visual.style.backgroundColor = '#00BCD4';
        visual.style.border = '4px solid white';
        visual.style.boxShadow = '0 4px 12px rgba(0,188,212,0.4)';
        visual.style.display = 'flex';
        visual.style.alignItems = 'center';
        visual.style.justifyContent = 'center';
        visual.style.fontSize = '20px';
        visual.style.transition = 'box-shadow 0.2s ease, background-color 0.2s ease';
        visual.style.pointerEvents = 'none';
        visual.innerHTML = '🔧';
        
        el.appendChild(visual);

        // Hover effect - only change visual element
        el.addEventListener('mouseenter', () => {
          visual.style.boxShadow = '0 6px 20px rgba(0,188,212,0.6)';
          visual.style.backgroundColor = '#00D4E8';
        });
        el.addEventListener('mouseleave', () => {
          visual.style.boxShadow = '0 4px 12px rgba(0,188,212,0.4)';
          visual.style.backgroundColor = '#00BCD4';
        });

        // Handle single click (show preview) and double click (open profile)
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          
          if (clickTimeoutRef.current) {
            // Double click detected
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            router.push(`/pros/${pro.id}`);
          } else {
            // Single click - show preview after delay
            clickTimeoutRef.current = setTimeout(() => {
              setSelectedPro(pro);
              if (onProClick) onProClick(pro);
              clickTimeoutRef.current = null;
            }, 250);
          }
        });

        const marker = new mapboxgl.default.Marker({
          element: el,
          anchor: 'center',
          offset: [0, 0],
        })
          .setLngLat([pro.location.lng, pro.location.lat])
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      });

      console.log('✅ Added', markersRef.current.length, 'markers');
    });
  }, [pros, mapLoaded, onProClick, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50" style={{ height }}>
        <div className="text-center p-6">
          <p className="text-red-600 font-bold text-lg mb-2">⚠️ {error}</p>
          <p className="text-sm text-red-500">Please check your configuration</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-lg">Getting your location...</p>
          <p className="text-gray-500 text-sm mt-2">Please allow location access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          minHeight: height,
          backgroundColor: '#e5e7eb' // Gray background
        }}
      />
      
      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium text-lg">Loading map...</p>
            <p className="text-gray-500 text-sm mt-2">Connecting to Mapbox...</p>
          </div>
        </div>
      )}

      {mapLoaded && pros.length > 0 && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-10 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-sm">
              {pros.length} Professional{pros.length !== 1 ? 's' : ''} on Map
            </span>
          </div>
        </div>
      )}
      
      {mapLoaded && pros.length === 0 && (
        <div className="absolute top-4 left-4 bg-yellow-50 px-4 py-2 rounded-lg shadow-lg z-10 border border-yellow-200">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-medium text-sm text-yellow-800">
              No professionals in this area
            </span>
          </div>
        </div>
      )}

      {/* Mini Preview Card */}
      {selectedPro && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-[90vw] sm:w-96">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPro(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition shadow-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Header with Avatar */}
            <div className="relative h-32 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
              <div className="absolute -bottom-12 left-6">
                <div className="relative w-24 h-24">
                  <Image
                    src={selectedPro.user.avatar || '/placeholder-avatar.png'}
                    alt={`${selectedPro.user.firstName} ${selectedPro.user.lastName}`}
                    fill
                    className="rounded-2xl object-cover ring-4 ring-white dark:ring-gray-800 shadow-xl"
                  />
                  {selectedPro.verificationStatus === 'APPROVED' && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-14 px-6 pb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {selectedPro.businessName || `${selectedPro.user.firstName} ${selectedPro.user.lastName}`}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedPro.categories.map(c => c.replace('_', ' ')).join(' • ')}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white">{selectedPro.rating}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{selectedPro.reviewCount} reviews</div>
                </div>
                <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <div className="font-bold text-gray-900 dark:text-white mb-1">{selectedPro.jobsCompleted}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Jobs done</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="font-bold text-gray-900 dark:text-white mb-1">{selectedPro.yearsExperience} yrs</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Experience</div>
                </div>
              </div>

              {/* Location & Price */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedPro.location.area}, {selectedPro.location.city}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">From</div>
                  <div className="font-bold text-teal-600 dark:text-teal-400">
                    {selectedPro.startingPrice} {selectedPro.currency}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/pros/${selectedPro.id}`)}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => router.push(`/booking/new?proId=${selectedPro.id}`)}
                  className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all"
                >
                  Book
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                💡 Double-click marker to open profile directly
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
