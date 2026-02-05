import type { Metadata } from 'next';
import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';
import { SocketProvider } from '../contexts/SocketContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SearchProvider } from '../contexts/SearchContext';
import OnboardingTutorial from '../components/OnboardingTutorial';

// Force dynamic rendering for all pages (required for useSearchParams and other client features)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ozar - Find Local Professionals in Budapest',
  description: 'Connect with verified professionals across Budapest\'s 23 districts. Fast, trusted, quality service for all your home needs.',
  keywords: ['Budapest professionals', 'home services', 'local experts', 'verified pros', 'Budapest districts'],
  authors: [{ name: 'Ozar' }],
  openGraph: {
    title: 'Ozar - Find Local Professionals in Budapest',
    description: 'Connect with verified professionals across Budapest\'s 23 districts',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'hu_HU',
  },
  icons: {
    icon: '/ozar-logo.png',
    shortcut: '/ozar-logo.png',
    apple: '/ozar-logo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="en" href="https://ozar.com" />
        <link rel="alternate" hrefLang="hu" href="https://ozar.com?lang=hu" />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AuthProvider>
                <SocketProvider>
                  <SearchProvider>
                    {children}
                    <OnboardingTutorial />
                  </SearchProvider>
                </SocketProvider>
              </AuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
