'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg flex items-center justify-center p-4 transition-colors duration-500">
      <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 max-w-md w-full text-center transition-colors duration-500">
        <div className="text-6xl mb-4 animate-gentle-bounce">🚧</div>
        <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-4">
          Yakında Geliyor!
        </h1>
        <p className="text-lg text-gray-600 dark:text-dark-text-secondary mb-6 leading-relaxed">
          Bu modül şu anda geliştirilme aşamasında. 
          Çok yakında sizlerle buluşacak!
        </p>
        <Button
          variant="secondary"
          onClick={() => router.push('/modules')}
          className="w-full"
        >
          ← Modüllere Dön
        </Button>
      </div>
    </div>
  );
}
