'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface ProgressData {
  module: string;
  completed: number;
  total: number;
  lastAccess: string;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
  date: string;
}

const mockProgressData: ProgressData[] = [
  {
    module: 'Okuryazarlık Becerileri',
    completed: 3,
    total: 5,
    lastAccess: '2 saat önce'
  }
];

const mockAchievements: Achievement[] = [
  {
    title: 'İlk Hece',
    description: 'İlk hece oluşturuldu!',
    icon: '🎯',
    date: '2 saat önce'
  },
  {
    title: 'Süreklilik',
    description: '5 doğru cevap üst üste',
    icon: '⭐',
    date: 'Dün'
  },
  {
    title: 'Odaklanma',
    description: '10 dakika odaklanma',
    icon: '🎯',
    date: '3 gün önce'
  }
];

export default function ParentPanelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'settings'>('overview');

  const handleSensorySettings = () => {
    router.push('/sensory-settings');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div 
          data-testid="stat-exercises"
          className="bg-white rounded-xl p-4 md:p-6 text-center shadow-lg border border-gray-100"
        >
          <div className="text-2xl md:text-3xl font-bold text-focus-blue mb-2">3/5</div>
          <div className="text-xs md:text-sm text-gray-600">Tamamlanan Egzersizler</div>
        </div>
        
        <div 
          data-testid="stat-success"
          className="bg-white rounded-xl p-4 md:p-6 text-center shadow-lg border border-gray-100"
        >
          <div className="text-2xl md:text-3xl font-bold text-success-green mb-2">85%</div>
          <div className="text-xs md:text-sm text-gray-600">Başarı Oranı</div>
        </div>
        
        <div 
          data-testid="stat-activity"
          className="bg-white rounded-xl p-4 md:p-6 text-center shadow-lg border border-gray-100"
        >
          <div className="text-2xl md:text-3xl font-bold text-encourage-orange mb-2">4 gün</div>
          <div className="text-xs md:text-sm text-gray-600">Haftalık Aktivite</div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
        <h3 className="text-lg md:text-xl font-bold text-text-color mb-4">🏆 Son Başarılar</h3>
        <div className="space-y-3">
          {mockAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-success-green bg-opacity-10 rounded-lg">
              <div className="text-xl md:text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="text-sm md:text-base font-semibold text-text-color">{achievement.title}</div>
                <div className="text-xs md:text-sm text-gray-600">{achievement.description}</div>
              </div>
              <div className="text-xs text-gray-500">{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New Adventures */}
      <div className="bg-gradient-to-r from-encourage-orange to-yellow-300 bg-opacity-30 rounded-xl p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-text-color mb-4">🚀 Yeni Maceralar</h3>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          Çocuğunuz okuryazarlık modülünde harika ilerliyor! Yakında yeni modüller açılacak.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white bg-opacity-50 rounded-lg p-3 text-center flex-1">
            <div className="text-lg font-bold">📚</div>
            <div className="text-xs">Kelime Dağarcığı</div>
            <div className="text-xs text-gray-600">%60 tamamlandığında</div>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3 text-center flex-1">
            <div className="text-lg font-bold">💬</div>
            <div className="text-xs">Sosyal İletişim</div>
            <div className="text-xs text-gray-600">%80 tamamlandığında</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-text-color mb-6">📊 Haftalık Aktivite</h3>
        <p className="text-gray-600 mb-4">Son 7 günün aktivite grafiği</p>
        <div className="flex justify-between items-end h-32 space-x-2">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => {
            const heights = [60, 80, 45, 90, 70, 30, 55];
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-focus-blue rounded-t w-full transition-all duration-1000 ease-out"
                  style={{ height: `${heights[index]}%` }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-text-color mb-4">📚 Modül İlerlemesi</h3>
        {mockProgressData.map((data, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{data.module}</span>
              <span className="text-sm text-gray-600">Tamamlandı: {data.completed}/{data.total}</span>
            </div>
            <div className="w-full bg-neutral-gray rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-focus-blue to-success-green h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(data.completed / data.total) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Son erişim: {data.lastAccess}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Sensory Control */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-text-color mb-4">🎛️ Duyusal Kontroller</h3>
        <p className="text-gray-600 mb-4">
          Çocuğunuzun duyusal ihtiyaçlarına göre uygulamayı kişiselleştirin.
        </p>
        <Button
          variant="primary"
          size="medium"
          onClick={handleSensorySettings}
        >
          Duyusal Ayarları Aç
        </Button>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-text-color mb-4">👤 Hesap Ayarları</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span>Bildirimler</span>
            <button 
              role="switch" 
              aria-checked="true"
              className="w-12 h-6 bg-focus-blue rounded-full relative"
            >
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span>Gizlilik Modu</span>
            <button 
              role="switch" 
              aria-checked="false"
              className="w-12 h-6 bg-gray-300 rounded-full relative"
            >
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-text-color mb-4">💌 Geri Bildirim</h3>
        <p className="text-gray-600 mb-4">
          Deneyiminizi bizimle paylaşın ve uygulamayı daha da iyileştirelim.
        </p>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => router.push('/feedback')}
        >
          Geri Bildirim Gönder
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => router.push('/')}
          >
            ← Ana Sayfa
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-color">
            👨‍👩‍👧‍👦 Ebeveyn Paneli
          </h1>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg flex space-x-1">
            {[
              { key: 'overview', label: '📊 Genel Bakış', icon: '📊' },
              { key: 'progress', label: '📈 İlerleme', icon: '📈' },
              { key: 'settings', label: '⚙️ Ayarlar', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-focus-blue text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xl">{tab.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'progress' && renderProgress()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.push('/modules')}
              className="w-14 h-14 bg-focus-blue text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              title="Modüllere Git"
            >
              📚
            </button>
            <button
              onClick={handleSensorySettings}
              className="w-14 h-14 bg-encourage-orange text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              title="Duyusal Ayarlar"
            >
              🔧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 