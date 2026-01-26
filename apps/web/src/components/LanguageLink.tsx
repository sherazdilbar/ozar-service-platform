'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ComponentProps } from 'react';

type LanguageLinkProps = ComponentProps<typeof Link>;

export default function LanguageLink({ href, ...props }: LanguageLinkProps) {
  const { language } = useLanguage();
  
  // Add ?lang=hu to href if Hungarian is selected
  const localizedHref = typeof href === 'string' 
    ? language === 'hu' 
      ? href.includes('?') 
        ? `${href}&lang=hu` 
        : `${href}?lang=hu`
      : href
    : href;
  
  return <Link href={localizedHref} {...props} />;
}
