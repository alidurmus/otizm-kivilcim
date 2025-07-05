'use client';

import { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

// Types for ElevenLabs admin test page
interface VoiceInfo {
  id: string;
  name: string;
  description: string;
  language?: string;
}

interface VoiceTestResult {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  type: 'letter' | 'word' | 'sentence' | 'celebration';
  duration?: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

interface ElevenLabsStatus {
  apiKeyConfigured: boolean;
  sdkInitialized: boolean;
  lastTestSuccess: boolean;
  userInfo?: {
    name: string;
    email: string;
    tier: string;
  };
}

export default function ElevenLabsTestPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('');
  const [testType, setTestType] = useState<'letter' | 'word' | 'sentence' | 'celebration'>('letter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState<VoiceTestResult[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [voiceId, setVoiceId] = useState('');
  const [apiStatus, setApiStatus] = useState<ElevenLabsStatus | null>(null);

  const { speak, getVoices, testVoice, getApiStatus, getTestTexts } = useElevenLabs();

  // Filter voices by gender
  const filteredVoices = voices.filter(voice => {
    if (genderFilter === 'all') return true;
    return voice.gender === genderFilter;
  });

  // Get test text suggestions based on type
  const getTestSuggestions = () => {
    const testTexts = getTestTexts();
    return testTexts[testType] || [];
  };

  // Update voice selection when filter changes
  useEffect(() => {
    if (voices.length > 0) {
      const filtered = filteredVoices;
      if (filtered.length > 0 && (!voiceId || !filtered.find(v => v.id === voiceId))) {
        setVoiceId(filtered[0].id);
      }
    }
  }, [voices, genderFilter, filteredVoices, voiceId]);

  useEffect(() => {
    loadVoices();
    loadApiStatus();
  }, []);

  const loadVoices = async () => {
    try {
      const voiceList = await getVoices();
      console.log('Loaded voices:', voiceList); // Debug log
      
      // getVoices now returns an array directly
      if (Array.isArray(voiceList) && voiceList.length > 0) {
        setVoices(voiceList);
        setVoiceId(voiceList[0].id);
        console.log('Voice selection updated:', voiceList[0].id);
      } else {
        console.warn('No voices found in response:', voiceList);
        setVoices([]); // Fallback to empty array
        setError('Ses listesi boş. API anahtarını kontrol edin.');
      }
    } catch (err) {
      console.error('Voices loading error:', err);
      setVoices([]); // Ensure voices is always an array
      setError('Ses listesi yüklenirken hata oluştu. API bağlantısını kontrol edin.');
    }
  };

  const loadApiStatus = async () => {
    try {
      const status = await getApiStatus();
      setApiStatus(status);
    } catch (err) {
      console.error('API status loading error:', err);
    }
  };

  const handleTest = async () => {
    if (!testText.trim()) {
      setError('Lütfen test metni girin');
      return;
    }

    setLoading(true);
    setError('');
    setIsPlaying(true);

    try {
      // Ses çalma testi
      await speak(testText, testType, voiceId);
      
      // Detaylı test sonucu
      const testResult = await testVoice(testText, voiceId, testType);
      
      // Create a properly formatted test result
      const formattedResult: VoiceTestResult = {
        id: Date.now().toString(),
        text: testText,
        voiceId: voiceId,
        voiceName: voices.find(v => v.id === voiceId)?.name || 'Unknown Voice',
        type: testType,
        duration: testResult.duration || 0,
        success: testResult.success,
        error: testResult.error,
        timestamp: new Date()
      };
      
      setTestResults(prev => [formattedResult, ...prev.slice(0, 9)]); // Son 10 test sonucu
      
    } catch (err) {
      setError(`Test hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      console.error('Test error:', err);
      
      // Add failed test result
      const failedResult: VoiceTestResult = {
        id: Date.now().toString(),
        text: testText,
        voiceId: voiceId,
        voiceName: voices.find(v => v.id === voiceId)?.name || 'Unknown Voice',
        type: testType,
        duration: 0,
        success: false,
        error: err instanceof Error ? err.message : 'Bilinmeyen hata',
        timestamp: new Date()
      };
      
      setTestResults(prev => [failedResult, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
      setIsPlaying(false);
    }
  };

  const testTexts = getTestTexts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎙️ ElevenLabs API Test Merkezi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Resmi SDK ile gelişmiş ses testi ve analiz
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <a 
              href="https://elevenlabs.io/docs/api-reference/introduction" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              📚 ElevenLabs API Referansı
            </a>
          </div>
        </div>

        {/* API Status Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            📊 API Durumu
          </h2>
          {apiStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">API Key</div>
                <div className={`text-lg font-semibold ${apiStatus.apiKeyConfigured ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus.apiKeyConfigured ? '✅ Yapılandırılmış' : '❌ Yapılandırılmamış'}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">SDK</div>
                <div className={`text-lg font-semibold ${apiStatus.sdkInitialized ? 'text-green-600' : 'text-yellow-600'}`}>
                  {apiStatus.sdkInitialized ? '✅ Başlatılmış' : '⚠️ Fallback Mode'}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">Son Test</div>
                <div className={`text-lg font-semibold ${apiStatus.lastTestSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus.lastTestSuccess ? '✅ Başarılı' : '❌ Başarısız'}
                </div>
              </div>
            </div>
          )}
          
          {apiStatus?.userInfo && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                👤 Kullanıcı Bilgileri
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <div>Ad: {apiStatus.userInfo.name}</div>
                <div>Email: {apiStatus.userInfo.email}</div>
                <div>Tier: {apiStatus.userInfo.tier}</div>
              </div>
            </div>
          )}
        </div>

        {/* Test Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            🧪 Ses Testi
          </h2>
          
          <div className="space-y-4">
            {/* Test Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Test Türü
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'letter', label: 'Harf', icon: '🔤', desc: 'Tek harf sesleri' },
                  { value: 'word', label: 'Kelime', icon: '📝', desc: 'Basit kelimeler' },
                  { value: 'sentence', label: 'Cümle', icon: '💬', desc: 'Tam cümleler' },
                  { value: 'celebration', label: 'Kutlama', icon: '🎉', desc: 'Tebrik mesajları' }
                ].map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => setTestType(value as any)}
                    className={`p-3 text-center rounded-lg text-sm font-medium transition-all duration-200 ${
                      testType === value
                        ? 'bg-green-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-50 border border-gray-200'
                    }`}
                  >
                    <div className="text-lg">{icon}</div>
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs opacity-75">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Text with Turkish Examples */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ✏️ Test Metni (Türkçe Karakterler Desteklenir)
              </label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder={`${testType === 'letter' ? 'Örn: Ç, Ğ, Ş' : 
                             testType === 'word' ? 'Örn: çilek, üzüm, ğöl' :
                             testType === 'sentence' ? 'Örn: Türkçe öğrenmek çok güzel.' :
                             'Örn: Aferin sana!'}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
              />
              
              {/* Quick Test Suggestions */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  🚀 Hızlı Test Örnekleri:
                </label>
                <div className="flex flex-wrap gap-2">
                  {getTestSuggestions().slice(0, 8).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setTestText(suggestion)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gender Filter Interface */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                👥 Cinsiyet Filtresi
                <span className="ml-2 text-sm text-gray-600">({filteredVoices.length} ses mevcut)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Tümü', icon: '👥' },
                  { value: 'male', label: 'Erkek', icon: '👨' },
                  { value: 'female', label: 'Bayan', icon: '👩' }
                ].map(({ value, label, icon }) => {
                  const count = value === 'all' ? voices.length : voices.filter(v => v.gender === value).length;
                  return (
                    <button
                      key={value}
                      onClick={() => setGenderFilter(value as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        genderFilter === value
                          ? 'bg-blue-500 text-white shadow-md scale-105'
                          : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {icon} {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Voice Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎤 Ses Seçimi (Türkçe Destekli)
              </label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Ses seçin...</option>
                {filteredVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.gender === 'male' ? '👨' : '👩'} {voice.name} - {voice.description}
                  </option>
                ))}
              </select>
              {filteredVoices.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Seçilen filtrede ses bulunamadı.
                </p>
              )}
            </div>

            {/* Test Button */}
            <button
              onClick={handleTest}
              disabled={loading || isPlaying}
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                loading || isPlaying
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {loading ? '⏳ Test Ediliyor...' : isPlaying ? '🔊 Oynatılıyor...' : '🎯 Test Et'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              📈 Test Sonuçları
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Zaman</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Ses</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Tür</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Metin</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Süre</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {testResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.timestamp && result.timestamp instanceof Date 
                          ? result.timestamp.toLocaleTimeString()
                          : 'Unknown Time'
                        }
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.voiceName}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.type}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200 max-w-xs truncate">
                        {result.text}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.duration || 0}ms
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.success 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {result.success ? '✅ Başarılı' : '❌ Başarısız'}
                        </span>
                        {result.error && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {result.error}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 