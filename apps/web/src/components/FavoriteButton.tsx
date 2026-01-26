'use client';

import { useState } from 'react';

interface FavoriteButtonProps {
  proId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ proId, size = 'md' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizes[size]} rounded-full flex items-center justify-center transition-all ${
        isFavorite
          ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30 scale-110'
          : 'bg-white text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300'
      }`}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
