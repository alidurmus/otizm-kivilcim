'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import KivilcimIcon from '@/components/KivilcimIcon';
import ThemeToggle from '@/components/ThemeToggle';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastActivity: string;
  exercisesCompleted: number;
  status: 'active' | 'inactive';
}

interface SystemStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ali Veli',
    email: 'ali@example.com',
    createdAt: '2024-01-15',
    lastActivity: '2024-01-20',
    exercisesCompleted: 25,
    status: 'active'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    createdAt: '2024-01-10',
    lastActivity: '2024-01-19',
    exercisesCompleted: 18,
    status: 'active'
  },
  {
    id: '3',
    name: 'Mehmet Yılmaz',
    email: 'mehmet@example.com',
    createdAt: '2024-01-05',
    lastActivity: '2024-01-15',
    exercisesCompleted: 42,
    status: 'inactive'
  }
];

const systemStats: SystemStat[] = [
  { label: 'Toplam Kullanıcı', value: 156, icon: '👥', color: 'text-focus-blue' },
  { label: 'Aktif Kullanıcı', value: 89, icon: '✅', color: 'text-success-green' },
  { label: 'Tamamlanan Egzersiz', value: '2,430', icon: '📚', color: 'text-encourage-orange' },
  { label: 'Ortalama Başarı', value: '%85', icon: '🎯', color: 'text-focus-blue' }
];

