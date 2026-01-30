'use client';

import { ProProfile, CATEGORY_ICONS } from '@ozar/shared';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import { getImageUrl } from '@/utils/imageUrl';

interface ProCardProps {
  pro: ProProfile;
  distance?: number;
}

export default function ProCard({ pro, distance }: ProCardProps) {
  const availabilityColors = {
    AVAILABLE_NOW: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30',
    AVAILABLE_SOON: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/30',
    BUSY: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30',
    OFFLINE: 'bg-gray-200 text-gray-700'
  };

  const availabilityLabels = {
    AVAILABLE_NOW: 'Available Now',
    AVAILABLE_SOON: 'Available Soon',
    BUSY: 'Busy',
    OFFLINE: 'Offline'
  };

  const badges = [];
  if (pro.rating >= 4.8) badges.push({ label: 'Top Rated', icon: '⭐', color: 'bg-yellow-100 text-yellow-700' });
  if (pro.jobsCompleted > 300) badges.push({ label: 'Expert', icon: '🏆', color: 'bg-purple-100 text-purple-700' });
  if (pro.responseTime < 20) badges.push({ label: 'Fast Response', icon: '⚡', color: 'bg-blue-100 text-blue-700' });

  return (
    <Link href={`/pros/${pro.id}`}>
      <div className="card p-5 hover:shadow-xl cursor-pointer group relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Favorite Button */}
        <div className="absolute top-4 right-4 z-20">
          <FavoriteButton proId={pro.id} size="sm" />
        </div>
        
        <div className="relative z-10">
          <div className="flex gap-5">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={getImageUrl(pro.user.avatar) || '/placeholder-avatar.png'}
                alt={`${pro.user.firstName} ${pro.user.lastName}`}
                fill
                className="rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all"
              />
              {pro.verificationStatus === 'APPROVED' && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">
                  ✓
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl truncate group-hover:text-primary-600 transition-colors">
                    {pro.user.firstName} {pro.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <span className="text-lg">{pro.categories.map(cat => CATEGORY_ICONS[cat]).join(' ')}</span>
                    <span className="ml-1 font-medium">{pro.categories[0].replace('_', ' ')}</span>
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold text-lg">{pro.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">({pro.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {badges.map((badge, i) => (
                    <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium ${badge.color} flex items-center gap-1`}>
                      <span>{badge.icon}</span>
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <span className="text-green-600 font-semibold">✓</span>
                  {pro.jobsCompleted} jobs completed
                </span>
                {distance && (
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    {distance} km away
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span>⏱️</span>
                  ~{pro.responseTime} min response
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-xl text-xs font-bold ${availabilityColors[pro.availabilityStatus]}`}>
                  {availabilityLabels[pro.availabilityStatus]}
                </span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-2xl text-gray-900">
                      {pro.startingPrice}
                    </span>
                    <span className="text-sm text-gray-600">{pro.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
