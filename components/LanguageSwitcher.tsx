'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import React, { useTransition, memo } from 'react';

const LanguageSwitcher = memo(function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as any });
    });
  };

  return (
    <div className="flex gap-2 bg-white/80 dark:bg-dark-surface/80 p-1.5 rounded-xl border-2 border-gray-200 dark:border-dark-border shadow-sm">
      <button
        onClick={() => handleLanguageChange('tr')}
        disabled={isPending}
        aria-label="Türkçe diline geç"
        title="Türkçe"
        className={`px-4 py-2 rounded-lg text-sm font-extrabold transition-all duration-300 ${
          locale === 'tr' 
            ? 'bg-focus-blue text-white shadow-sm scale-105' 
            : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border'
        }`}
      >
        🇹🇷 TR
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        aria-label="Switch to English language"
        title="English"
        className={`px-4 py-2 rounded-lg text-sm font-extrabold transition-all duration-300 ${
          locale === 'en' 
            ? 'bg-focus-blue text-white shadow-sm scale-105' 
            : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-border'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
});

export default LanguageSwitcher;
