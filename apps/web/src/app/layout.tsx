import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';
import { SocketProvider } from '../contexts/SocketContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import OnboardingTutorial from '../components/OnboardingTutorial';

export const metadata: Metadata = {
  title: 'Ozar - Find Local Professionals',
  description: 'Connect with trusted local professionals for all your home service needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" hreflang="en" href="https://ozar.com" />
        <link rel="alternate" hreflang="hu" href="https://ozar.com?lang=hu" />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AuthProvider>
                <SocketProvider>
                  {children}
                  <OnboardingTutorial />
                </SocketProvider>
              </AuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
