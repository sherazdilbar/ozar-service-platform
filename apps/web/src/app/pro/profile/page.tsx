'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import ProProfilePageNew from './page-new';

export default function ProProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const useNewDesign = searchParams.get('new') === 'true';

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'PRO') {
    return null;
  }

  // For now, always use the new design
  // Later we can add: return useNewDesign ? <ProProfilePageNew /> : <ProProfilePageOld />;
  return <ProProfilePageNew />;
}
