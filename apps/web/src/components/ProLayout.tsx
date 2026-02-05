'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProSidebar from '@/components/ProSidebar';

interface ProLayoutProps {
  children: ReactNode;
}

export default function ProLayout({ children }: ProLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <ProSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
