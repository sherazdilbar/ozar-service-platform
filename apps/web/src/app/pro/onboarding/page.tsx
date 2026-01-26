'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { ServiceCategory, AvailabilityStatus, PricingModel, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';
import { prosApi, servicesApi } from '@ozar/shared/apiClient';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import ImageUpload from '@/components/ImageUpload';
import { 
  ArrowRight, ArrowLeft, Check, Sparkles, Briefcase, MapPin, 
  Image as ImageIcon, Rocket, User, Star, CheckCircle, Camera,
  Clock, Award
} from 'lucide-react';

type OnboardingStep = 
  | 'welcome' 
  | 'photo' 
  | 'businessName' 
  | 'bio' 
  | 'experience' 
  | 'phone' 
  | 'location'
  | 'categories' 
  | 'complete';

export default function ProOnboardingPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Form data states
  const [businessData, setBusinessData] = useState({
    businessName: '',
    bio: '',
    yearsExperience: 0,
    phone: user?.phone || '',
  });

  const [locationData, setLocationData] = useState({
    city: '',
    area: '',
    lat: 47.4979, // Default Budapest
    lng: 19.0402,
    radius: 20, // Default 20km
  });

  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const stepOrder: OnboardingStep[] = [
    'welcome',
    'photo',
    'businessName',
    'bio',
    'experience',
    'phone',
    'location',
    'categories',
    'complete'
  ];

  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = Math.round((currentStepIndex / (stepOrder.length - 1)) * 100);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    checkOnboardingStatus();
  }, [isAuthenticated, user]);

  const checkOnboardingStatus = async () => {
    try {
      // Try to load existing profile
      try {
        const profile = await prosApi.getMyProfile();
        if (profile) {
          setProfileId(profile.id);
          setBusinessData({
            businessName: profile.businessName || '',
            bio: profile.bio || '',
            yearsExperience: profile.yearsExperience || 0,
            phone: profile.user?.phone || user?.phone || '',
          });
          setCategories(profile.categories || []);
        }
      } catch (err) {
        console.log('No existing profile');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
    }
  };

  const saveProgress = async (step: OnboardingStep) => {
    // Progress saving removed - not needed for now
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      // Save data based on current step
      if (currentStep === 'phone') {
        await saveBusinessInfo();
      } else if (currentStep === 'location') {
        await saveLocation();
      } else if (currentStep === 'categories') {
        await saveCategories();
        // Mark onboarding as complete (simplified - just redirect)
        router.push('/pro/dashboard');
        return;
      }
      
      goToNextStep();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async () => {
    if (!locationData.city || !locationData.area) {
      throw new Error('Please set your location');
    }

    try {
      await prosApi.updateProfile({
        location: {
          city: locationData.city,
          area: locationData.area,
          lat: locationData.lat,
          lng: locationData.lng,
        },
        serviceArea: {
          city: locationData.city,
          radiusKm: locationData.radius,
        },
      });
      toast.success('Location saved!');
    } catch (error: any) {
      console.error('Save location error:', error);
      throw error;
    }
  };

  const saveBusinessInfo = async () => {
    if (!businessData.businessName || !businessData.bio) {
      throw new Error('Please fill in all required fields');
    }
    if (businessData.bio.length < 50) {
      throw new Error('Bio must be at least 50 characters');
    }

    try {
      // First, try to get existing profile
      let profile = null;
      try {
        profile = await prosApi.getMyProfile();
        setProfileId(profile.id);
      } catch (err) {
        // No profile exists yet
      }

      const data = {
        businessName: businessData.businessName,
        bio: businessData.bio,
        serviceArea: {
          city: 'Budapest',
          radiusKm: 10,
        },
        location: {
          city: 'Budapest',
          area: 'City Center',
          lat: 47.4979,
          lng: 19.0402,
        },
      };

      if (profile) {
        // Profile exists, just update it
        await prosApi.updateProfile({
          ...data,
          yearsExperience: businessData.yearsExperience,
          availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
        });
      } else {
        // No profile, create new one
        const createData = {
          ...data,
          categories: categories.length > 0 ? categories.map(c => String(c)) : ['ELECTRICIAN'],
        };
        const newProfile = await prosApi.createProProfile(createData);
        setProfileId(newProfile.id);
        
        // Update with additional fields
        await prosApi.updateProfile({
          yearsExperience: businessData.yearsExperience,
          availabilityStatus: AvailabilityStatus.AVAILABLE_NOW,
        });
      }
      toast.success('Profile saved!');
    } catch (error: any) {
      console.error('Save error:', error);
      throw error;
    }
  };

  const saveCategories = async () => {
    if (categories.length === 0) {
      throw new Error('Please select at least one category');
    }
    // Convert enum values to strings
    await prosApi.updateProfile({ categories: categories.map(c => String(c)) });
    toast.success('Categories saved!');
  };

  const handleAvatarUpload = (avatarUrl: string) => {
    if (user) {
      updateUser({ ...user, avatar: avatarUrl });
    }
  };

  const toggleCategory = (category: ServiceCategory) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'photo':
        return true; // Optional
      case 'businessName':
        return businessData.businessName.trim().length > 0;
      case 'bio':
        return businessData.bio.length >= 50;
      case 'experience':
        return true;
      case 'phone':
        return businessData.phone.trim().length > 0;
      case 'location':
        return locationData.city && locationData.area;
      case 'categories':
        return categories.length > 0;
      default:
        return true;
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const cityFeature = data.features.find((f: any) => 
                f.place_type.includes('place') || f.place_type.includes('locality')
              );
              const areaFeature = data.features.find((f: any) => 
                f.place_type.includes('neighborhood') || f.place_type.includes('locality')
              );
              
              if (cityFeature) {
                setLocationData(prev => ({ 
                  ...prev, 
                  city: cityFeature.text,
                  area: areaFeature?.text || cityFeature.text,
                  lat: latitude,
                  lng: longitude,
                }));
                toast.success('Location detected!');
              }
            }
          } catch (err) {
            console.error('Geocoding error:', err);
            toast.error('Failed to detect location');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Please enable location access');
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const searchLocation = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place,locality,neighborhood&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=5`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        setLocationData(prev => ({
          ...prev,
          city: feature.context?.find((c: any) => c.id.includes('place'))?.text || feature.text,
          area: feature.text,
          lat: feature.center[1],
          lng: feature.center[0],
        }));
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 z-50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transition-all duration-700 ease-out shadow-lg shadow-teal-500/50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 pt-16">
        {/* Step Counter */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentStepIndex}</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                Step {currentStepIndex} of {stepOrder.length - 2}
              </span>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl">
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <div className="text-center animate-fade-in">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-14 h-14 text-white animate-pulse" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">Ozar</span>
              </h1>
              
              <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto">
                Let's set up your professional profile in just a few simple steps
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2 mb-12">
                <Clock className="w-5 h-5" />
                Takes about 3-5 minutes
              </p>

              <button
                onClick={goToNextStep}
                className="group relative px-12 py-5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 inline-flex items-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative">Let's Get Started</span>
                <ArrowRight className="relative w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          )}

          {/* Photo Step */}
          {currentStep === 'photo' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Add your professional photo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                A clear photo helps customers trust you
              </p>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16">
                <ProfilePictureUpload
                  currentAvatar={user?.avatar}
                  onUploadSuccess={handleAvatarUpload}
                  userName={`${user?.firstName} ${user?.lastName}`}
                  size="xl"
                />
                <p className="text-gray-500 dark:text-gray-400 mt-6">You can skip this and add it later</p>
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={goToNextStep}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
                >
                  Continue
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Business Name Step */}
          {currentStep === 'businessName' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                What's your business name?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                This is how customers will find you
              </p>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16">
                <input
                  type="text"
                  autoFocus
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && canContinue() && goToNextStep()}
                  className="w-full px-8 py-6 text-2xl text-center border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="e.g., John's Electrical Services"
                />
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={goToNextStep}
                  disabled={!canContinue()}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  Continue
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Bio Step */}
          {currentStep === 'bio' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Tell us about yourself
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                Share your experience and what makes you special
              </p>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16">
                <textarea
                  autoFocus
                  rows={6}
                  value={businessData.bio}
                  onChange={(e) => setBusinessData({ ...businessData, bio: e.target.value })}
                  className="w-full px-8 py-6 text-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm hover:shadow-md resize-none"
                  placeholder="Tell customers about your experience, skills, and what makes you stand out..."
                />
                <div className="flex justify-between mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Minimum 50 characters</p>
                  <div className="flex items-center gap-2">
                    {businessData.bio.length >= 50 && <CheckCircle className="w-5 h-5 text-green-600" />}
                    <span className={`text-lg font-bold ${businessData.bio.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
                      {businessData.bio.length} / 50
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={goToNextStep}
                  disabled={!canContinue()}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  Continue
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Experience Step */}
          {currentStep === 'experience' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                How many years of experience?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                This helps customers understand your expertise
              </p>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16">
                <div className="grid grid-cols-4 gap-6">
                  {[0, 1, 3, 5, 10, 15, 20, 25].map((years) => (
                    <button
                      key={years}
                      type="button"
                      onClick={() => setBusinessData({ ...businessData, yearsExperience: years })}
                      className={`relative p-8 rounded-2xl border-2 transition-all transform hover:scale-110 ${
                        businessData.yearsExperience === years
                          ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 shadow-2xl scale-110'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-teal-300 shadow-sm hover:shadow-lg'
                      }`}
                    >
                      {businessData.yearsExperience === years && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`text-4xl font-bold ${businessData.yearsExperience === years ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {years === 0 ? '<1' : years === 25 ? '25+' : years}
                      </div>
                      <div className={`text-sm font-medium mt-2 ${businessData.yearsExperience === years ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {years === 0 ? 'year' : 'years'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={goToNextStep}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
                >
                  Continue
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Phone Step */}
          {currentStep === 'phone' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                What's your contact number?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                Customers will use this to reach you
              </p>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-16">
                <input
                  type="tel"
                  autoFocus
                  value={businessData.phone}
                  onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && canContinue() && handleNext()}
                  className="w-full px-8 py-6 text-2xl text-center border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm hover:shadow-md"
                  placeholder="+36 20 123 4567"
                />
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading || !canContinue()}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Location Step */}
          {currentStep === 'location' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Where do you provide services?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                Set your location and service coverage area
              </p>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                {/* Auto-detect button */}
                <div className="mb-6">
                  <button
                    onClick={detectLocation}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <MapPin className="w-6 h-6" />
                    Auto-Detect My Location
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or enter manually</span>
                  </div>
                </div>

                {/* Location inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-left text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={locationData.city}
                      onChange={(e) => {
                        setLocationData({ ...locationData, city: e.target.value });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                      placeholder="e.g., Budapest"
                    />
                  </div>
                  <div>
                    <label className="block text-left text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Area/District *
                    </label>
                    <input
                      type="text"
                      value={locationData.area}
                      onChange={(e) => {
                        setLocationData({ ...locationData, area: e.target.value });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                      placeholder="e.g., District V"
                    />
                  </div>
                </div>

                {/* Service radius selector */}
                <div className="mb-6">
                  <label className="block text-left text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Service Coverage Radius: <span className="text-teal-600 dark:text-teal-400">{locationData.radius} km</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={locationData.radius}
                    onChange={(e) => setLocationData({ ...locationData, radius: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>5 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                    <span>100 km</span>
                  </div>
                </div>

                {/* Quick radius buttons */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[5, 10, 20, 50, 100].map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      onClick={() => setLocationData({ ...locationData, radius })}
                      className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        locationData.radius === radius
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-lg'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-teal-300'
                      }`}
                    >
                      <div className={`text-lg font-bold ${locationData.radius === radius ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {radius}
                      </div>
                      <div className={`text-xs ${locationData.radius === radius ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        km
                      </div>
                    </button>
                  ))}
                </div>

                {/* Location summary */}
                {locationData.city && locationData.area && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          Service Area Set
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          📍 <strong>{locationData.area}, {locationData.city}</strong>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          You'll receive requests within {locationData.radius} km of your location
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading || !canContinue()}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Categories Step */}
          {currentStep === 'categories' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                What services do you offer?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Select all that apply
              </p>

              <div className="mb-6 inline-flex items-center gap-3 px-6 py-3 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                <CheckCircle className="w-6 h-6 text-teal-600" />
                <span className="text-teal-800 dark:text-teal-200 font-bold text-lg">
                  {categories.length} selected
                </span>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-12 max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.values(ServiceCategory).map((category) => {
                    const isSelected = categories.includes(category);
                    const label = CATEGORY_LABELS[category] || category;
                    const icon = CATEGORY_ICONS[category] || '🔧';
                    
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`relative p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                          isSelected
                            ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 shadow-xl scale-105'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-teal-300 shadow-sm hover:shadow-lg'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="text-3xl mb-2">{icon}</div>
                        <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          {label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={goToPrevStep}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading || !canContinue()}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Complete Screen */}
          {currentStep === 'complete' && (
            <div className="text-center animate-fade-in">
              <div className="relative mb-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-teal-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <Rocket className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                You're All Set! 🎉
              </h1>
              
              <p className="text-2xl text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
                Your professional profile is now live and ready to receive customer requests!
              </p>

              <button
                onClick={() => router.push('/pro/dashboard')}
                className="group relative px-12 py-5 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 inline-flex items-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative">Go to Dashboard</span>
                <ArrowRight className="relative w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
