'use client';

import { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ message, type = 'info', duration = 3000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    error: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`${colors[type]} px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="font-medium">{message}</p>
        <button onClick={() => setIsVisible(false)} className="ml-auto text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}
