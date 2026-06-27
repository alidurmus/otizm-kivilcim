'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModuleCard from '@/components/ModuleCard';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  route?: string;
}

const modules: Module[] = [
  {
    id: 'literacy',
    title: 'Okuryazarlık Becerileri',
    description: 'Harf tanıma, hece oluşturma ve okuma becerilerini geliştirin',
    icon: '📖',
    isActive: true,
    route: '/exercise/literacy'
  },
  {
    id: 'vocabulary',
    title: 'Anlam ve Kelime Dağarcığı',
    description: 'Kelime hazinesi ve anlam bilgisi geliştirme',
    icon: '🎨',
    isActive: true,
    route: '/exercise/vocabulary'
  },
  {
    id: 'social',
    title: 'Sosyal İletişim',
    description: 'İletişim becerileri ve sosyal etkileşim',
    icon: '💬',
    isActive: true,
    route: '/exercise/social-communication'
  },
  {
    id: 'writing',
    title: 'Yazma ve İfade Etme',
    description: 'Yazma becerileri ve kendini ifade etme',
    icon: '✍️',
    isActive: true,
    route: '/exercise/writing-expression'
  },
  {
    id: 'basic-concepts',
    title: 'Temel Kavramlar',
    description: 'Sayılar, renkler, şekiller gibi temel kavramları öğrenin',
    icon: '💡',
    isActive: true,
    route: '/exercise/basic-concepts'
  },
  {
    id: 'mathematics',
    title: 'Matematik Dünyası',
    description: 'Sayı tanıma, sayma, toplama ve şekil-sayı eşleştirme oyunları',
    icon: '🔢',
    isActive: true,
    route: '/exercise/mathematics'
  },
  {
    id: 'music-room',
    title: 'Müzik Dinleme Odası',
    description: 'Sakinleştirici müzikler, eğitici şarkılar ve doğa sesleri',
    icon: '🎵',
    isActive: true,
    route: '/exercise/music-room'
  },
  {
    id: 'video-room',
    title: 'Video İzleme Odası',
    description: 'Eğitici videolar, sosyal öyküler ve sakinleştirici içerikler',
    icon: '📺',
    isActive: true,
    route: '/exercise/video-room'
  },
  {
    id: 'stories',
    title: 'Hikaye Dinleme',
    description: 'Görsel ve işitsel hikayeler, slide şeklinde hikaye okuma',
    icon: '📚',
    isActive: true,
    route: '/exercise/stories'
  },
  {
    id: 'puzzle',
    title: 'Puzzle Oyunu',
    description: 'Görsel-motor koordinasyon ve problem çözme',
    icon: '🧩',
    isActive: true,
    route: '/exercise/puzzle'
  },
  {
    id: 'alphabet-reading',
    title: 'Alfabe Okuma',
    description: 'Türk alfabesinin 29 harfini öğren, sesli-sessiz harf tanıma',
    icon: '🔤',
    isActive: true,
    route: '/exercise/alphabet-reading'
  },
  {
    id: 'physics',
    title: 'Fizik Dünyası',
    description: 'Hareket, ağırlık, akış ve kuvvetlerle eğlenceli öğrenme',
    icon: '🔬',
    isActive: true,
    route: '/exercise/physics'
  },
  {
    id: 'science',
    title: 'Fen Bilimleri',
    description: 'Doğayı, gökyüzünü ve temel kimya kavramlarını eğlenceli oyunlarla keşfet',
    icon: '🌱',
    isActive: true,
    route: '/exercise/science'
  }
];

export default function ModulesPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // ✅ Hydration-safe: Only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate module counts
  const activeModules = modules.filter(module => module.isActive);
  const upcomingModules = modules.filter(module => !module.isActive);

  const handleModuleClick = async (module: Module) => {
    if (module.isActive && module.route) {
      try {
        await router.push(module.route);
        
        // ✅ Hydration-safe: Only check window on client
        if (isClient) {
          setTimeout(() => {
            const navSuccess = window.location.pathname === module.route;
            
            if (!navSuccess) {
              // Fallback to hard navigation if router failed
              window.location.href = module.route!;
            }
          }, 100);
        }
        
      } catch (_error) {
        // ✅ Hydration-safe: Only use window on client
        if (isClient) {
          window.location.href = module.route!;
        }
      }
    }
  };

  const handleParentPanelClick = () => {
    router.push('/parent');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen soft-gradient-bg transition-colors duration-1000">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={handleBackToHome}
          >
            ← Ana Sayfa
          </Button>
          
          <button
            onClick={handleParentPanelClick}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            aria-label="Ebeveyn Paneli"
          >
            <span role="img" aria-hidden="true" className="text-2xl">⚙️</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 drop-shadow-sm">
            Gelişim Modülleri
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Hangi alanda gelişmek istiyorsun? Aktif modülü seçerek maceraya başla!
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-stretch">
          {modules.map((module, index) => (
            <div 
              key={module.id}
              className="transform transition-all duration-500 animate-slow-slide-up"
              style={isClient ? { animationDelay: `${index * 200}ms` } : undefined}
            >
              <ModuleCard
                title={module.title}
                description={module.description}
                icon={module.icon}
                isActive={module.isActive}
                onClick={() => handleModuleClick(module)}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Status Information */}
        <div className="glass-panel rounded-2xl p-6 max-w-2xl mx-auto text-center premium-shadow">
          <h3 className="text-xl font-bold text-adaptive mb-4">
            🎯 Gelişim Durumun
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800/50 rounded-xl p-4 transition-all duration-300">
              <div className="text-3xl font-extrabold text-green-700 dark:text-green-300">{activeModules.length}</div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">Aktif Modül</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 transition-all duration-300">
              <div className="text-3xl font-extrabold text-slate-500 dark:text-slate-400">{upcomingModules.length}</div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Yakında Gelecek</div>
            </div>
          </div>
          <p className="text-sm text-adaptive-secondary mt-2">
            {activeModules.length > 0 
              ? `${activeModules.length} modül aktif! Herhangi birini seçerek öğrenmeye başlayabilirsin! 🌟`
              : 'Modülleri tamamladıktan sonra yeni maceralara erişim kazanacaksın! 🌟'
            }
          </p>
        </div>

        {/* Voice Assistant Tip */}
        <div className="mt-8 text-center animate-calm-pulse">
          <div className="inline-flex items-center bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 rounded-full px-6 py-3 premium-shadow">
            <div className="text-2xl mr-3 drop-shadow-md">🎙️</div>
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              <strong>İpucu:</strong> Kıvılcım sana yol gösterecek ve her adımda yanında olacak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 