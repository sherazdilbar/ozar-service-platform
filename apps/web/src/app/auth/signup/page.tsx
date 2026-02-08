'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LanguageLink from '@/components/LanguageLink';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles, Zap, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'CUSTOMER' | 'PRO'>('CUSTOMER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const validateStep1 = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Disable signup functionality
    alert('Account creation is currently disabled. This feature will be available soon. Please check back later!');
    return;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    return 'Strong';
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#13131f]">
      {/* Left Panel - Brand & Benefits */}
      <div className="hidden lg:block relative lg:w-1/2 bg-gradient-to-br from-[#F26522] to-[#E8450E] overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"></div>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl"></div>

        {/* Content Container */}
        <div className="relative flex flex-col lg:px-16 lg:py-12 lg:justify-center lg:h-full z-10">
          {/* Logo */}
          <div className="lg:absolute lg:top-8 lg:left-16 flex items-center">
            <img 
              src="/ozar-logo.png" 
              alt="Ozar" 
              className="h-16 w-auto"
            />
            <span className="text-2xl font-bold text-white tracking-tight">Ozar</span>
          </div>

          {/* Main Content */}
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Join Ozar Today
            </h1>
            <p className="text-lg text-orange-50 mb-12 max-w-md leading-relaxed">
              Connect with trusted professionals in Budapest. The fastest way to get things done.
            </p>

            {/* Benefits */}
            <div className="flex flex-col space-y-6 mb-12">
              <div className="flex items-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Quick Setup</h3>
                  <p className="text-orange-50 text-sm leading-relaxed opacity-90">
                    Get started in under 2 minutes with our streamlined process.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Free to Join</h3>
                  <p className="text-orange-50 text-sm leading-relaxed opacity-90">
                    No credit card required. Start exploring professionals immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Signal */}
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm w-fit border border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#F26522] bg-slate-200 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#F26522] bg-white flex items-center justify-center text-xs font-bold text-[#F26522]">
                  +12k
                </div>
              </div>
              <div className="text-white text-sm">
                <span className="font-bold block">12,000+ professionals</span>
                <span className="text-orange-100 text-xs">already on Ozar</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-8 left-16 text-orange-100/60 text-xs">
            © 2026 Ozar. All rights reserved.
          </div>
        </div>

        {/* Curved Divider */}
        <div className="absolute top-0 right-0 h-full w-16 z-20 overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full text-[#13131f] fill-current"
          >
            <path d="M 100 0 L 100 100 L 0 100 C 50 100 50 0 0 0 Z" />
          </svg>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 py-10 sm:px-8 lg:p-12 relative min-h-screen lg:min-h-0">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center mb-8">
          <img 
            src="/ozar-logo.png" 
            alt="Ozar" 
            className="h-16 w-auto"
          />
          <span className="text-2xl font-bold text-white tracking-tight">Ozar</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {step === 1 ? 'Join thousands of happy users' : 'Just a few more details'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-4 sm:space-y-5">
                {/* Role Selector */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      role === 'CUSTOMER'
                        ? 'bg-emerald-500/10 border-emerald-500'
                        : 'bg-[#1e1e30] border-[#2a2a40] hover:border-slate-600 hover:bg-[#25253a]'
                    }`}
                  >
                    {role === 'CUSTOMER' && (
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <User className={`h-5 w-5 mb-2 transition-colors ${role === 'CUSTOMER' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium transition-colors ${role === 'CUSTOMER' ? 'text-white' : 'text-slate-300'}`}>
                      Customer
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('PRO')}
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      role === 'PRO'
                        ? 'bg-emerald-500/10 border-emerald-500'
                        : 'bg-[#1e1e30] border-[#2a2a40] hover:border-slate-600 hover:bg-[#25253a]'
                    }`}
                  >
                    {role === 'PRO' && (
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <span className={`text-xl mb-2`}>🔧</span>
                    <span className={`text-sm font-medium transition-colors ${role === 'PRO' ? 'text-white' : 'text-slate-300'}`}>
                      Professional
                    </span>
                  </button>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg bg-[#1e1e30] border border-[#2a2a40] pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full rounded-lg bg-[#1e1e30] border border-[#2a2a40] pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  {formData.password && (
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Password strength</span>
                        <span className={`font-medium ${passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 4 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ease-out ${getPasswordStrengthColor()}`}
                          style={{ width: `${Math.min(100, (passwordStrength / 5) * 100)}%` }}
                        />
                      </div>
                      <ul className="text-xs text-slate-500 space-y-0.5 mt-2">
                        <li className={formData.password.length >= 8 ? 'text-emerald-500' : ''}>• At least 8 characters</li>
                        <li className={/[0-9]/.test(formData.password) ? 'text-emerald-500' : ''}>• Contains a number</li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full mt-6 h-11 px-4 text-sm inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent focus:ring-emerald-500"
                >
                  <span>Continue</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                      <input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full rounded-lg bg-[#1e1e30] border border-[#2a2a40] pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Last Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                      <input
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full rounded-lg bg-[#1e1e30] border border-[#2a2a40] pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number (Optional)</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="tel"
                      placeholder="+36 20 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg bg-[#1e1e30] border border-[#2a2a40] pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 px-4 text-sm inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent focus:ring-emerald-500"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-4 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Back to previous step
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-6 sm:mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-slate-600 text-xs text-center">
          © 2026 Ozar. All rights reserved.
        </div>
      </div>
    </div>
  );
}
