'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LanguageLink from '@/components/LanguageLink';
import { ChevronRight, Menu, X } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <LanguageLink href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">Ozar</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Find Local Pros</div>
            </div>
          </LanguageLink>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <LanguageLink 
              href="/how-it-works" 
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-500 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {t('nav.howItWorks')}
            </LanguageLink>
            <LanguageLink 
              href="/trust-safety" 
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-500 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {t('nav.trustSafety')}
            </LanguageLink>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <NotificationsDropdown />
                {user?.role === 'CUSTOMER' && (
                  <div className="hidden lg:flex items-center gap-2">
                    <LanguageLink href="/profile" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      {t('nav.profile')}
                    </LanguageLink>
                    <LanguageLink href="/bookings" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      {t('nav.myBookings')}
                    </LanguageLink>
                    <LanguageLink href="/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      My Jobs
                    </LanguageLink>
                    <LanguageLink href="/favorites" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      Favorites
                    </LanguageLink>
                    <LanguageLink href="/chat" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      {t('nav.messages')}
                    </LanguageLink>
                  </div>
                )}
                {user?.role === 'PRO' && (
                  <div className="hidden lg:flex items-center gap-2">
                    <LanguageLink href="/pro/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      {t('nav.dashboard')}
                    </LanguageLink>
                    <LanguageLink href="/pro/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      Available Jobs
                    </LanguageLink>
                    <LanguageLink href="/pro/profile" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                      {t('nav.profile')}
                    </LanguageLink>
                  </div>
                )}
                {user?.role === 'ADMIN' && (
                  <LanguageLink href="/admin" className="hidden lg:inline px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                    {t('nav.admin')}
                  </LanguageLink>
                )}

                <button
                  onClick={logout}
                  className="hidden lg:block px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <LanguageLink
                  href="/auth/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {t('nav.login')}
                </LanguageLink>
                <LanguageLink
                  href="/auth/signup"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {t('nav.signup')}
                </LanguageLink>
                <LanguageLink
                  href="/auth/signup?role=PRO"
                  className="hidden md:flex px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition transform hover:scale-105 active:scale-95 items-center gap-2"
                >
                  {t('nav.becomePro')}
                  <ChevronRight className="w-4 h-4" />
                </LanguageLink>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-4 space-y-2">
            {/* Navigation Links */}
            <LanguageLink 
              href="/how-it-works" 
              className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.howItWorks')}
            </LanguageLink>
            <LanguageLink 
              href="/trust-safety" 
              className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.trustSafety')}
            </LanguageLink>

            {isAuthenticated ? (
              <>
                {user?.role === 'CUSTOMER' && (
                  <>
                    <LanguageLink 
                      href="/profile" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </LanguageLink>
                    <LanguageLink 
                      href="/bookings" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.myBookings')}
                    </LanguageLink>
                    <LanguageLink 
                      href="/jobs" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Jobs
                    </LanguageLink>
                    <LanguageLink 
                      href="/favorites" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Favorites
                    </LanguageLink>
                    <LanguageLink 
                      href="/chat" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.messages')}
                    </LanguageLink>
                  </>
                )}
                {user?.role === 'PRO' && (
                  <>
                    <LanguageLink 
                      href="/pro/dashboard" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.dashboard')}
                    </LanguageLink>
                    <LanguageLink 
                      href="/pro/jobs" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Available Jobs
                    </LanguageLink>
                    <LanguageLink 
                      href="/pro/profile" 
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </LanguageLink>
                  </>
                )}
                {user?.role === 'ADMIN' && (
                  <LanguageLink 
                    href="/admin" 
                    className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.admin')}
                  </LanguageLink>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <LanguageLink
                  href="/auth/login"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </LanguageLink>
                <LanguageLink
                  href="/auth/signup"
                  className="block px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.signup')}
                </LanguageLink>
                <LanguageLink
                  href="/auth/signup?role=PRO"
                  className="flex items-center justify-between px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('nav.becomePro')}</span>
                  <ChevronRight className="w-4 h-4" />
                </LanguageLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
