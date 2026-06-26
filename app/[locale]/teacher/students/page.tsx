'use client'

import { useState } from 'react'
import Link from 'next/link'

// Sample detailed student data
const studentsDetailData = [
  {
    id: 1,
    name: 'Ali Kaya',
    age: 6,
    dateJoined: '2024-09-15',
    lastActive: '2025-01-06',
    totalProgress: 78,
    moduleProgress: {
      'alfabe-okuma': 95,
      'kelime-dagarcigi': 85,
      'sosyal-iletisim': 70,
      'matematik-dunyasi': 60,
      'okuryazarlik': 90,
      'puzzle-oyunu': 80,
      'temel-kavramlar': 100,
      'muzik-odasi': 65,
      'video-odasi': 75,
      'yazma-ifade': 45
    },
    voiceStats: {
      totalInteractions: 156,
      gülsuUsage: 156,
      averageSessionTime: '12:34',
      favoriteWords: ['merhaba', 'teşekkürler', 'evet'],
      pronunciationScore: 87
    },
    achievements: ['İlk Modül Tamamlama', 'Alfabe Ustası', '100 Ses Etkileşimi'],
    notes: 'Özellikle alfabe okuma konusunda çok başarılı. Ses etkileşimlerinde aktif.'
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    age: 7,
    dateJoined: '2024-08-20',
    lastActive: '2025-01-05',
    totalProgress: 65,
    moduleProgress: {
      'alfabe-okuma': 70,
      'kelime-dagarcigi': 90,
      'sosyal-iletisim': 85,
      'matematik-dunyasi': 40,
      'okuryazarlik': 75,
      'puzzle-oyunu': 60,
      'temel-kavramlar': 80,
      'muzik-odasi': 95,
      'video-odasi': 50,
      'yazma-ifade': 30
    },
    voiceStats: {
      totalInteractions: 203,
      gülsuUsage: 203,
      averageSessionTime: '15:22',
      favoriteWords: ['müzik', 'şarkı', 'oyun'],
      pronunciationScore: 92
    },
    achievements: ['Müzik Ustası', 'Sosyal İletişim Başarısı', '200 Ses Etkileşimi'],
    notes: 'Müzik ve sosyal iletişim modüllerinde mükemmel performans.'
  },
  {
    id: 3,
    name: 'Mehmet Özkan',
    age: 5,
    dateJoined: '2024-11-10',
    lastActive: '2025-01-06',
    totalProgress: 45,
    moduleProgress: {
      'alfabe-okuma': 60,
      'kelime-dagarcigi': 55,
      'sosyal-iletisim': 40,
      'matematik-dunyasi': 30,
      'okuryazarlik': 45,
      'puzzle-oyunu': 70,
      'temel-kavramlar': 85,
      'muzik-odasi': 35,
      'video-odasi': 40,
      'yazma-ifade': 25
    },
    voiceStats: {
      totalInteractions: 89,
      gülsuUsage: 89,
      averageSessionTime: '8:15',
      favoriteWords: ['oyun', 'renkler', 'hayvanlar'],
      pronunciationScore: 73
    },
    achievements: ['Temel Kavramlar Başarısı', 'İlk Adım'],
    notes: 'Henüz yeni başladı, temel kavramlarda çok başarılı. Destekleyici yaklaşım gerekiyor.'
  },
  {
    id: 4,
    name: 'Zeynep Yılmaz',
    age: 8,
    dateJoined: '2024-06-01',
    lastActive: '2025-01-04',
    totalProgress: 92,
    moduleProgress: {
      'alfabe-okuma': 100,
      'kelime-dagarcigi': 95,
      'sosyal-iletisim': 90,
      'matematik-dunyasi': 100,
      'okuryazarlik': 100,
      'puzzle-oyunu': 95,
      'temel-kavramlar': 100,
      'muzik-odasi': 85,
      'video-odasi': 90,
      'yazma-ifade': 85
    },
    voiceStats: {
      totalInteractions: 234,
      gülsuUsage: 234,
      averageSessionTime: '18:45',
      favoriteWords: ['matematik', 'sayılar', 'problem'],
      pronunciationScore: 96
    },
    achievements: ['Tüm Modül Ustası', 'Matematik Dâhisi', 'Perfect Score', '9 Modül Tamamlama'],
    notes: 'Olağanüstü başarılı öğrenci. Matematik alanında özel yetenek gösteriyor.'
  }
]

