'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Search, MessageSquare, Calendar, Star } from 'lucide-react';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    icon: <Search className="w-12 h-12" />,
    title: 'Find the Perfect Pro',
    description: 'Search through thousands of verified professionals. Filter by location, category, rating, and availability.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: <MessageSquare className="w-12 h-12" />,
    title: 'Chat & Discuss',
    description: 'Message professionals directly to discuss your needs, share photos, and get instant quotes.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: <Calendar className="w-12 h-12" />,
    title: 'Book with Confidence',
    description: 'Schedule services at your convenience with secure payment processing and booking protection.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Star className="w-12 h-12" />,
    title: 'Rate & Review',
    description: 'Share your experience to help others make informed decisions and build our trusted community.',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }
    if (touchStart - touchEnd < -75) {
      handlePrev();
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-4">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 mx-auto shadow-lg animate-bounce-slow`}>
            {step.icon}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
            {step.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {step.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-teal-600'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`${currentStep === 0 ? 'w-full' : 'flex-1'} px-6 py-3 bg-gradient-to-r ${step.color} hover:opacity-90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg`}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
