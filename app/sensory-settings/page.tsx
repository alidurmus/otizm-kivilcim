'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface SensorySettings {
  theme: 'calm' | 'focus' | 'high-contrast';
  soundEnabled: boolean;
  animationEnabled: boolean;
  fontFamily: 'nunito' | 'opendyslexic';
}

export default function SensorySettingsPage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState<SensorySettings>({
    theme: 'calm',
    soundEnabled: true,
    animationEnabled: true,
    fontFamily: 'nunito'
  });

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label 
  }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void; 
    label: string; 
  }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-100">
      <span className="font-medium text-text-color">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
          enabled ? 'bg-focus-blue' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${
            enabled ? 'right-0.5' : 'left-0.5'
          }`}
        />
      </button>
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
            onClick={() => router.push('/parent')}
          >
            ← Ebeveyn Paneli
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-color text-center">
            🔧 Duyusal Kontrol Paneli
          </h1>
          
          <div className="w-20"></div>
        </div>

        {/* Settings Content */}
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Theme Settings */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-text-color mb-6">🎨 Tema Ayarları</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { key: 'calm', name: 'Sakin Mod', desc: 'Yumuşak renkler ve sakin animasyonlar' },
                { key: 'focus', name: 'Odak Modu', desc: 'Minimal tasarım ve güçlü kontrastlar' },
                { key: 'high-contrast', name: 'Yüksek Kontrast', desc: 'Siyah-beyaz ve yüksek görünürlük' }
              ].map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => setSettings(prev => ({ ...prev, theme: theme.key as any }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    settings.theme === theme.key
                      ? 'border-focus-blue bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{theme.name}</div>
                  <p className="text-sm text-gray-600">{theme.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Visual Settings */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-text-color mb-6">🔊 Ses ve Görsel Ayarlar</h3>
            <div className="space-y-2">
              <ToggleSwitch
                enabled={settings.soundEnabled}
                onChange={(value) => setSettings(prev => ({ ...prev, soundEnabled: value }))}
                label="Ses Efektleri"
              />
              <ToggleSwitch
                enabled={settings.animationEnabled}
                onChange={(value) => setSettings(prev => ({ ...prev, animationEnabled: value }))}
                label="Animasyonlar"
              />
            </div>
          </div>

          {/* Font Settings */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-text-color mb-6">📝 Yazı Tipi</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { key: 'nunito', name: 'Nunito (Varsayılan)', desc: 'Yuvarlak ve sıcak' },
                { key: 'opendyslexic', name: 'OpenDyslexic', desc: 'Okuma güçlüğü için özel' }
              ].map((font) => (
                <button
                  key={font.key}
                  onClick={() => setSettings(prev => ({ ...prev, fontFamily: font.key as any }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    settings.fontFamily === font.key
                      ? 'border-focus-blue bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{font.name}</div>
                  <p className="text-sm text-gray-600">{font.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="large"
              onClick={() => setSettings({ theme: 'calm', soundEnabled: true, animationEnabled: true, fontFamily: 'nunito' })}
            >
              🔄 Varsayılana Sıfırla
            </Button>
            
            <Button
              variant="primary"
              size="large"
              onClick={() => router.push('/modules')}
            >
              ✅ Kaydet ve Devam Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 