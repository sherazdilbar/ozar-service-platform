'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  avatars: string[];
  quote: string;
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  avatars,
  quote,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden group h-full flex flex-col z-20"
    >
      {/* Top Decoration */}
      <div className={`absolute top-0 left-0 w-full h-1 ${iconBg}`} />

      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-6">
        <div
          className={`p-3 rounded-xl ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>

        {/* Avatar Cluster */}
        <div className="flex -space-x-2 overflow-hidden">
          {avatars.map((src, i) => (
            <img
              key={i}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              src={src}
              alt={`User ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
        {description}
      </p>

      {/* Mini Testimonial */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 relative mt-auto">
        <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 border-t border-l border-gray-100 transform rotate-45"></div>
        <p className="text-xs text-gray-500 italic">"{quote}"</p>
      </div>
    </motion.div>
  );
}
