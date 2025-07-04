'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function WritingExpressionModulePage() {
  const router = useRouter();

  const handleBackToModules = () => {
    router.push('/modules');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500 text-center px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-adaptive mb-6 animate-fade-in">
        Yazma ve İfade Etme Modülü
      </h1>
      <p className="text-xl text-adaptive-secondary max-w-2xl mx-auto mb-8 animate-slide-up">
        Bu modülün içeriği burada yer alacak.
      </p>
      <Button
        variant="primary"
        size="large"
        onClick={handleBackToModules}
        className="animate-bounce-in"
      >
        Modüllere Geri Dön
      </Button>
    </div>
  );
}