const moduleNames = {
  'alfabe-okuma': 'Alfabe Okuma',
  'kelime-dagarcigi': 'Kelime Dağarcığı',
  'sosyal-iletisim': 'Sosyal İletişim',
  'matematik-dunyasi': 'Matematik Dünyası',
  'okuryazarlik': 'Okuryazarlık',
  'puzzle-oyunu': 'Puzzle Oyunu',
  'temel-kavramlar': 'Temel Kavramlar',
  'muzik-odasi': 'Müzik Odası',
  'video-odasi': 'Video Odası',
  'yazma-ifade': 'Yazma ve İfade'
}

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'lastActive'>('name')

  const sortedStudents = [...studentsDetailData].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.totalProgress - a.totalProgress
      case 'lastActive':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const student = selectedStudent ? studentsDetailData.find(s => s.id === selectedStudent) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Öğrenci Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Öğrenci ilerlemelerini detaylı olarak takip edin
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">İsme Göre Sırala</option>
            <option value="progress">İlerlemeye Göre Sırala</option>
            <option value="lastActive">Son Aktiviteye Göre Sırala</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
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
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'detail' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detay
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6">
            <div className="grid gap-6">
              {sortedStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student.id)
                    setViewMode('detail')
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {student.name}
                        </h3>
                        <p className="text-gray-600">
                          {student.age} yaş • Katılım: {student.dateJoined}
                        </p>
                        <p className="text-sm text-indigo-600 mt-1">
                          Son aktivite: {student.lastActive}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {student.voiceStats.totalInteractions} ses etkileşimi
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            %{student.voiceStats.pronunciationScore} telaffuz başarısı
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        %{student.totalProgress}
                      </div>
                      <div className="text-sm text-gray-600">
                        Genel İlerleme
                      </div>
                      
                      <div className="mt-3 w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${student.totalProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          Detaylara Git →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Module Progress Mini Chart */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Modül İlerlemeleri (10 Aktif Modül)
                    </h4>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(student.moduleProgress).map(([moduleKey, progress]) => (
                        <div key={moduleKey} className="text-center">
                          <div className="text-xs text-gray-600 mb-1">
                            {moduleNames[moduleKey as keyof typeof moduleNames]?.split(' ')[0]}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                progress >= 80 ? 'bg-green-500' :
                                progress >= 60 ? 'bg-yellow-500' :
                                progress >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            %{progress}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Detail View */
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Öğrenci Listesine Dön
            </button>
            
            {student && (
              <div className="flex items-center space-x-2">
                {sortedStudents.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      s.id === selectedStudent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {student && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="h-24 w-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">
                      {student.name}
                    </h2>
                    <p className="text-gray-600">
                      {student.age} yaşında
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Katılım Tarihi:</span>
                      <span className="text-sm font-medium text-gray-900">{student.dateJoined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Son Aktivite:</span>
                      <span className="text-sm font-medium text-gray-900">{student.lastActive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Genel İlerleme:</span>
                      <span className="text-lg font-bold text-indigo-600">%{student.totalProgress}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${student.totalProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Voice Analytics */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Gülsu Ses Analytics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Toplam Etkileşim:</span>
                      <span className="text-sm font-bold text-green-600">{student.voiceStats.totalInteractions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gülsu Kullanımı:</span>
                      <span className="text-sm font-bold text-indigo-600">%100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ortalama Süre:</span>
                      <span className="text-sm font-medium text-gray-900">{student.voiceStats.averageSessionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Telaffuz Başarısı:</span>
                      <span className="text-sm font-bold text-purple-600">%{student.voiceStats.pronunciationScore}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-2">
                      Favori Kelimeler:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.voiceStats.favoriteWords.map((word, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Başarılar
                  </h3>
                  
                  <div className="space-y-3">
                    {student.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Module Progress Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Detaylı Modül İlerlemeleri
                  </h3>
                  
                  <div className="grid gap-4">
                    {Object.entries(student.moduleProgress).map(([moduleKey, progress]) => (
                      <div key={moduleKey} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            {moduleNames[moduleKey as keyof typeof moduleNames]}
                          </h4>
                          <span className="text-lg font-bold text-gray-900">
                            %{progress}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className={`h-3 rounded-full transition-all duration-700 ${
                              progress >= 80 ? 'bg-green-500' :
                              progress >= 60 ? 'bg-yellow-500' :
                              progress >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className={`font-medium ${
                            progress >= 80 ? 'text-green-600' :
                            progress >= 60 ? 'text-yellow-600' :
                            progress >= 40 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {progress >= 80 ? 'Mükemmel' :
                             progress >= 60 ? 'İyi' :
                             progress >= 40 ? 'Geliştirilmeli' : 'Destekleyici Yaklaşım Gerekli'}
                          </span>
                          <Link 
                            href={`/exercise/${moduleKey}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Modüle Git →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Öğretmen Notları
                  </h3>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-700">
                      {student.notes}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Not Ekle / Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 