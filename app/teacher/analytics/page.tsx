'use client'

import { useState } from 'react'

// Sample analytics data
const analyticsData = {
  weeklyProgress: [
    { week: 'Hafta 1', totalProgress: 45, voiceInteractions: 89 },
    { week: 'Hafta 2', totalProgress: 52, voiceInteractions: 112 },
    { week: 'Hafta 3', totalProgress: 61, voiceInteractions: 143 },
    { week: 'Hafta 4', totalProgress: 70, voiceInteractions: 178 },
  ],
  modulePerformance: [
    { module: 'Alfabe Okuma', students: 4, avgScore: 85, completion: 90 },
    { module: 'Kelime Dağarcığı', students: 4, avgScore: 78, completion: 85 },
    { module: 'Sosyal İletişim', students: 3, avgScore: 72, completion: 75 },
    { module: 'Matematik Dünyası', students: 3, avgScore: 88, completion: 70 },
    { module: 'Okuryazarlık', students: 4, avgScore: 76, completion: 85 },
    { module: 'Puzzle Oyunu', students: 4, avgScore: 91, completion: 90 },
    { module: 'Temel Kavramlar', students: 4, avgScore: 83, completion: 95 },
    { module: 'Müzik Odası', students: 3, avgScore: 95, completion: 80 },
    { module: 'Video Odası', students: 3, avgScore: 80, completion: 75 },
    { module: 'Yazma ve İfade', students: 2, avgScore: 69, completion: 60 }
  ],
  voiceAnalytics: {
    gülsuUsage: 100,
    averageResponseTime: 285,
    successRate: 99.8,
    totalInteractions: 682,
    weeklyGrowth: 15.2,
    pronunciationImprovement: 12.3
  },
  studentEngagement: [
    { age: 5, engagement: 75, sessions: 12 },
    { age: 6, engagement: 85, sessions: 18 },
    { age: 7, engagement: 90, sessions: 22 },
    { age: 8, engagement: 95, sessions: 28 }
  ]
}

const timeRanges = [
  { value: 'week', label: 'Bu Hafta' },
  { value: 'month', label: 'Bu Ay' },
  { value: 'quarter', label: 'Son 3 Ay' },
  { value: 'year', label: 'Bu Yıl' }
]

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('progress')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İlerleme Analytics</h1>
          <p className="text-gray-600 mt-1">
            Öğrenci performansını ve eğitim sisteminin etkinliğini analiz edin
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
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam İlerleme</p>
              <p className="text-3xl font-bold text-gray-900">70%</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +8% bu hafta
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Öğrenci</p>
              <p className="text-3xl font-bold text-gray-900">4</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <span className="text-sm text-gray-600 mt-1">%100 katılım oranı</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gülsu Etkileşimi</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.voiceAnalytics.totalInteractions}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 4v.01M6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{analyticsData.voiceAnalytics.weeklyGrowth}% bu hafta
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.voiceAnalytics.successRate}%</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Mükemmel performans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Haftalık İlerleme Trendi
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('progress')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === 'progress'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                İlerleme
              </button>
              <button
                onClick={() => setSelectedMetric('voice')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === 'voice'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Ses Etkileşimi
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.weeklyProgress.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{week.week}</span>
                  <span className="text-gray-600">
                    {selectedMetric === 'progress' ? `%${week.totalProgress}` : `${week.voiceInteractions} etkileşim`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      selectedMetric === 'progress' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{ 
                      width: selectedMetric === 'progress' 
                        ? `${week.totalProgress}%` 
                        : `${(week.voiceInteractions / 200) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Analytics Detail */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Gülsu Ses Sistemi Analytics
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  %{analyticsData.voiceAnalytics.gülsuUsage}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Gülsu Voice Kullanımı
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.voiceAnalytics.averageResponseTime}ms
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Ortalama Yanıt Süresi
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">
                  Telaffuz İyileştirmesi
                </span>
                <span className="text-lg font-bold text-purple-600">
                  +{analyticsData.voiceAnalytics.pronunciationImprovement}%
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analyticsData.voiceAnalytics.pronunciationImprovement * 8}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-700 mt-2">
                Eleven Turbo v2.5 model ile SSML + IPA phonetic transcription başarısı
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Perfect Turkish Pronunciation System Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Performance Analysis */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Modül Performans Analizi (10 Aktif Modül)
          </h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Detaylı Rapor →
          </button>
        </div>
        
        <div className="grid gap-4">
          {analyticsData.modulePerformance.map((module, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{module.module}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {module.students} öğrenci
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">%{module.avgScore}</div>
                  <div className="text-sm text-gray-600">Ortalama Başarı</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Başarı Oranı</span>
                    <span className="font-medium">%{module.avgScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        module.avgScore >= 80 ? 'bg-green-500' :
                        module.avgScore >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${module.avgScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tamamlama Oranı</span>
                    <span className="font-medium">%{module.completion}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${module.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Engagement by Age */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Yaş Gruplarına Göre Katılım Analizi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {analyticsData.studentEngagement.map((ageGroup, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <svg className="w-24 h-24 mx-auto" viewBox="0 0 42 42">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${ageGroup.engagement * 100 / 100} ${100 - ageGroup.engagement}`}
                    strokeDashoffset="25"
                    transform="rotate(-90 21 21)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {ageGroup.age}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xl font-bold text-blue-600">
                  %{ageGroup.engagement}
                </div>
                <div className="text-sm text-gray-600">
                  Katılım Oranı
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {ageGroup.sessions} oturum
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-800 mb-2">
            📊 Analiz Özeti:
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 8 yaş grubunda en yüksek katılım (%95)</li>
            <li>• Gülsu voice system tüm yaş gruplarında başarılı</li>
            <li>• Otizm-friendly tasarım yaş grupları arasında tutarlı başarı sağlıyor</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 