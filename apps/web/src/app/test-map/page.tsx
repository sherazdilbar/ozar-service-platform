'use client';

import MapBasic from '@/components/MapBasic';

export default function TestMapPage() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🗺️ Map Test Page</h1>
        <p className="text-gray-600 mb-6">
          Testing Mapbox GL JS integration - This should show an interactive map of Riyadh.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Map Component</h2>
          <MapBasic
            center={[46.6753, 24.7136]} // Riyadh
            zoom={12}
            height="500px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-900">✅ Configuration:</h3>
            <ul className="text-sm space-y-1">
              <li>📍 Center: Riyadh (46.6753, 24.7136)</li>
              <li>🔍 Zoom: 12</li>
              <li className={token ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {token ? '✅' : '❌'} Token: {token ? 'Set' : 'NOT SET'}
              </li>
              {token && (
                <li className="text-xs text-gray-500 mt-2 break-all">
                  {token.substring(0, 30)}...
                </li>
              )}
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-2 text-green-900">👀 What You Should See:</h3>
            <ul className="text-sm space-y-1">
              <li>• Streets and buildings of Riyadh</li>
              <li>• Zoom controls (+/-) in top-right</li>
              <li>• Compass/navigation control</li>
              <li>• Draggable map</li>
              <li>• Gray background initially</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-900">🔍 Debugging Steps:</h3>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>
              <strong>Open Browser Console (F12)</strong>
              <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
                <li>Look for "🗺️ Initializing Mapbox..."</li>
                <li>Look for "✅ Map loaded successfully!"</li>
                <li>Check for any red errors</li>
              </ul>
            </li>
            <li>
              <strong>Check Network Tab (F12 → Network)</strong>
              <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
                <li>Filter by "mapbox"</li>
                <li>Look for requests to api.mapbox.com</li>
                <li>Check if they return 200 (success) or 401 (unauthorized)</li>
              </ul>
            </li>
            <li>
              <strong>Verify Token</strong>
              <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
                <li>File: apps/web/.env.local</li>
                <li>Should start with: pk.eyJ1...</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold mb-2 text-red-900">❌ Common Issues:</h3>
          <ul className="text-sm space-y-2">
            <li>
              <strong>Gray box only:</strong> Token might be invalid or expired
            </li>
            <li>
              <strong>401 errors:</strong> Token not authorized for this domain
            </li>
            <li>
              <strong>Nothing loads:</strong> Check if mapbox-gl package is installed
            </li>
            <li>
              <strong>Console errors:</strong> Copy and share the error message
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

