'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUrl';

interface AvatarProps {
  imageUrl?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export default function Avatar({ imageUrl, name, size = 48, className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const fullImageUrl = getImageUrl(imageUrl);
  const initials = getInitials(name);

  // Generate a consistent color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const bgColor = getColorFromName(name);

  if (!fullImageUrl || imageError) {
    // Show initials fallback
    return (
      <div
        className={`${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={fullImageUrl}
        alt={name}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
