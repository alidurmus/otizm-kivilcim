'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from '@/i18n/routing';
import KivilcimIcon from '@/components/KivilcimIcon';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useElevenLabs } from '@/lib/elevenlabs';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Index');
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Navigation');
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
      <div className="min-h-screen soft-gradient-bg flex items-center justify-center">
        <div className="text-center animate-slow-slide-up">
          <KivilcimIcon size={150} animate={true} />
          <h1 className="text-4xl font-extrabold text-adaptive mt-6 mb-2">
            Kıvılcım
          </h1>
          <p className="text-lg text-adaptive-secondary">
            Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen soft-gradient-bg transition-colors duration-1000">
      {/* Theme and Language Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex gap-4 items-center">
        <LanguageSwitcher />
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
          
          {/* Logo and Title */}
          <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <KivilcimIcon size={200} animate={false} className="mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-adaptive mb-4">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-adaptive-secondary mb-2">
              Otizm Dostu Öğrenme Platformu
            </p>
          </div>

          {/* Description */}
          <div className={`max-w-2xl transform transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-lg text-adaptive-secondary leading-relaxed mb-8">
              {t('description')}
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
              🚀 {tNav('modules')}
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
            <div className="glass-panel p-6 rounded-[2rem] premium-shadow max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                <span className="text-xl">🔊</span>
                <span className="font-medium">{hasPlayedWelcome ? 'Hoş geldin mesajını tekrar dinle:' : 'Hoş geldin mesajını dinle:'}</span>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={playWelcomeMessage}
                  className="text-xs"
                >
                  🎵 {hasPlayedWelcome ? 'Tekrar Dinle' : 'Dinle'}
                </Button>
              </div>
              <p className="text-xs text-center text-adaptive-secondary mt-2 opacity-80">
                Powered by ElevenLabs AI - Türkçe doğal ses teknolojisi
              </p>
              {!hasPlayedWelcome && (
                <p className="text-xs text-center text-blue-600 dark:text-blue-400 mt-1">
                  💡 Ses sistemini test etmek için butona tıkla!
                </p>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid md:grid-cols-3 gap-8 mt-20 max-w-5xl transform transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="glass-panel p-8 rounded-[2rem] premium-shadow text-center transition-transform duration-500 hover:-translate-y-2">
              <div className="text-4xl mb-4 drop-shadow-md">📚</div>
              <h3 className="text-lg font-bold text-adaptive mb-2">Modüler Öğrenme</h3>
              <p className="text-sm text-adaptive-secondary">
                Okuryazarlık, sosyal iletişim ve daha fazlası
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-[2rem] premium-shadow text-center transition-transform duration-500 hover:-translate-y-2">
              <div className="text-4xl mb-4 drop-shadow-md">🎯</div>
              <h3 className="text-lg font-bold text-adaptive mb-2">Kişisel Gelişim</h3>
              <p className="text-sm text-adaptive-secondary">
                Her çocuğun ihtiyacına özel tasarım
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-[2rem] premium-shadow text-center transition-transform duration-500 hover:-translate-y-2">
              <div className="text-4xl mb-4 drop-shadow-md">🔧</div>
              <h3 className="text-lg font-bold text-adaptive mb-2">Duyusal Kontrol</h3>
              <p className="text-sm text-adaptive-secondary">
                Kişiselleştirilebilir deneyim ayarları
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
