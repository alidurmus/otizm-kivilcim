'use client'

import { useState } from 'react'
import Link from 'next/link'

// 10 aktif modül verisi
const modulesData = [
  {
    id: 'alfabe-okuma',
    name: 'Alfabe Okuma',
    description: 'Türk alfabesinin öğretimi ve okuma becerilerinin geliştirilmesi',
    icon: '📚',
    status: 'active',
    totalStudents: 4,
    completedStudents: 3,
    averageProgress: 85,
    voiceCoverage: 100,
    audioFiles: 28,
    lastUpdated: '2025-01-05',
    difficulty: 'Başlangıç',
    estimatedDuration: '45 dakika',
    exercises: [
      { name: 'Harf Tanıma', progress: 90, students: 4 },
      { name: 'Harf Yazma', progress: 80, students: 3 },
      { name: 'Kelime Okuma', progress: 85, students: 4 }
    ]
  },
  {
    id: 'kelime-dagarcigi',
    name: 'Kelime Dağarcığı',
    description: 'Temel kelime hazinesinin geliştirilmesi ve kelime oyunları',
    icon: '📝',
    status: 'active',
    totalStudents: 4,
    completedStudents: 2,
    averageProgress: 78,
    voiceCoverage: 95,
    audioFiles: 45,
    lastUpdated: '2025-01-04',
    difficulty: 'Başlangıç',
    estimatedDuration: '30 dakika',
    exercises: [
      { name: 'Kelime Kartları', progress: 85, students: 4 },
      { name: 'Kelime Eşleştirme', progress: 75, students: 3 },
      { name: 'Kelime Oyunları', progress: 70, students: 4 }
    ]
  },
  {
    id: 'sosyal-iletisim',
    name: 'Sosyal İletişim',
    description: 'Sosyal becerilerin geliştirilmesi ve iletişim kurma',
    icon: '👥',
    status: 'active',
    totalStudents: 3,
    completedStudents: 1,
    averageProgress: 72,
    voiceCoverage: 85,
    audioFiles: 32,
    lastUpdated: '2025-01-03',
    difficulty: 'Orta',
    estimatedDuration: '40 dakika',
    exercises: [
      { name: 'Selamlaşma', progress: 80, students: 3 },
      { name: 'Teşekkür Etme', progress: 75, students: 3 },
      { name: 'Duygular', progress: 60, students: 2 }
    ]
  },
  {
    id: 'matematik-dunyasi',
    name: 'Matematik Dünyası',
    description: 'Temel matematik kavramları ve sayı oyunları',
    icon: '🔢',
    status: 'active',
    totalStudents: 3,
    completedStudents: 1,
    averageProgress: 88,
    voiceCoverage: 100,
    audioFiles: 18,
    lastUpdated: '2025-01-06',
    difficulty: 'Orta',
    estimatedDuration: '35 dakika',
    exercises: [
      { name: 'Sayı Tanıma', progress: 95, students: 3 },
      { name: 'Sayma Oyunu', progress: 85, students: 3 },
      { name: 'Toplama İşlemi', progress: 70, students: 2 }
    ]
  },
  {
    id: 'okuryazarlik',
    name: 'Okuryazarlık',
    description: 'Okuma ve yazma becilerinin geliştirilmesi',
    icon: '✍️',
    status: 'active',
    totalStudents: 4,
    completedStudents: 2,
    averageProgress: 76,
    voiceCoverage: 90,
    audioFiles: 35,
    lastUpdated: '2025-01-02',
    difficulty: 'Orta',
    estimatedDuration: '50 dakika',
    exercises: [
      { name: 'Cümle Okuma', progress: 80, students: 4 },
      { name: 'Yazı Yazma', progress: 70, students: 3 },
      { name: 'Anlam Çıkarma', progress: 75, students: 4 }
    ]
  },
  {
    id: 'puzzle-oyunu',
    name: 'Puzzle Oyunu',
    description: 'Problem çözme becerileri ve mantıksal düşünme',
    icon: '🧩',
    status: 'active',
    totalStudents: 4,
    completedStudents: 3,
    averageProgress: 91,
    voiceCoverage: 80,
    audioFiles: 22,
    lastUpdated: '2025-01-01',
    difficulty: 'Başlangıç',
    estimatedDuration: '25 dakika',
    exercises: [
      { name: 'Şekil Puzzle', progress: 95, students: 4 },
      { name: 'Renk Eşleştirme', progress: 90, students: 4 },
      { name: 'Mantık Puzzle', progress: 85, students: 3 }
    ]
  },
  {
    id: 'temel-kavramlar',
    name: 'Temel Kavramlar',
    description: 'Renkler, şekiller ve temel kavramların öğretimi',
    icon: '🎨',
    status: 'active',
    totalStudents: 4,
    completedStudents: 4,
    averageProgress: 83,
    voiceCoverage: 100,
    audioFiles: 40,
    lastUpdated: '2024-12-30',
    difficulty: 'Başlangıç',
    estimatedDuration: '30 dakika',
    exercises: [
      { name: 'Renkler', progress: 90, students: 4 },
      { name: 'Şekiller', progress: 85, students: 4 },
      { name: 'Boyutlar', progress: 75, students: 4 }
    ]
  },
  {
    id: 'muzik-odasi',
    name: 'Müzik Odası',
    description: 'Müzik dinleme ve ritim oyunları',
    icon: '🎵',
    status: 'active',
    totalStudents: 3,
    completedStudents: 2,
    averageProgress: 95,
    voiceCoverage: 75,
    audioFiles: 25,
    lastUpdated: '2024-12-28',
    difficulty: 'Başlangıç',
    estimatedDuration: '20 dakika',
    exercises: [
      { name: 'Şarkı Söyleme', progress: 100, students: 3 },
      { name: 'Ritim Oyunları', progress: 95, students: 3 },
      { name: 'Enstrüman Tanıma', progress: 90, students: 2 }
    ]
  },
  {
    id: 'video-odasi',
    name: 'Video Odası',
    description: 'Eğitici videolar ve görsel öğrenme',
    icon: '📺',
    status: 'active',
    totalStudents: 3,
    completedStudents: 1,
    averageProgress: 80,
    voiceCoverage: 70,
    audioFiles: 15,
    lastUpdated: '2024-12-25',
    difficulty: 'Orta',
    estimatedDuration: '30 dakika',
    exercises: [
      { name: 'Video İzleme', progress: 85, students: 3 },
      { name: 'Soru Cevap', progress: 75, students: 3 },
      { name: 'Video Tekrarı', progress: 80, students: 2 }
    ]
  },
  {
    id: 'yazma-ifade',
    name: 'Yazma ve İfade',
    description: 'Yazılı ifade becerileri ve yaratıcı yazma',
    icon: '✏️',
    status: 'active',
    totalStudents: 2,
    completedStudents: 0,
    averageProgress: 69,
    voiceCoverage: 60,
    audioFiles: 12,
    lastUpdated: '2024-12-20',
    difficulty: 'İleri',
    estimatedDuration: '45 dakika',
    exercises: [
      { name: 'Hikaye Yazma', progress: 70, students: 2 },
      { name: 'Kelime Dağarcığı', progress: 75, students: 2 },
      { name: 'Yaratıcı Yazma', progress: 60, students: 1 }
    ]
  }
]

