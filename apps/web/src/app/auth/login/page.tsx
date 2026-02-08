'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Disable login functionality
    alert('Login is currently disabled. This feature will be available soon. Please check back later!');
    return;
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#13131f]">
      {/* Left Panel - Brand & Benefits */}
      <div className="hidden lg:block relative lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"></div>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>

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
              Welcome Back
            </h1>
            <p className="text-lg text-teal-50 mb-12 max-w-md leading-relaxed">
              Sign in to access your account and connect with trusted professionals in Budapest.
            </p>

            {/* Benefits */}
            <div className="flex flex-col space-y-6 mb-12">
              <div className="flex items-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Instant Access</h3>
                  <p className="text-teal-50 text-sm leading-relaxed opacity-90">
                    Get back to managing your bookings and messages instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex-shrink-0 p-2 bg-white/20 rounded-lg mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Secure & Safe</h3>
                  <p className="text-teal-50 text-sm leading-relaxed opacity-90">
                    Your data is protected with industry-standard encryption.
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
                    className="w-10 h-10 rounded-full border-2 border-teal-600 bg-slate-200 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-teal-600 bg-white flex items-center justify-center text-xs font-bold text-teal-600">
                  +12k
                </div>
              </div>
              <div className="text-white text-sm">
                <span className="font-bold block">12,000+ professionals</span>
                <span className="text-teal-100 text-xs">already on Ozar</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-8 left-16 text-teal-100/60 text-xs">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg bg-[#1e1e30] border border-[#2a2a40] pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 transition-all duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-[#1e1e30] border-[#2a2a40] rounded focus:ring-emerald-500 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 px-4 text-sm inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-transparent focus:ring-emerald-500"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 sm:mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
            >
              Sign up
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
