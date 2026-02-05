'use client';

import { motion } from 'framer-motion';
import { Heart, Zap, ShieldCheck, Eye, User, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FeatureCard } from './FeatureCard';
import { AnimatedStats } from './AnimatedStats';
import { BudapestSkyline } from './BudapestSkyline';

export default function VisionSection() {
  const { t } = useLanguage();

  const features = [
    {
      title: t('vision.trust.title'),
      description: t('vision.trust.description'),
      icon: Heart,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
      ],
      quote: 'I felt completely safe letting the electrician into my home. Verified pros make a difference.',
    },
    {
      title: t('vision.speed.title'),
      description: t('vision.speed.description'),
      icon: Zap,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=64&h=64',
      ],
      quote: 'My sink was fixed within 2 hours of posting. The speed is incredible!',
    },
    {
      title: t('vision.quality.title'),
      description: t('vision.quality.description'),
      icon: ShieldCheck,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64',
      ],
      quote: 'The quality of work was outstanding. Ozar truly vets their professionals.',
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-teal-50/50 via-white to-teal-50/30 overflow-hidden pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white border border-teal-100 shadow-sm rounded-full px-4 py-1.5 mb-6"
          >
            <Eye size={16} className="text-teal-600" />
            <span className="text-sm font-semibold text-teal-800 uppercase tracking-wide">
              {t('vision.badge')}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight"
          >
            Building Budapest's Most <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
              Trusted Service Platform
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            {t('vision.subtitle')}
          </motion.p>
        </div>

        {/* Animated Connection Flow */}
        <div className="mb-16 hidden md:block relative h-32">
          {/* Line Layer */}
          <div className="absolute inset-0 flex items-start justify-center pt-7">
            <svg className="w-full max-w-4xl h-4 overflow-visible" viewBox="0 0 800 20" preserveAspectRatio="none">
              <path d="M80,10 L720,10" fill="none" stroke="#E5E7EB" strokeWidth="2" />
              <motion.path
                d="M80,10 L720,10"
                fill="none"
                stroke="#0D9488"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -100 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.circle r="4" fill="#0D9488">
                <animateMotion dur="3s" repeatCount="indefinite" path="M80,10 L720,10" />
              </motion.circle>
              <motion.circle r="4" fill="#F97316">
                <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M80,10 L720,10" />
              </motion.circle>
            </svg>
          </div>

          {/* Icons Layer */}
          <div className="relative flex justify-between items-start max-w-4xl mx-auto h-full px-8">
            <JourneyStep
              icon={User}
              label="You"
              sublabel="Need a service"
            />
            <JourneyStep
              icon="logo"
              label="Ozar Platform"
              sublabel="Matches you instantly"
            />
            <JourneyStep
              icon={Briefcase}
              label="Professional"
              sublabel="Gets the job done"
            />
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20 mb-12">
          {features.map((feature, index) => (
            <div key={index} className={index === 1 ? 'md:-mt-8' : ''}>
              <FeatureCard {...feature} delay={0.3 + index * 0.1} />
            </div>
          ))}
        </div>

        {/* Integrated Stats */}
        <AnimatedStats />
      </div>

      {/* Skyline Background */}
      <BudapestSkyline className="z-0 opacity-40" />
    </section>
  );
}

function JourneyStep({ icon, label, sublabel, highlight = false }: any) {
  const isLogo = icon === 'logo';
  const Icon = isLogo ? null : icon;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 bg-white border-gray-300 relative z-10 ${isLogo ? 'p-0.5' : 'p-2'}`}
      >
        {isLogo ? (
          <img 
            src="/ozar-logo.png" 
            alt="Ozar" 
            className="w-full h-full object-contain"
          />
        ) : (
          Icon && <Icon size={24} className="text-gray-600" />
        )}
      </div>
      <div className="text-center mt-3">
        <div className="font-bold text-sm text-gray-900">
          {label}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{sublabel}</div>
      </div>
    </div>
  );
}
