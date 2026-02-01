'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProProfile, Service, getProById, createBooking } from '@ozar/shared';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Zap, 
  FileText, 
  Camera, 
  CheckCircle, 
  ArrowLeft,
  Star,
  User,
  CreditCard,
  Loader,
  XCircle
} from 'lucide-react';

type BookingStep = 'service' | 'schedule' | 'details' | 'summary' | 'payment' | 'success';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proId = searchParams?.get('proId');
  const { user } = useAuth();

  const [step, setStep] = useState<BookingStep>('service');
  const [pro, setPro] = useState<ProProfile | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isASAP, setIsASAP] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({
    address: '',
    city: '',
    lat: 0,
    lng: 0
  });
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/booking/new?proId=' + proId);
      return;
    }

    // Prevent pros from booking services
    if (user.role === 'PRO') {
      router.push('/pro/dashboard');
      return;
    }

    if (proId) {
      loadPro();
      detectUserLocation();
    }
  }, [proId, user]);

  const detectUserLocation = async () => {
    setDetectingLocation(true);
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
              const place = data.features[0];
              const cityFeature = data.features.find((f: any) => 
                f.place_type.includes('place') || f.place_type.includes('locality')
              );
              
              setLocation({
                address: place.place_name || place.text,
                city: cityFeature?.text || place.text,
                lat: latitude,
                lng: longitude,
              });
            }
          } catch (err) {
            console.error('Geocoding error:', err);
            setLocation({
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              city: 'Unknown',
              lat: latitude,
              lng: longitude,
            });
          }
          
          setDetectingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetectingLocation(false);
          setLocation({
            address: 'Location not detected',
            city: 'Unknown',
            lat: 0,
            lng: 0,
          });
        }
      );
    } else {
      setDetectingLocation(false);
      setLocation({
        address: 'Geolocation not supported',
        city: 'Unknown',
        lat: 0,
        lng: 0,
      });
    }
  };

  const loadPro = async () => {
    try {
      const proData = await getProById(proId!);
      setPro(proData);
    } catch (err) {
      setError('Failed to load professional details');
    }
  };

  const handleCreateBooking = async () => {
    if (!pro || !selectedService || !user) return;

    setLoading(true);
    setError('');
    
    try {
      await createBooking({
        customerId: user.id,
        proId: pro.id,
        serviceId: selectedService.id,
        scheduledFor: isASAP ? undefined : `${scheduledDate}T${scheduledTime}:00`,
        isASAP,
        description,
        images: [],
        location: {
          address: location.address || 'Address not provided',
          city: location.city || 'Unknown',
          lat: location.lat,
          lng: location.lng
        }
      });

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = (s: BookingStep) => {
    const steps = ['service', 'schedule', 'details', 'summary'];
    return steps.indexOf(s) + 1;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Modern Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Book Service</h1>
              {step !== 'success' && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {getStepNumber(step)} of 4
                </p>
              )}
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step !== 'success' && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {['service', 'schedule', 'details', 'summary'].map((s, i) => {
                const isActive = step === s;
                const isCompleted = getStepNumber(step) > i + 1;
                const stepLabels = ['Service', 'Schedule', 'Details', 'Summary'];
                
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        isCompleted 
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' 
                          : isActive 
                          ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30 scale-110' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : i + 1}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stepLabels[i]}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                        isCompleted ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Step 1: Select Service */}
        {step === 'service' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select a Service</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose the service you need from {pro.user.firstName}</p>
            </div>
            
            <div className="grid gap-4">
              {pro.services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep('schedule');
                  }}
                  className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all border-2 ${
                    selectedService?.id === service.id 
                      ? 'border-teal-600 shadow-xl shadow-teal-500/20 scale-[1.02]' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service.duration} min</span>
                        </div>
                        <div className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg text-sm font-medium">
                          {service.pricingModel === 'HOURLY' ? 'Per Hour' : service.pricingModel === 'FIXED' ? 'Fixed Price' : 'Inspection'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{service.price}</div>
                      <div className="text-gray-500 dark:text-gray-400 font-medium">{service.currency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 'schedule' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">When do you need this?</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose your preferred timing</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setIsASAP(true)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left group ${
                    isASAP 
                      ? 'border-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 shadow-lg shadow-teal-500/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      isASAP ? 'bg-teal-600 shadow-lg shadow-teal-500/30' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30'
                    }`}>
                      <Zap className={`w-7 h-7 ${isASAP ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">As Soon As Possible</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Pro will contact you to confirm timing</div>
                    </div>
                    {isASAP && (
                      <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setIsASAP(false)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left group ${
                    !isASAP 
                      ? 'border-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 shadow-lg shadow-teal-500/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      !isASAP ? 'bg-teal-600 shadow-lg shadow-teal-500/30' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30'
                    }`}>
                      <Calendar className={`w-7 h-7 ${!isASAP ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">Schedule for Later</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Choose a specific date and time</div>
                    </div>
                    {!isASAP && (
                      <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                </button>
              </div>

              {!isASAP && (
                <div className="space-y-4 mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep('details')}
                disabled={!isASAP && (!scheduledDate || !scheduledTime)}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue to Details
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Describe Your Needs</h2>
              <p className="text-gray-600 dark:text-gray-400">Help the professional understand what you need</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Service Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location.address}
                      onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      placeholder="Enter your address..."
                      className="w-full px-4 py-3 pr-32 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={detectUserLocation}
                      disabled={detectingLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-sm font-semibold hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {detectingLocation ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Detecting...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>Detect</span>
                        </>
                      )}
                    </button>
                  </div>
                  {location.city && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                      <span>📍</span>
                      <span>City: {location.city}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe what you need help with in detail..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Be as specific as possible to help the professional prepare
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <Camera className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Photos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 text-center hover:border-teal-400 dark:hover:border-teal-500 transition-all cursor-pointer bg-gray-50 dark:bg-gray-900 group">
                    <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Click to upload photos</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Help the pro understand your needs better</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('summary')}
                disabled={!description.trim() || !location.address}
                className="w-full mt-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Review Booking
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 'summary' && selectedService && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review Your Booking</h2>
              <p className="text-gray-600 dark:text-gray-400">Please confirm all details before proceeding</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Pro Header */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={pro.user.avatar || '/placeholder-avatar.png'}
                    alt={`${pro.user.firstName} ${pro.user.lastName}`}
                    width={80}
                    height={80}
                    className="rounded-2xl border-4 border-white shadow-lg"
                    unoptimized
                  />
                  <div className="flex-1 text-white">
                    <div className="font-bold text-2xl mb-1">
                      {pro.user.firstName} {pro.user.lastName}
                    </div>
                    <div className="text-teal-100 mb-2">{pro.businessName}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{pro.rating}</span>
                        <span className="text-teal-100 text-sm">({pro.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6 space-y-6">
                {/* Service */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Service</div>
                    <div className="font-bold text-gray-900 dark:text-white">{selectedService.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedService.description}</div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    {isASAP ? (
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">When</div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {isASAP ? 'ASAP' : `${new Date(scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${scheduledTime}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Duration: {selectedService.duration} minutes
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</div>
                    <div className="font-bold text-gray-900 dark:text-white">{location.address}</div>
                    {location.city && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.city}</div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</div>
                      <div className="text-gray-900 dark:text-white">{description}</div>
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Service price</span>
                    <span className="font-semibold">{selectedService.price} {selectedService.currency}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Platform fee (15%)</span>
                    <span className="font-semibold">{Math.round(selectedService.price * 0.15)} {selectedService.currency}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-teal-600 dark:text-teal-400">
                      {selectedService.price + Math.round(selectedService.price * 0.15)} {selectedService.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateBooking}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  <span>Confirm & Pay</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30 animate-bounce">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Booking Confirmed!</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Your booking request has been sent to <span className="font-semibold text-teal-600 dark:text-teal-400">{pro.user.firstName}</span>. 
                They will contact you shortly to confirm the details.
              </p>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">What's Next?</span>
                </div>
                <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                    <span>The professional will review your request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                    <span>You'll receive a confirmation message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>
                    <span>Track your booking status in real-time</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/bookings')} 
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  View My Bookings
                </button>
                <button 
                  onClick={() => router.push('/')} 
                  className="px-8 py-4 bg-white dark:bg-gray-700 border-2 border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-xl font-bold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
