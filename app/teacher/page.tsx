'use client'

import { useState, useEffect } from 'react'

// Sample data - gerçek projede Firebase'den gelecek
const mockStudentData = [
  {
    id: 1,
    name: 'Ali Kaya',
    age: 6,
    lastActive: '2025-01-06',
    totalProgress: 78,
    completedModules: 7,
    favoriteModule: 'Alfabe Okuma',
    voiceInteractions: 156,
    preferredVoice: 'Gülsu'
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    age: 7,
    lastActive: '2025-01-05',
    totalProgress: 65,
    completedModules: 6,
    favoriteModule: 'Kelime Dağarcığı',
    voiceInteractions: 203,
    preferredVoice: 'Gülsu'
  },
  {
    id: 3,
    name: 'Mehmet Özkan',
    age: 5,
    lastActive: '2025-01-06',
    totalProgress: 45,
    completedModules: 4,
    favoriteModule: 'Temel Kavramlar',
    voiceInteractions: 89,
    preferredVoice: 'Gülsu'
  },
  {
    id: 4,
    name: 'Zeynep Yılmaz',
    age: 8,
    lastActive: '2025-01-04',
    totalProgress: 92,
    completedModules: 9,
    favoriteModule: 'Matematik Dünyası',
    voiceInteractions: 234,
    preferredVoice: 'Gülsu'
  }
]

const moduleStats = [
  { name: 'Alfabe Okuma', completions: 8, avgScore: 85, color: 'bg-blue-500' },
  { name: 'Kelime Dağarcığı', completions: 7, avgScore: 78, color: 'bg-green-500' },
  { name: 'Sosyal İletişim', completions: 6, avgScore: 72, color: 'bg-purple-500' },
  { name: 'Matematik Dünyası', completions: 5, avgScore: 88, color: 'bg-orange-500' },
  { name: 'Okuryazarlık', completions: 9, avgScore: 76, color: 'bg-indigo-500' },
  { name: 'Puzzle Oyunu', completions: 10, avgScore: 91, color: 'bg-pink-500' },
  { name: 'Temel Kavramlar', completions: 8, avgScore: 83, color: 'bg-yellow-500' },
  { name: 'Müzik Odası', completions: 6, avgScore: 95, color: 'bg-red-500' },
  { name: 'Video Odası', completions: 7, avgScore: 80, color: 'bg-teal-500' },
  { name: 'Yazma ve İfade', completions: 4, avgScore: 69, color: 'bg-cyan-500' }
]

export default function TeacherDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek')
  const [studentsLoading, setStudentsLoading] = useState(true)

  useEffect(() => {
    // Mock loading
    setTimeout(() => setStudentsLoading(false), 1000)
  }, [])

  const totalStudents = mockStudentData.length
  const activeStudents = mockStudentData.filter(s => 
    new Date(s.lastActive) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
  const totalActivities = mockStudentData.reduce((sum, student) => sum + student.voiceInteractions, 0)
  const avgProgress = Math.round(mockStudentData.reduce((sum, student) => sum + student.totalProgress, 0) / totalStudents)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Öğretmen Dashboard
        </h1>
        <p className="text-gray-600">
          Otizmli çocukların eğitim ilerlemesini takip edin ve analiz edin
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Öğrenci</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {activeStudents} aktif bu hafta
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Aktivite</p>
              <p className="text-3xl font-bold text-gray-900">{totalActivities}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              %15 artış geçen haftaya göre
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama İlerleme</p>
              <p className="text-3xl font-bold text-gray-900">{avgProgress}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${avgProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gülsu Ses Sistemi</p>
              <p className="text-lg font-bold text-green-900">Aktif</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 4v.01M6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              %100 öğrenci kullanıyor
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Öğrenci Listesi
              </h3>
              <select 
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="thisWeek">Bu Hafta</option>
                <option value="thisMonth">Bu Ay</option>
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>
          </div>
          
          <div className="p-6">
            {studentsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {mockStudentData.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.age} yaş • Son aktivite: {student.lastActive}
                        </p>
                        <p className="text-xs text-indigo-600">
                          Favori modül: {student.favoriteModule}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        %{student.totalProgress}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.completedModules}/10 modül
                      </div>
                      <div className="text-xs text-green-600">
                        {student.voiceInteractions} ses etkileşimi
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Module Performance */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Modül Performansı
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              10 aktif modülün başarı oranları
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {moduleStats.map((module, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {module.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      %{module.avgScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${module.color}`}
                      style={{ width: `${module.avgScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{module.completions} tamamlama</span>
                    <span>Başarı: %{module.avgScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gülsu Voice Analytics */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Gülsu Ses Sistemi Analytics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Eleven Turbo v2.5 model performansı ve kullanım istatistikleri
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                %100
              </div>
              <div className="text-sm text-gray-600">
                Gülsu Voice Kullanımı
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                <300ms
              </div>
              <div className="text-sm text-gray-600">
                Ortalama Yanıt Süresi
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                %99.8
              </div>
              <div className="text-sm text-gray-600">
                Ses Başarı Oranı
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                18/18
              </div>
              <div className="text-sm text-gray-600">
                Matematik Audio Coverage
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Perfect Turkish Pronunciation - SSML + IPA Phonetic Transcription Aktif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 