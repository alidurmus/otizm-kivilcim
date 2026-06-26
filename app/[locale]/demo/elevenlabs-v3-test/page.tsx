'use client';

import React, { useState } from 'react';
import { ArrowLeft, Volume2, Loader2, CheckCircle, AlertCircle, Play, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Yeni Gülsu voice ID ve ElevenLabs v3 configuration
const GULSU_NEW_VOICE = {
  id: 'jbJMQWv1eS4YjQ6PCcn6',
  name: 'Gülsu',
  language: 'tr',
  description: 'Nazik ve sakin kadın sesi - Otizm dostu eğitim'
};

// ElevenLabs v3 (alpha) test konfigürasyonu
const V3_MODELS = [
  'eleven_turbo_v2_5',  // Mevcut
  'eleven_flash_v2_5',  // Mevcut
  'eleven_multilingual_v2',  // Eski
  'eleven_turbo_v3_alpha'  // YENİ V3 ALPHA (varsayımsal)
];

// Türkçe test metinleri - otizm dostu
const TURKISH_TEST_TEXTS = [
  {
    category: 'Basit Kelimeler',
    texts: [
      'Merhaba, ben Gülsu!',
      'Harika çalışıyorsun!',
      'Tebrikler, çok başarılısın!',
      'Birlikte öğrenelim!'
    ]
  },
  {
    category: 'Türkçe Karakterler',
    texts: [
      'Çiçek, ağaç, gökyüzü, şehir',
      'Öğretmen, üzüm, ığdır, İstanbul',
      'Karadeniz, Ağrı, Şırnak, Çanakkale'
    ]
  },
  {
    category: 'Matematik Cümleleri',
    texts: [
      'Bir artı bir eşittir iki',
      'Üç eksi bir eşittir iki',
      'Beş tane elma, dört tane armut',
      'Dokuz artı bir eşittir on'
    ]
  },
  {
    category: 'Sosyal İfadeler',
    texts: [
      'Mutlu hissediyorum, neşeliyim',
      'Lütfen ve teşekkür ederim',
      'Günaydın, iyi akşamlar',
      'Nasılsın? İyiyim, teşekkürler'
    ]
  }
];

interface TestResult {
  text: string;
  model: string;
  success: boolean;
  duration: number;
  error?: string;
  audioUrl?: string;
}

export default function ElevenLabsV3TestPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(V3_MODELS[0]);
  const [selectedText, setSelectedText] = useState(TURKISH_TEST_TEXTS[0].texts[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ElevenLabs v3 (alpha) API çağrısı
  const generateSpeechV3 = async (text: string, model: string) => {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/speech/v3-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: GULSU_NEW_VOICE.id,
          model_id: model,
          language: 'tr',
          voice_settings: {
            stability: 0.8,
            similarity_boost: 0.9,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      return {
        text,
        model,
        success: true,
        duration,
        audioUrl
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        text,
        model,
        success: false,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Test başlat
  const runTest = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateSpeechV3(selectedText, selectedModel);
      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Son 10 test
      
      // Başarılı olursa hemen çal
      if (result.success && result.audioUrl) {
        playAudio(result.audioUrl);
      }
      
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Ses çal
  const playAudio = async (audioUrl: string) => {
    try {
      // Önceki sesi durdur
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback failed');
      };

      await audio.play();
      
    } catch (error) {
      setIsPlaying(false);
      console.error('Audio play error:', error);
    }
  };

  // Ses durdur
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Toplu test - tüm modeller
  const runBatchTest = async () => {
    setIsGenerating(true);
    
    for (const model of V3_MODELS) {
      const result = await generateSpeechV3(selectedText, model);
      setTestResults(prev => [result, ...prev]);
      
      // Modeller arası kısa bir bekleme
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="p-2 hover:bg-white hover:bg-opacity-80 rounded-full transition-colors"
            aria-label="Admin'e dön"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            🚀 ElevenLabs v3 (Alpha) Test - Gülsu Voice
          </h1>
        </div>

        {/* Voice info */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">🎤 Voice ID</h3>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {GULSU_NEW_VOICE.id}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">👤 Voice Name</h3>
              <p className="text-sm">
                {GULSU_NEW_VOICE.name} - {GULSU_NEW_VOICE.description}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">🇹🇷 Language</h3>
              <p className="text-sm">
                Turkish (tr) - 29 harf desteği
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">🧪 Test Kontrolleri</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🤖 Model Seçimi
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {V3_MODELS.map(model => (
                  <option key={model} value={model}>
                    {model} {model.includes('v3') ? '🆕 ALPHA' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Metin Kategorisi
              </label>
              <select
                onChange={(e) => {
                  const categoryIndex = parseInt(e.target.value);
                  setSelectedText(TURKISH_TEST_TEXTS[categoryIndex].texts[0]);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {TURKISH_TEST_TEXTS.map((category, index) => (
                  <option key={index} value={index}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💬 Test Metni
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TURKISH_TEST_TEXTS.find(cat => cat.texts.includes(selectedText))?.texts.map(text => (
                <button
                  key={text}
                  onClick={() => setSelectedText(text)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    selectedText === text
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Input */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ✏️ Özel Metin
            </label>
            <textarea
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Türkçe test metninizi buraya yazın..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={runTest}
              disabled={isGenerating || !selectedText.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              Tek Test Çalıştır
            </button>

            <button
              onClick={runBatchTest}
              disabled={isGenerating || !selectedText.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              Tüm Modelleri Test Et
            </button>

            {isPlaying && (
              <button
                onClick={stopAudio}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="w-5 h-5" />
                Sesi Durdur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">📊 Test Sonuçları</h2>
            
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold">
                          {result.model} {result.model.includes('v3') ? '🆕' : ''}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({result.duration}ms)
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        "{result.text}"
                      </p>
                      
                      {result.error && (
                        <p className="text-sm text-red-600">
                          ❌ {result.error}
                        </p>
                      )}
                    </div>
                    
                    {result.success && result.audioUrl && (
                      <button
                        onClick={() => playAudio(result.audioUrl!)}
                        className="ml-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                        aria-label="Bu sesi çal"
                      >
                        <Volume2 className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 py-8 text-gray-500">
        <p className="text-sm">
          🧪 ElevenLabs v3 (Alpha) Test Suite - Gülsu Voice Turkish Optimization
        </p>
        <p className="text-xs mt-1">
          New Voice ID: {GULSU_NEW_VOICE.id}
        </p>
      </div>
    </div>
  );
} 