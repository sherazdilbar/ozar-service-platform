'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import LanguageLink from '@/components/LanguageLink';
import { Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl">🔧</span>
              </div>
              <div>
                <div className="text-xl font-bold">Ozar</div>
                <div className="text-xs text-gray-400">Find Local Pros</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-bold text-base mb-3">{t('footer.forCustomers')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LanguageLink href="/auth/signup" className="text-gray-400 hover:text-teal-400 transition">
                  {t('nav.signup')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/bookings" className="text-gray-400 hover:text-teal-400 transition">
                  {t('nav.myBookings')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/chat" className="text-gray-400 hover:text-teal-400 transition">
                  {t('nav.messages')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/profile" className="text-gray-400 hover:text-teal-400 transition">
                  {t('nav.profile')}
                </LanguageLink>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="font-bold text-base mb-3">{t('footer.forProfessionals')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LanguageLink href="/auth/signup?role=PRO" className="text-gray-400 hover:text-orange-400 transition">
                  {t('nav.becomePro')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/pro/dashboard" className="text-gray-400 hover:text-orange-400 transition">
                  {t('nav.dashboard')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/pro/profile" className="text-gray-400 hover:text-orange-400 transition">
                  {t('nav.profile')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/pro/services" className="text-gray-400 hover:text-orange-400 transition">
                  Manage Services
                </LanguageLink>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-base mb-3">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <LanguageLink href="/about" className="text-gray-400 hover:text-white transition">
                  {t('footer.aboutUs')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/contact" className="text-gray-400 hover:text-white transition">
                  {t('footer.contact')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/privacy" className="text-gray-400 hover:text-white transition">
                  {t('footer.privacy')}
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/terms" className="text-gray-400 hover:text-white transition">
                  {t('footer.terms')}
                </LanguageLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-400">{t('footer.copyright')}</div>
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            
            {/* Facebook */}
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            
            {/* Instagram */}
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition-colors transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            
            {/* X (Twitter) */}
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-100 transition-colors transform hover:scale-110"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
