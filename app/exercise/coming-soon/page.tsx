'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Yakında Geliyor!
        </h1>
        <p className="text-gray-600 mb-6">
          Bu modül şu anda geliştirilme aşamasında. 
          Çok yakında sizlerle buluşacak!
        </p>
        <Button
          variant="primary"
          onClick={() => router.push('/modules')}
          className="w-full"
        >
          ← Modüllere Dön
        </Button>
      </div>
    </div>
  );
}
