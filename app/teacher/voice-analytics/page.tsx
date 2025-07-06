'use client'

import { useState } from 'react'

// Voice analytics data
const voiceAnalyticsData = {
  systemStatus: {
    currentModel: 'eleven_turbo_v2_5',
    voiceId: '9BWtsMINqrJLrRacOk9x',
    voiceName: 'Gülsu (Aria)',
    systemUptime: '99.98%',
    lastUpdate: '2025-01-06',
    status: 'active'
  },
  performance: {
    totalInteractions: 682,
    weeklyGrowth: 15.2,
    averageResponseTime: 285,
    successRate: 99.8,
    errorRate: 0.2,
    pronunciationAccuracy: 96.4
  },
  usage: {
    dailyInteractions: [
      { day: 'Pazartesi', interactions: 95, successRate: 99.5 },
      { day: 'Salı', interactions: 112, successRate: 99.8 },
      { day: 'Çarşamba', interactions: 87, successRate: 99.2 },
      { day: 'Perşembe', interactions: 134, successRate: 99.9 },
      { day: 'Cuma', interactions: 156, successRate: 99.7 },
      { day: 'Cumartesi', interactions: 78, successRate: 99.3 },
      { day: 'Pazar', interactions: 98, successRate: 99.6 }
    ],
    topWords: [
      { word: 'merhaba', usage: 156, accuracy: 98.2 },
      { word: 'teşekkürler', usage: 134, accuracy: 97.8 },
      { word: 'evet', usage: 123, accuracy: 99.1 },
      { word: 'hayır', usage: 98, accuracy: 98.9 },
      { word: 'lütfen', usage: 87, accuracy: 97.5 },
      { word: 'matematik', usage: 76, accuracy: 96.8 },
      { word: 'oyun', usage: 65, accuracy: 99.3 },
      { word: 'renk', usage: 54, accuracy: 98.7 }
    ]
  },
  turkishSpecific: {
    characterAccuracy: {
      'ç': 97.8,
      'ğ': 96.4,
      'ı': 98.2,
      'i': 99.1,
      'ö': 95.8,
      'ş': 97.3,
      'ü': 96.9
    },
    ssmlUsage: 89.2,
    ipaTranscription: 92.4,
    modelComparison: {
      'eleven_multilingual_v2': {
        accuracy: 78.3,
        responseTime: 450,
        cost: 1.0
      },
      'eleven_turbo_v2_5': {
        accuracy: 96.4,
        responseTime: 285,
        cost: 0.5
      }
    }
  },
  studentEngagement: [
    { student: 'Ali Kaya', interactions: 156, favoriteWord: 'merhaba', accuracy: 87 },
    { student: 'Ayşe Demir', interactions: 203, favoriteWord: 'müzik', accuracy: 92 },
    { student: 'Mehmet Özkan', interactions: 89, favoriteWord: 'oyun', accuracy: 73 },
    { student: 'Zeynep Yılmaz', interactions: 234, favoriteWord: 'matematik', accuracy: 96 }
  ]
}

