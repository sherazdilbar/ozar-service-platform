'use client';

import { motion } from 'framer-motion';

export function BudapestSkyline({ className }: { className?: string }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none text-teal-800 ${className}`}
      style={{ height: '500px' }}
    >
      <svg
        viewBox="0 0 1440 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-bottom opacity-30"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Ground/Water Base */}
        <path d="M0 500L1440 500V450H0V500Z" fill="currentColor" />

        {/* Chain Bridge Silhouette */}
        <path
          d="M200 450 L200 350 L250 350 L250 450 M1200 450 L1200 350 L1250 350 L1250 450"
          fill="currentColor"
          className="opacity-80"
        />
        <path
          d="M0 400 Q 225 450 450 400 T 900 400 T 1350 400"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="opacity-60"
        />
        <path
          d="M225 350 L1225 350"
          stroke="currentColor"
          strokeWidth="8"
          className="opacity-80"
        />

        {/* Parliament Building (Left/Center) */}
        <g transform="translate(350, 200) scale(1.2)">
          {/* Main Dome */}
          <path d="M150 150 L150 100 Q 200 50 250 100 L250 150 Z" fill="currentColor" />
          <rect x="195" y="40" width="10" height="60" fill="currentColor" />
          <path d="M190 40 L200 20 L210 40 Z" fill="currentColor" />

          {/* Side Spires */}
          <path d="M50 150 L50 80 L80 150 Z" fill="currentColor" />
          <path d="M350 150 L350 80 L320 150 Z" fill="currentColor" />

          {/* Main Body */}
          <rect x="20" y="150" width="360" height="100" fill="currentColor" />

          {/* Windows/Details */}
          <rect x="40" y="170" width="20" height="40" fill="white" className="opacity-30" />
          <rect x="80" y="170" width="20" height="40" fill="white" className="opacity-30" />
          <rect x="300" y="170" width="20" height="40" fill="white" className="opacity-30" />
          <rect x="340" y="170" width="20" height="40" fill="white" className="opacity-30" />
        </g>

        {/* Buda Castle / Fisherman's Bastion (Right) */}
        <g transform="translate(900, 220)">
          <path d="M50 230 L50 150 L100 150 L100 230 Z" fill="currentColor" />
          <path d="M50 150 L75 100 L100 150 Z" fill="currentColor" />
          <rect x="120" y="180" width="150" height="50" fill="currentColor" />
          <path d="M120 180 L120 140 L150 140 L150 180 Z" fill="currentColor" />
          <path d="M240 180 L240 140 L270 140 L270 180 Z" fill="currentColor" />
          <path d="M120 140 L135 110 L150 140 Z" fill="currentColor" />
          <path d="M240 140 L255 110 L270 140 Z" fill="currentColor" />
        </g>

        {/* St. Stephen's Basilica (Far Left Background) */}
        <g transform="translate(100, 250) scale(0.8)" className="opacity-60">
          <rect x="50" y="100" width="100" height="100" fill="currentColor" />
          <path d="M50 100 Q 100 50 150 100 Z" fill="currentColor" />
          <rect x="90" y="40" width="20" height="60" fill="currentColor" />
        </g>

        {/* Animated Clouds */}
        <motion.circle
          cx="200"
          cy="100"
          r="30"
          fill="white"
          className="opacity-10"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          cx="1000"
          cy="80"
          r="40"
          fill="white"
          className="opacity-10"
          animate={{ x: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </div>
  );
}