const difficultyColors = {
  'Başlangıç': 'bg-green-100 text-green-800',
  'Orta': 'bg-yellow-100 text-yellow-800',
  'İleri': 'bg-red-100 text-red-800'
}

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'students'>('name')

  const filteredModules = modulesData
    .filter(module => filterDifficulty === 'all' || module.difficulty === filterDifficulty)
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.averageProgress - a.averageProgress
        case 'students':
          return b.totalStudents - a.totalStudents
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const module = selectedModule ? modulesData.find(m => m.id === selectedModule) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modül Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            10 aktif modülün durumunu takip edin ve yönetin
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">Tüm Seviyeler</option>
            <option value="Başlangıç">Başlangıç</option>
            <option value="Orta">Orta</option>
            <option value="İleri">İleri</option>
          </select>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">İsme Göre</option>
            <option value="progress">İlerlemeye Göre</option>
            <option value="students">Öğrenci Sayısına Göre</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Izgara
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Modül</p>
              <p className="text-3xl font-bold text-gray-900">10</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Tüm modüller aktif</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audio Coverage</p>
              <p className="text-3xl font-bold text-gray-900">88%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 4v.01M6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-indigo-600 mt-2">Gülsu voice coverage</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ortalama İlerleme</p>
              <p className="text-3xl font-bold text-gray-900">81%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Tüm modüller ortalaması</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audio Dosyaları</p>
              <p className="text-3xl font-bold text-gray-900">272</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">Toplam ses dosyası</p>
        </div>
      </div>

      {!selectedModule ? (
        /* Modules Overview */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'p-4' : 'p-6'
              }`}
              onClick={() => setSelectedModule(module.id)}
            >
              {viewMode === 'grid' ? (
                /* Grid View */
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-3xl">
                      {module.icon}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[module.difficulty as keyof typeof difficultyColors]}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {module.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">İlerleme:</span>
                      <span className="font-bold text-gray-900">%{module.averageProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${module.averageProgress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Öğrenci:</span>
                      <span className="font-medium">{module.completedStudents}/{module.totalStudents}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Audio Coverage:</span>
                      <span className={`font-medium ${module.voiceCoverage >= 90 ? 'text-green-600' : module.voiceCoverage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        %{module.voiceCoverage}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{module.estimatedDuration}</span>
                      <span>{module.audioFiles} ses dosyası</span>
                    </div>
                  </div>
                </>
              ) : (
                /* List View */
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                      {module.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[module.difficulty as keyof typeof difficultyColors]}`}>
                          {module.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{module.totalStudents} öğrenci</span>
                        <span>{module.audioFiles} ses dosyası</span>
                        <span>%{module.voiceCoverage} audio coverage</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">%{module.averageProgress}</div>
                      <div className="text-sm text-gray-600">Ortalama İlerleme</div>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${module.averageProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Detaylar →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Module Detail View */
        module && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Modül Listesine Dön
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Module Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-4xl mx-auto">
                      {module.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">
                      {module.name}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {module.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Seviye:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[module.difficulty as keyof typeof difficultyColors]}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Süre:</span>
                      <span className="text-sm font-medium text-gray-900">{module.estimatedDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Son Güncelleme:</span>
                      <span className="text-sm font-medium text-gray-900">{module.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ortalama İlerleme:</span>
                      <span className="text-lg font-bold text-indigo-600">%{module.averageProgress}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${module.averageProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      href={`/exercise/${module.id}`}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                      Modüle Git
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Voice Analytics */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Gülsu Voice Analytics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Audio Coverage:</span>
                      <span className={`text-sm font-bold ${module.voiceCoverage >= 90 ? 'text-green-600' : module.voiceCoverage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        %{module.voiceCoverage}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          module.voiceCoverage >= 90 ? 'bg-green-500' : 
                          module.voiceCoverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${module.voiceCoverage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Audio Dosyaları:</span>
                      <span className="text-sm font-medium text-gray-900">{module.audioFiles} dosya</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gülsu Voice:</span>
                      <span className="text-sm font-bold text-indigo-600">Aktif</span>
                    </div>
                  </div>
                  
                  {module.voiceCoverage < 100 && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        Bu modül için ses dosyalarını tamamlamak gerekiyor.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Exercises & Progress */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Egzersiz Detayları
                  </h3>
                  
                  <div className="grid gap-4">
                    {module.exercises.map((exercise, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{exercise.students} öğrenci</span>
                            <span className="text-lg font-bold text-gray-900">%{exercise.progress}</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-700 ${
                              exercise.progress >= 80 ? 'bg-green-500' :
                              exercise.progress >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${exercise.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm mt-2">
                          <span className={`font-medium ${
                            exercise.progress >= 80 ? 'text-green-600' :
                            exercise.progress >= 60 ? 'text-yellow-600' : 'text-orange-600'
                          }`}>
                            {exercise.progress >= 80 ? 'Mükemmel' :
                             exercise.progress >= 60 ? 'İyi' : 'Geliştirilmeli'}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                            Detaylar →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Progress */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Öğrenci İlerlemeleri
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {module.totalStudents}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Toplam Öğrenci
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {module.completedStudents}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Tamamlayan Öğrenci
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="text-sm font-medium text-indigo-800 mb-2">
                      📊 Modül Analizi:
                    </div>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• Ortalama tamamlama oranı: %{Math.round((module.completedStudents / module.totalStudents) * 100)}</li>
                      <li>• En başarılı egzersiz: {module.exercises.sort((a, b) => b.progress - a.progress)[0]?.name}</li>
                      <li>• Gülsu voice coverage: %{module.voiceCoverage}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
} 