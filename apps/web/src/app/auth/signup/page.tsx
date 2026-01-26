'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageLink from '@/components/LanguageLink';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'CUSTOMER' | 'PRO'>('CUSTOMER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    area: '',
  });
  
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [addressResults, setAddressResults] = useState<any[]>([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [showAddressResults, setShowAddressResults] = useState(false);
  const [searchingCity, setSearchingCity] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [selectedCityData, setSelectedCityData] = useState<any>(null);
  
  const cityRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityResults(false);
      }
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setShowAddressResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
  };

  // Search for cities using Mapbox
  const searchCity = async (query: string) => {
    if (query.length < 2) {
      setCityResults([]);
      return;
    }

    setSearchingCity(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=5`
      );
      const data = await response.json();
      
      if (data.features) {
        setCityResults(data.features);
        setShowCityResults(true);
      }
    } catch (err) {
      console.error('City search error:', err);
    } finally {
      setSearchingCity(false);
    }
  };

  // Search for addresses within selected city
  const searchAddress = async (query: string) => {
    if (query.length < 3 || !selectedCityData) {
      setAddressResults([]);
      return;
    }

    setSearchingAddress(true);
    try {
      const bbox = selectedCityData.bbox?.join(',') || '';
      const proximity = selectedCityData.center ? `${selectedCityData.center[0]},${selectedCityData.center[1]}` : '';
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `types=address,poi,neighborhood&` +
        `${bbox ? `bbox=${bbox}&` : ''}` +
        `${proximity ? `proximity=${proximity}&` : ''}` +
        `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=8`
      );
      const data = await response.json();
      
      if (data.features) {
        setAddressResults(data.features);
        setShowAddressResults(true);
      }
    } catch (err) {
      console.error('Address search error:', err);
    } finally {
      setSearchingAddress(false);
    }
  };

  // Handle city selection
  const selectCity = (feature: any) => {
    setSelectedCityData(feature);
    setFormData(prev => ({
      ...prev,
      city: feature.text,
      area: '',
    }));
    setLocation({
      lat: feature.center[1],
      lng: feature.center[0],
    });
    setShowCityResults(false);
    setCityResults([]);
    setAddressResults([]);
  };

  // Handle address selection
  const selectAddress = (feature: any) => {
    // Extract just the street/address part (first part before comma)
    const addressPart = feature.text || feature.place_name.split(',')[0];
    setFormData(prev => ({
      ...prev,
      area: addressPart,
    }));
    setLocation({
      lat: feature.center[1],
      lng: feature.center[0],
    });
    setShowAddressResults(false);
    setAddressResults([]);
  };

  // Debounced search effects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.city && !selectedCityData) {
        searchCity(formData.city);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.city]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.area && selectedCityData) {
        searchAddress(formData.area);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.area, selectedCityData]);

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!formData.area.trim()) {
      setError('Please select your area/neighborhood');
      return false;
    }
    if (!location || location.lat === 0 || location.lng === 0) {
      setError('Please select a valid location from the dropdown');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role,
        location: location ? {
          city: formData.city,
          area: formData.area,
          lat: location.lat,
          lng: location.lng,
        } : {
          city: formData.city,
          area: formData.area,
          lat: 0,
          lng: 0,
        },
      });

      // Redirect PRO users to onboarding, customers to home
      if (role === 'PRO') {
        router.push('/pro/onboarding');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-700/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <LanguageLink href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <span className="text-2xl font-bold text-orange-600">O</span>
            </div>
            <span className="text-3xl font-bold text-white">Ozar</span>
          </LanguageLink>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              {t('signup.heroTitle')}
            </h1>
            <p className="text-xl text-orange-50">
              {t('signup.heroSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{t('signup.quickSetup')}</h3>
                <p className="text-orange-50 text-sm">{t('signup.quickSetupDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{t('signup.freeToJoin')}</h3>
                <p className="text-orange-50 text-sm">{t('signup.freeToJoinDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-orange-50 text-sm">
          © 2024 Ozar. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <LanguageLink href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Ozar</span>
            </LanguageLink>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('signup.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('signup.subtitle')}</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-2 rounded-full transition-all ${step >= 1 ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          </div>

          {/* Role Selection */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all ${
                role === 'CUSTOMER'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">👤</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">{t('signup.customer')}</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('PRO')}
              className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all ${
                role === 'PRO'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">🔧</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">{t('signup.professional')}</div>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.firstName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      placeholder={t('signup.firstNamePlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.lastName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      placeholder={t('signup.lastNamePlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+36 20 123 4567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>{t('signup.continue')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          )}

          {/* Step 2: Location & Password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative" ref={cityRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.city')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 z-10" />
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setShowCityResults(true);
                        setSelectedCityData(null);
                      }}
                      onFocus={() => {
                        if (cityResults.length > 0) setShowCityResults(true);
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      placeholder={t('signup.cityPlaceholder')}
                    />
                    {searchingCity && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <span className="animate-spin">⏳</span>
                      </div>
                    )}
                  </div>
                  
                  {/* City Autocomplete Results */}
                  {showCityResults && cityResults.length > 0 && (
                    <div className="absolute z-[60] w-full mt-1 bg-white dark:bg-gray-800 border-2 border-teal-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {cityResults.map((feature, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectCity(feature)}
                          className="w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-teal-900/30 transition flex items-start gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <span className="text-lg">🏙️</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{feature.text}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{feature.place_name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative" ref={addressRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('signup.area')} <span className="text-red-500">*</span>
                    {!selectedCityData && (
                      <span className="ml-1 text-xs text-gray-400">({t('signup.selectCityFirst')})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    disabled={!selectedCityData}
                    value={formData.area}
                    onChange={(e) => {
                      setFormData({ ...formData, area: e.target.value });
                      setShowAddressResults(true);
                    }}
                    onFocus={() => {
                      if (addressResults.length > 0) setShowAddressResults(true);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    placeholder={selectedCityData ? t('signup.areaPlaceholder') : t('signup.selectCityFirst')}
                  />
                  {searchingAddress && (
                    <div className="absolute right-3 top-10 text-gray-400 dark:text-gray-500">
                      <span className="animate-spin">⏳</span>
                    </div>
                  )}
                  
                  {/* Address Autocomplete Results */}
                  {showAddressResults && addressResults.length > 0 && (
                    <div className="absolute z-[60] w-full mt-1 bg-white dark:bg-gray-800 border-2 border-teal-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {addressResults.map((feature, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectAddress(feature)}
                          className="w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-teal-900/30 transition flex items-start gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <span className="text-lg">📍</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{feature.text}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{feature.place_name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {location && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-2">
                    <span>✓</span>
                    <span>
                      <strong>Location confirmed:</strong> {formData.area && `${formData.area}, `}{formData.city}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group ${
                    role === 'PRO'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600'
                      : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By signing up, you agree to our{' '}
                <a href="/terms" className="text-teal-600 dark:text-teal-400 hover:underline">Terms</a>
                {' '}and{' '}
                <a href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">Privacy Policy</a>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('signup.haveAccount')}{' '}
              <Link href="/auth/login" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold">
                {t('signup.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
