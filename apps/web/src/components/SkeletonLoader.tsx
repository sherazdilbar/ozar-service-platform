'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : 'animate-shimmer';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
    />
  );
}

export function SkeletonProCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={64} height={64} />
            <div className="space-y-2">
              <Skeleton width={150} height={20} />
              <Skeleton width={100} height={16} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton width={100} height={28} className="rounded-full" />
          <Skeleton width={80} height={28} className="rounded-full" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
        <div className="flex items-center justify-between pt-4">
          <Skeleton width={120} height={24} />
          <Skeleton width={100} height={36} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonBookingCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2">
            <Skeleton width={180} height={20} />
            <Skeleton width={120} height={16} />
          </div>
        </div>
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton width="100%" height={16} />
        <Skeleton width="60%" height={16} />
      </div>
      <div className="flex gap-3 mt-6">
        <Skeleton width="100%" height={40} className="rounded-lg" />
        <Skeleton width="100%" height={40} className="rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonMessageCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton width={140} height={18} />
            <Skeleton width={60} height={14} />
          </div>
          <Skeleton width="80%" height={16} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, type = 'pro' }: { count?: number; type?: 'pro' | 'booking' | 'message' }) {
  const Component = type === 'pro' ? SkeletonProCard : type === 'booking' ? SkeletonBookingCard : SkeletonMessageCard;
  
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