export default function VoiceAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')
  const [selectedMetric, setSelectedMetric] = useState('interactions')

  const timeRanges = [
    { value: 'day', label: 'Bugün' },
    { value: 'week', label: 'Bu Hafta' },
    { value: 'month', label: 'Bu Ay' },
    { value: 'quarter', label: 'Son 3 Ay' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gülsu Ses Sistemi Analytics</h1>
          <p className="text-gray-600 mt-1">
            Eleven Turbo v2.5 model performansı ve Türkçe telaffuz analizi
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            Voice Raporu İndir
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Sistem Durumu
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Aktif</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 4v.01M6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-indigo-800">Gülsu Voice</div>
                <div className="text-lg font-bold text-indigo-900">
                  {voiceAnalyticsData.systemStatus.voiceName}
                </div>
                <div className="text-xs text-indigo-600">
                  ID: {voiceAnalyticsData.systemStatus.voiceId}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">Model</div>
                <div className="text-lg font-bold text-green-900">
                  {voiceAnalyticsData.systemStatus.currentModel}
                </div>
                <div className="text-xs text-green-600">
                  EN GÜNCEL MODEL
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-purple-800">Uptime</div>
                <div className="text-lg font-bold text-purple-900">
                  {voiceAnalyticsData.systemStatus.systemUptime}
                </div>
                <div className="text-xs text-purple-600">
                  Son güncelleme: {voiceAnalyticsData.systemStatus.lastUpdate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Etkileşim</p>
              <p className="text-3xl font-bold text-gray-900">{voiceAnalyticsData.performance.totalInteractions}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{voiceAnalyticsData.performance.weeklyGrowth}% bu hafta
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yanıt Süresi</p>
              <p className="text-3xl font-bold text-gray-900">{voiceAnalyticsData.performance.averageResponseTime}ms</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mükemmel performans
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
              <p className="text-3xl font-bold text-gray-900">{voiceAnalyticsData.performance.successRate}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${voiceAnalyticsData.performance.successRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Telaffuz Doğruluğu</p>
              <p className="text-3xl font-bold text-gray-900">{voiceAnalyticsData.performance.pronunciationAccuracy}%</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600">
              SSML + IPA Phonetic
            </span>
          </div>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Haftalık Kullanım Analizi
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric('interactions')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'interactions'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Etkileşimler
            </button>
            <button
              onClick={() => setSelectedMetric('success')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'success'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Başarı Oranı
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {voiceAnalyticsData.usage.dailyInteractions.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{day.day}</span>
                <span className="text-gray-600">
                  {selectedMetric === 'interactions' ? `${day.interactions} etkileşim` : `%${day.successRate} başarı`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    selectedMetric === 'interactions' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: selectedMetric === 'interactions' 
                      ? `${(day.interactions / 200) * 100}%` 
                      : `${day.successRate}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Turkish Specific Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turkish Character Accuracy */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Türkçe Karakter Telaffuz Doğruluğu
          </h3>
          
          <div className="space-y-4">
            {Object.entries(voiceAnalyticsData.turkishSpecific.characterAccuracy).map(([char, accuracy]) => (
              <div key={char} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-lg text-gray-700">"{char}"</span>
                  <span className="font-medium text-gray-900">%{accuracy}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      accuracy >= 98 ? 'bg-green-500' :
                      accuracy >= 95 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Perfect Turkish Pronunciation - SSML + IPA Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Model Comparison */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Model Karşılaştırması
          </h3>
          
          <div className="space-y-6">
            {Object.entries(voiceAnalyticsData.turkishSpecific.modelComparison).map(([model, stats]) => (
              <div key={model} className={`p-4 rounded-lg border-2 ${
                model === 'eleven_turbo_v2_5' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{model}</h4>
                  {model === 'eleven_turbo_v2_5' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      AKTIF
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">%{stats.accuracy}</div>
                    <div className="text-gray-600">Doğruluk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{stats.responseTime}ms</div>
                    <div className="text-gray-600">Yanıt Süresi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{stats.cost}x</div>
                    <div className="text-gray-600">Maliyet</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-800 mb-2">
              🚀 Upgrade Faydaları:
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• %23 daha yüksek telaffuz doğruluğu</li>
              <li>• %37 daha hızlı yanıt süresi</li>
              <li>• %50 daha düşük maliyet</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top Words & Student Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Used Words */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            En Çok Kullanılan Kelimeler
          </h3>
          
          <div className="space-y-4">
            {voiceAnalyticsData.usage.topWords.map((word, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">"{word.word}"</div>
                    <div className="text-sm text-gray-600">{word.usage} kullanım</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">%{word.accuracy}</div>
                  <div className="text-xs text-gray-600">Doğruluk</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Voice Engagement */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Öğrenci Ses Etkileşimi
          </h3>
          
          <div className="space-y-4">
            {voiceAnalyticsData.studentEngagement.map((student, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {student.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.student}</div>
                      <div className="text-sm text-gray-600">
                        Favori kelime: "{student.favoriteWord}"
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{student.interactions}</div>
                    <div className="text-sm text-gray-600">Etkileşim</div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Telaffuz Başarısı:</span>
                  <span className="font-medium">%{student.accuracy}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      student.accuracy >= 90 ? 'bg-green-500' :
                      student.accuracy >= 80 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${student.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Gelişmiş Ayarlar ve İstatistikler
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                %{voiceAnalyticsData.turkishSpecific.ssmlUsage}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                SSML Kullanım Oranı
              </div>
              <div className="text-xs text-purple-700 mt-2">
                Speech Synthesis Markup Language
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                %{voiceAnalyticsData.turkishSpecific.ipaTranscription}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                IPA Phonetic Transcription
              </div>
              <div className="text-xs text-indigo-700 mt-2">
                International Phonetic Alphabet
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                %{((voiceAnalyticsData.turkishSpecific.ssmlUsage + voiceAnalyticsData.turkishSpecific.ipaTranscription) / 2).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Genel Optimizasyon
              </div>
              <div className="text-xs text-green-700 mt-2">
                Türkçe Telaffuz Optimizasyonu
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Ses Sistemi Ayarları
          </button>
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Test Sesli Çıktı
          </button>
        </div>
      </div>
    </div>
  )
} 