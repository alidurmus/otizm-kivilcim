'use client';

import React, { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SingleLetterPlayer from '@/components/SingleLetterPlayer';

export default function SingleLetterDemoPage() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [vowelCount, setVowelCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/modules')}
            className="p-2 hover:bg-white hover:bg-opacity-80 rounded-full transition-colors"
            aria-label="Geri dön"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            🎵 Tek Harf Oynatıcı Demo
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">
            📋 Nasıl Kullanılır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p>✨ <strong>Harf Seçin:</strong> Istediğiniz harfe tıklayın</p>
              <p>🔊 <strong>Oynatın:</strong> Yeşil oynat butonuna basın</p>
              <p>🟣 <strong>Sesli Harfler:</strong> Mor renkte görünür</p>
            </div>
            <div className="space-y-2">
              <p>🔵 <strong>Sessiz Harfler:</strong> Mavi renkte görünür</p>
              <p>⏸️ <strong>Durdurun:</strong> Oynatma sırasında butona tekrar basın</p>
              <p>🎯 <strong>Seçili Harf:</strong> Daha koyu renkte gösterilir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo - Büyük boyut, manuel oynatma */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">
          🎯 Ana Demo - Manuel Oynatma
        </h2>
        <SingleLetterPlayer
          size="large"
          autoPlay={false}
          onLetterChange={(letter) => setSelectedLetter(letter)}
          onVowelSelected={() => setVowelCount(prev => prev + 1)}
        />
        
        <div className="mt-4 text-center text-lg">
          <span className="bg-white px-4 py-2 rounded-lg shadow">
            📍 Seçili Harf: <strong className="text-purple-600">{selectedLetter}</strong>
            {vowelCount > 0 && (
              <span className="ml-3 text-purple-500">
                🎵 {vowelCount} sesli harf seçtiniz!
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Demo - Orta boyut, otomatik oynatma */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-lg font-bold mb-4 text-center">
          ⚡ Otomatik Oynatma Demo
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <Volume2 className="w-4 h-4 inline mr-1" />
            Bu demoda harfe tıkladığınız anda otomatik olarak ses çalar!
          </p>
        </div>
        <SingleLetterPlayer
          size="medium"
          autoPlay={true}
          initialLetter="M"
        />
      </div>

      {/* Demo - Küçük boyut, kompakt */}
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-lg font-bold mb-4 text-center">
          📱 Kompakt Versiyon
        </h2>
        <SingleLetterPlayer
          size="small"
          autoPlay={false}
          initialLetter="Z"
        />
      </div>

      {/* Kod örnekleri */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            💻 Kod Örnekleri
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">1. Temel Kullanım:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                {`<SingleLetterPlayer />`}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">2. Otomatik Oynatma:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                {`<SingleLetterPlayer 
  autoPlay={true} 
  initialLetter="A" 
  size="large" 
/>`}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">3. Callback'lerle:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                {`<SingleLetterPlayer 
  onLetterChange={(letter) => console.log(letter)}
  onVowelSelected={(vowel) => alert(\`\${vowel} sesli harf!\`)}
/>`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 py-8 text-gray-500">
        <p className="text-sm">
          🎵 Kıvılcım Platform - 29 Türk Harfi Ses Sistemi
        </p>
        <p className="text-xs mt-1">
          Gülsu Voice ile optimize edilmiş otizm dostu eğitim deneyimi
        </p>
      </div>
    </div>
  );
} 