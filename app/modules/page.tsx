'use client';

import React from 'react';
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
  }
];

export default function ModulesPage() {
  const router = useRouter();

  // Calculate module counts
  const activeModules = modules.filter(module => module.isActive);
  const upcomingModules = modules.filter(module => !module.isActive);

  const handleModuleClick = async (module: Module) => {
    console.log('=== MODULE CLICK DEBUG ===');
    console.log('Module clicked:', module);
    console.log('Module title:', module.title);
    console.log('Module route:', module.route);
    console.log('Module isActive:', module.isActive);
    console.log('Router object:', router);
    console.log('Current pathname:', window.location.pathname);
    
    if (module.isActive && module.route) {
      console.log('✅ Conditions met, attempting navigation...');
      console.log('Navigating to:', module.route);
      
      try {
        console.log('⏱️ Calling router.push...');
        const startTime = Date.now();
        
        await router.push(module.route);
        
        const endTime = Date.now();
        console.log(`✅ router.push completed in ${endTime - startTime}ms`);
        
        // Check if navigation actually happened
        setTimeout(() => {
          console.log('🔍 Post-navigation check:');
          console.log('  Current pathname:', window.location.pathname);
          console.log('  Expected route:', module.route);
          const navSuccess = window.location.pathname === module.route;
          console.log('  Navigation successful:', navSuccess);
          
          if (!navSuccess) {
            console.log('🔄 Router failed, trying hard navigation...');
            window.location.href = module.route!;
          }
        }, 100);
        
      } catch (error) {
        console.error('❌ Router.push failed:', error);
        console.log('🔄 Trying window.location.href instead...');
        window.location.href = module.route!;
      }
    } else {
      console.log('❌ Conditions not met:');
      console.log('  - isActive:', module.isActive);
      console.log('  - route exists:', !!module.route);
    }
    console.log('=== END MODULE CLICK DEBUG ===');
  };

  const handleParentPanelClick = () => {
    router.push('/parent');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500">
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
            className="p-3 rounded-full bg-adaptive shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            aria-label="Ebeveyn Paneli"
          >
            <span role="img" aria-hidden="true" className="text-2xl">⚙️</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-adaptive mb-4">
            Gelişim Modülleri
          </h1>
          <p className="text-lg text-adaptive-secondary max-w-2xl mx-auto">
            Hangi alanda gelişmek istiyorsun? Aktif modülü seçerek maceraya başla!
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {modules.map((module, index) => (
            <div 
              key={module.id}
              className={`transform transition-all duration-500 ${
                index % 2 === 0 ? 'animate-slow-slide-up' : 'animate-slow-slide-up'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
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
        <div className="bg-adaptive bg-opacity-90 rounded-xl p-6 max-w-2xl mx-auto text-center shadow-lg dark:shadow-xl">
          <h3 className="text-xl font-bold text-adaptive mb-3">
            🎯 Gelişim Durumun
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-success-green bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-adaptive">{activeModules.length}</div>
              <div className="text-sm text-adaptive-secondary">Aktif Modül</div>
            </div>
            <div className="bg-neutral-gray rounded-lg p-3">
              <div className="text-2xl font-bold text-adaptive-secondary">{upcomingModules.length}</div>
              <div className="text-sm text-adaptive-secondary">Yakında Gelecek</div>
            </div>
          </div>
          <p className="text-sm text-adaptive-secondary">
            {activeModules.length > 0 
              ? `${activeModules.length} modül aktif! Herhangi birini seçerek öğrenmeye başlayabilirsin! 🌟`
              : 'Modülleri tamamladıktan sonra yeni maceralara erişim kazanacaksın! 🌟'
            }
          </p>
        </div>

        {/* Voice Assistant Tip */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-encourage-orange bg-opacity-30 rounded-full px-6 py-3">
            <div className="text-2xl mr-3">🎙️</div>
            <p className="text-sm font-medium text-adaptive">
              <strong>İpucu:</strong> Kıvılcım sana yol gösterecek ve her adımda yanında olacak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 