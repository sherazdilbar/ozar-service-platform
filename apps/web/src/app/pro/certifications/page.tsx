'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Upload, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function ProCertificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Award className="w-8 h-8 text-teal-600" />
            Certifications & Credentials
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your professional certifications to build trust with customers
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No certifications yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your professional certificates, licenses, and credentials
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition">
            <Plus className="w-5 h-5" />
            Add Certification
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
