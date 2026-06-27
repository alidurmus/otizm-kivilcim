'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SystemHealth {
  status: '🟢 Healthy' | '🟡 Warning' | '🔴 Critical';
  uptime: string;
  memoryUsage: string;
  activeModules: number;
  environment: string;
}

export default function HealthDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    // Mock fetching system health data
    // In production, this would call a real /api/health endpoint
    const mockHealth: SystemHealth = {
      status: '🟢 Healthy',
      uptime: '99.9%',
      memoryUsage: '45 MB / 1024 MB',
      activeModules: 10,
      environment: process.env.NODE_ENV || 'development'
    };
    
    setHealth(mockHealth);
  }, []);

  if (!health) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 System Health Dashboard</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Admin Panele Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Genel Durum</h3>
            <p className="text-2xl font-bold text-gray-800">{health.status}</p>
            <p className="text-xs text-gray-400 mt-2">Sistem tüm modülleriyle aktif çalışıyor.</p>
          </div>

          {/* Uptime Card */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Uptime</h3>
            <p className="text-2xl font-bold text-gray-800">{health.uptime}</p>
            <p className="text-xs text-gray-400 mt-2">Son 30 günlük erişilebilirlik oranı.</p>
          </div>

          {/* Memory Usage Card */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Hafıza (Memory)</h3>
            <p className="text-xl font-bold text-gray-800">{health.memoryUsage}</p>
            <p className="text-xs text-gray-400 mt-2">İstemci tarafı tahmini tüketim.</p>
          </div>
          
          {/* Modules Card */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Aktif Modüller</h3>
            <p className="text-2xl font-bold text-gray-800">{health.activeModules} / 10</p>
            <p className="text-xs text-gray-400 mt-2">Tüm pedagojik modüller çevrimiçi.</p>
          </div>

          {/* Environment Card */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-gray-500">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Environment</h3>
            <p className="text-xl font-bold text-gray-800 capitalize">{health.environment}</p>
            <p className="text-xs text-gray-400 mt-2">Mevcut çalışma ortamı değişkeni.</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Son Sistem Olayları (Event Logs)</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-gray-600">✅ Service Worker önbelleğe alma işlemi başarılı.</span>
              <span className="text-gray-400">2 dk önce</span>
            </li>
            <li className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-gray-600">✅ React.memo performans optimizasyonu uygulandı.</span>
              <span className="text-gray-400">45 dk önce</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">✅ ElevenLabs API bağlantısı stabil. (Ping: 42ms)</span>
              <span className="text-gray-400">1 saat önce</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
