'use client';

import { ProProfile, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProCardProps {
  pro: ProProfile;
  distance: number;
}

export default function ProCard({ pro, distance }: ProCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ minHeight: '180px' }}>
      <div className="flex" style={{ height: '100%' }}>
        {/* Professional Image */}
        <div className="relative w-[150px] h-[180px] flex-shrink-0 bg-gray-100 flex items-center justify-center">
          {pro.user?.avatar ? (
            <Image
              src={pro.user.avatar}
              alt={`${pro.user.firstName} ${pro.user.lastName}`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="text-6xl text-gray-400">👤</div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {pro.user.firstName} {pro.user.lastName}
              </h3>
              {pro.verificationStatus === 'APPROVED' && (
                <span className="text-[#00BCD4]">✓</span>
              )}
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">⋯</span>
            </button>
          </div>

          {/* Category */}
          <p className="text-sm text-gray-600 mb-3">{CATEGORY_LABELS[pro.categories[0]]}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= Math.floor(pro.rating) ? 'text-orange-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
            <span className="text-sm font-medium text-gray-900 ml-1">{pro.rating}</span>
            <span className="text-sm text-gray-500">{pro.jobsCompleted} jobs</span>
          </div>

          {/* Availability Badge */}
          {pro.availabilityStatus === 'AVAILABLE_NOW' && (
            <div className="flex items-center gap-1 text-sm text-[#00BCD4] mb-3">
              <span className="w-2 h-2 bg-[#00BCD4] rounded-full"></span>
              <span className="font-medium">Available now</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span>📍</span>
                {distance.toFixed(1)} km
              </span>
              <span>From <span className="font-bold text-gray-900">{pro.startingPrice} {pro.currency}</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <span>💼</span>
              <span>Jobs open</span>
            </button>
            <button 
              onClick={() => router.push(`/pros/${pro.id}`)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-[#00838F] rounded-lg hover:bg-[#00697A]"
            >
              <span>Start now</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
