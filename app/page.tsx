'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import KivilcimIcon from '@/components/KivilcimIcon';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { useElevenLabs } from '@/lib/elevenlabs';

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const router = useRouter();
  const { speak } = useElevenLabs();

  useEffect(() => {
    // Splash screen animasyonu
    const timer = setTimeout(() => {
      setShowContent(true);
      setIsLoading(false);
      // Hoş geldin mesajını otomatik çalma (autoplay policy nedeniyle)
      // Kullanıcı etkileşimi gerekiyor
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const playWelcomeMessage = useCallback(async () => {
    try {
      setHasPlayedWelcome(true);
      await speak("Merhaba! Kıvılcım'a hoş geldin! Birlikte öğrenmeye hazır mısın?", 'sentence');
          } catch (_error) {
              // Welcome message audio failed - continuing without audio
    }
  }, [speak]);

  const handleStartJourney = () => {
    router.push('/modules');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white flex items-center justify-center">
        <div className="text-center animate-slow-slide-up">
          <KivilcimIcon size={150} animate={true} />
          <h1 className="text-4xl font-extrabold text-text-color mt-6 mb-2">
            Kıvılcım
          </h1>
          <p className="text-lg text-gray-600">
            Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
          
          {/* Logo and Title */}
          <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <KivilcimIcon size={200} animate={false} className="mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-adaptive mb-4">
              Kıvılcım
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-adaptive-secondary mb-2">
              Otizm Dostu Öğrenme Platformu
            </p>
          </div>

          {/* Description */}
          <div className={`max-w-2xl transform transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Otizmli çocuklar için özel olarak tasarlanmış, modüler gelişim alanları ile 
              sakin ve öngörülebilir öğrenme deneyimi sunan platformumuzda 
              <strong className="text-text-color"> büyümeye </strong>
              ve 
              <strong className="text-text-color"> öğrenmeye </strong>
              hazır mısın?
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Button 
              variant="primary" 
              size="large"
              onClick={handleStartJourney}
              className="min-w-[200px]"
            >
              🚀 Maceraya Başla
            </Button>
            
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => router.push('/parent')}
              className="min-w-[200px]"
            >
              👨‍👩‍👧‍👦 Ebeveyn Paneli
            </Button>

            <Button 
              variant="secondary" 
              size="large"
              onClick={() => router.push('/teacher')}
              className="min-w-[200px]"
            >
              🎓 Öğretmen Paneli
            </Button>
          </div>

          {/* Admin Panel Link - Only shown in development or for authorized users */}
          <div className={`transform transition-all duration-1000 delay-600 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => router.push('/admin')}
              className="text-sm opacity-70 hover:opacity-100"
            >
              🛠️ Admin Paneli
            </Button>
          </div>

          {/* Voice Features Info */}
          <div className={`transform transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white bg-opacity-60 p-4 rounded-lg shadow-sm max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>🔊</span>
                <span>{hasPlayedWelcome ? 'Hoş geldin mesajını tekrar dinle:' : 'Hoş geldin mesajını dinle:'}</span>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={playWelcomeMessage}
                  className="text-xs"
                >
                  🎵 {hasPlayedWelcome ? 'Tekrar Dinle' : 'Dinle'}
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Powered by ElevenLabs AI - Türkçe doğal ses teknolojisi
              </p>
              {!hasPlayedWelcome && (
                <p className="text-xs text-center text-blue-600 mt-1">
                  💡 Ses sistemini test etmek için butona tıkla!
                </p>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid md:grid-cols-3 gap-6 mt-16 max-w-4xl transform transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold text-text-color mb-2">Modüler Öğrenme</h3>
              <p className="text-sm text-gray-600">
                Okuryazarlık, sosyal iletişim ve daha fazlası
              </p>
            </div>
            
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-text-color mb-2">Kişisel Gelişim</h3>
              <p className="text-sm text-gray-600">
                Her çocuğun ihtiyacına özel tasarım
              </p>
            </div>
            
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-md text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-bold text-text-color mb-2">Duyusal Kontrol</h3>
              <p className="text-sm text-gray-600">
                Kişiselleştirilebilir deneyim ayarları
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
