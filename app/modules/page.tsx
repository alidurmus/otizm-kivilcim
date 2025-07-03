'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ModuleCard from '@/components/ModuleCard';
import Button from '@/components/Button';

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
    isActive: false
  },
  {
    id: 'social',
    title: 'Sosyal İletişim',
    description: 'İletişim becerileri ve sosyal etkileşim',
    icon: '💬',
    isActive: false
  },
  {
    id: 'writing',
    title: 'Yazma ve İfade Etme',
    description: 'Yazma becerileri ve kendini ifade etme',
    icon: '✍️',
    isActive: false
  }
];

export default function ModulesPage() {
  const router = useRouter();

  const handleModuleClick = (module: Module) => {
    if (module.isActive && module.route) {
      router.push(module.route);
    }
  };

  const handleParentPanelClick = () => {
    router.push('/parent');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white">
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
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            title="Ebeveyn Paneli"
          >
            <div className="text-2xl">⚙️</div>
          </button>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-color mb-4">
            Gelişim Modülleri
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
        <div className="bg-white bg-opacity-80 rounded-xl p-6 max-w-2xl mx-auto text-center shadow-lg">
          <h3 className="text-xl font-bold text-text-color mb-3">
            🎯 Gelişim Durumun
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-success-green bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-text-color">1</div>
              <div className="text-sm text-gray-600">Aktif Modül</div>
            </div>
            <div className="bg-neutral-gray rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-500">3</div>
              <div className="text-sm text-gray-500">Yakında Gelecek</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Okuryazarlık modülünü tamamladıktan sonra yeni maceralara erişim kazanacaksın! 🌟
          </p>
        </div>

        {/* Voice Assistant Tip */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-encourage-orange bg-opacity-30 rounded-full px-6 py-3">
            <div className="text-2xl mr-3">🎙️</div>
            <p className="text-sm font-medium text-text-color">
              <strong>İpucu:</strong> Kıvılcım sana yol gösterecek ve her adımda yanında olacak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 