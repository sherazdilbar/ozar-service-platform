'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsDropdown from './NotificationsDropdown';
import ThemeToggle from './ThemeToggle';
import { ArrowLeft, MessageSquare, Calendar, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
}

export default function ModernHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  backUrl = '/',
  actions 
}: ModernHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={() => router.push(backUrl)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Custom Actions */}
            {actions}

            {/* Quick Nav for Customers */}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/chat"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link
                  href="/bookings"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="My Bookings"
                >
                  <Calendar className="w-5 h-5" />
                </Link>
                <Link
                  href="/profile"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Quick Nav for Pros */}
            {isAuthenticated && user?.role === 'PRO' && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/pro/dashboard"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link
                  href="/chat"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link
                  href="/pro/profile"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  title="Profile"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Notifications */}
            {isAuthenticated && <NotificationsDropdown />}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition transform hover:scale-105 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Brand Logo (Mobile) */}
            <Link href="/" className="md:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