const Switch = ({ checked, onChange, label, id }: { checked: boolean; onChange: () => void; label?: string; id?: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    id={id}
    tabIndex={0}
    onClick={onChange}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onChange(); }}
    className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-focus-blue ${checked ? 'bg-success-green' : 'bg-gray-300'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? 'right-0.5' : 'left-0.5'}`}></div>
  </button>
);

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'logs'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [acceptNewUsers, setAcceptNewUsers] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  const handleBackHome = () => {
    router.push('/');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <div key={index} className="bg-adaptive rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 dark:shadow-xl">
            <div className={`text-4xl mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-adaptive mb-2">{stat.value}</div>
            <div className="text-sm text-adaptive-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-text-color mb-4">🚀 Hızlı İşlemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Button variant="primary" size="medium" onClick={() => setActiveTab('users')}>
            👥 Kullanıcıları Görüntüle
          </Button>
          <Button variant="secondary" size="medium" onClick={() => setActiveTab('settings')}>
            ⚙️ Sistem Ayarları
          </Button>
          <Button variant="success" size="medium" onClick={() => setActiveTab('logs')}>
            📋 Sistem Logları
          </Button>
          <a 
            href="/admin/elevenlabs-test"
            className="bg-encourage-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center flex items-center justify-center"
          >
            🔊 ElevenLabs Test
          </a>
          <a 
            href="/demo/elevenlabs-v3-test"
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center flex items-center justify-center"
          >
            🧪 v3 Test (Gülsu)
          </a>
          <a 
            href="/demo/single-letter"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-center flex items-center justify-center"
          >
            🔤 Tek Harf Test
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-text-color mb-4">📈 Son Aktiviteler</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-calm-blue bg-opacity-20 rounded-lg">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-medium text-text-color">Ali Veli okuryazarlık modülünü tamamladı</div>
              <div className="text-sm text-gray-600">5 dakika önce</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-success-green bg-opacity-20 rounded-lg">
            <span className="text-2xl">📚</span>
            <div>
              <div className="font-medium text-text-color">Ayşe Demir yeni egzersiz başlattı</div>
              <div className="text-sm text-gray-600">12 dakika önce</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-encourage-orange bg-opacity-20 rounded-lg">
            <span className="text-2xl">👤</span>
            <div>
              <div className="font-medium text-text-color">Yeni kullanıcı kaydı: Mehmet Yılmaz</div>
              <div className="text-sm text-gray-600">1 saat önce</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-text-color mb-6">👥 Kullanıcı Yönetimi</h3>
      
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 mr-4 w-64 focus:outline-none focus:ring-2 focus:ring-focus-blue"
          aria-label="Kullanıcı ara"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-calm-blue bg-opacity-20">
              <th className="px-4 py-3 text-left text-text-color font-semibold">Ad</th>
              <th className="px-4 py-3 text-left text-text-color font-semibold">E-posta</th>
              <th className="px-4 py-3 text-left text-text-color font-semibold">Kayıt Tarihi</th>
              <th className="px-4 py-3 text-left text-text-color font-semibold">Son Aktivite</th>
              <th className="px-4 py-3 text-left text-text-color font-semibold">Egzersizler</th>
              <th className="px-4 py-3 text-left text-text-color font-semibold">Durum</th>
              <th className="px-4 py-3 text-left text-text-color font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.filter(user => user.name.toLowerCase().includes(userSearch.toLowerCase()) || user.email.toLowerCase().includes(userSearch.toLowerCase())).map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-text-color font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-600">{user.createdAt}</td>
                <td className="px-4 py-3 text-gray-600">{user.lastActivity}</td>
                <td className="px-4 py-3 text-text-color font-medium">{user.exercisesCompleted}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-success-green bg-opacity-30 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {user.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="text-focus-blue hover:text-blue-700 transition-colors"
                  >
                    Detaylar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={e => { if (e.target === e.currentTarget) setSelectedUser(null); }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onKeyDown={e => { if (e.key === 'Escape') setSelectedUser(null); }}
            tabIndex={0}
          >
            <h4 className="text-lg font-bold text-text-color mb-4">👤 Kullanıcı Detayları</h4>
            <div className="space-y-3">
              <div><strong>Ad:</strong> {selectedUser.name}</div>
              <div><strong>E-posta:</strong> {selectedUser.email}</div>
              <div><strong>Kayıt Tarihi:</strong> {selectedUser.createdAt}</div>
              <div><strong>Son Aktivite:</strong> {selectedUser.lastActivity}</div>
              <div><strong>Tamamlanan Egzersizler:</strong> {selectedUser.exercisesCompleted}</div>
              <div><strong>Durum:</strong> {selectedUser.status === 'active' ? 'Aktif' : 'Pasif'}</div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button variant="primary" size="small" onClick={() => setSelectedUser(null)}>
                Kapat
              </Button>
              <Button variant="secondary" size="small" onClick={() => {}}>
                Düzenle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-text-color mb-6">⚙️ Sistem Ayarları</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genel Ayarlar */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-color">🔧 Genel Ayarlar</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text-color">Yeni kayıtları kabul et</span>
                <Switch checked={acceptNewUsers} onChange={() => setAcceptNewUsers(v => !v)} label="Yeni kayıtları kabul et" id="acceptNewUsers" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text-color">Email bildirimleri</span>
                <Switch checked={emailNotifications} onChange={() => setEmailNotifications(v => !v)} label="Email bildirimleri" id="emailNotifications" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text-color">Otomatik yedekleme</span>
                <Switch checked={autoBackup} onChange={() => setAutoBackup(v => !v)} label="Otomatik yedekleme" id="autoBackup" />
              </div>
            </div>
          </div>

          {/* API Ayarları */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-color">🔌 API Ayarları</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-text-color mb-1">ElevenLabs API</label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full"></div>
                  <span className="text-sm text-gray-600">Bağlantı Aktif</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-text-color mb-1">Firebase</label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-green rounded-full"></div>
                  <span className="text-sm text-gray-600">Bağlantı Aktif</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-text-color mb-1">Azure Speech</label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-encourage-orange rounded-full"></div>
                  <span className="text-sm text-gray-600">Konfigürasyon Gerekli</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Button variant="primary" size="medium" onClick={() => {}}>
            Ayarları Kaydet
          </Button>
          <Button variant="secondary" size="medium" onClick={() => {}}>
            Varsayılana Sıfırla
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-text-color mb-6">📋 Sistem Logları</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-green-500 font-mono text-sm mt-0.5">[INFO]</span>
          <div className="flex-1">
            <div className="text-sm text-text-color">Kullanıcı başarıyla giriş yaptı: ali@example.com</div>
            <div className="text-xs text-gray-500 mt-1">2024-01-20 14:30:25</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-blue-500 font-mono text-sm mt-0.5">[DEBUG]</span>
          <div className="flex-1">
            <div className="text-sm text-text-color">ElevenLabs API isteği başarılı: /v1/text-to-speech</div>
            <div className="text-xs text-gray-500 mt-1">2024-01-20 14:28:15</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-yellow-500 font-mono text-sm mt-0.5">[WARN]</span>
          <div className="flex-1">
            <div className="text-sm text-text-color">Yüksek API kullanımı tespit edildi</div>
            <div className="text-xs text-gray-500 mt-1">2024-01-20 14:25:10</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-green-500 font-mono text-sm mt-0.5">[INFO]</span>
          <div className="flex-1">
            <div className="text-sm text-text-color">Egzersiz tamamlandı: literacy-exercise-1</div>
            <div className="text-xs text-gray-500 mt-1">2024-01-20 14:20:05</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-red-500 font-mono text-sm mt-0.5">[ERROR]</span>
          <div className="flex-1">
            <div className="text-sm text-text-color">Firebase bağlantı hatası: PERMISSION_DENIED</div>
            <div className="text-xs text-gray-500 mt-1">2024-01-20 14:15:30</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-3">
        <Button variant="secondary" size="small" onClick={() => {}}>
          🔄 Yenile
        </Button>
        <Button variant="secondary" size="small" onClick={() => {}}>
          📥 İndir
        </Button>
        <Button variant="secondary" size="small" onClick={() => {}}>
          🗑️ Temizle
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <KivilcimIcon size={50} animate={false} />
            <div>
              <h1 className="text-3xl font-extrabold text-adaptive">🛠️ Admin Paneli</h1>
              <p className="text-adaptive-secondary">Kıvılcım Platform Yönetimi</p>
            </div>
          </div>
          <Button variant="secondary" size="medium" onClick={handleBackHome}>
            ← Ana Sayfa
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white rounded-xl p-2 shadow-lg">
          {([
            { id: 'dashboard', label: '📊 Panel', icon: '📊' },
            { id: 'users', label: '👥 Kullanıcılar', icon: '👥' },
            { id: 'settings', label: '⚙️ Ayarlar', icon: '⚙️' },
            { id: 'logs', label: '📋 Loglar', icon: '📋' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-focus-blue text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'logs' && renderLogs()}
        </div>
      </div>
    </div>
  );
}
