'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NumberRecognitionGame from './NumberRecognitionGame';
import AdditionGame from './AdditionGame';
import CountingGame from './CountingGame';
import ShapeNumberGame from './ShapeNumberGame';
import GameHelpModal from '@/components/GameHelpModal';

type GameType = 'menu' | 'number-recognition' | 'addition' | 'counting' | 'shape-number';

export default function MathematicsPage() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('number-recognition');
  const router = useRouter();

  const games = [
    {
      id: 'number-recognition' as GameType,
      title: '🔢 Sayı Tanıma',
      description: '1-10 arası sayıları öğren ve tanı',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: '🔢',
    },
    {
      id: 'counting' as GameType,
      title: '🧮 Sayma Oyunu',
      description: 'Nesneleri say ve doğru sayıyı seç',
      color: 'bg-green-500 hover:bg-green-600',
      icon: '🧮',
    },
    {
      id: 'addition' as GameType,
      title: '➕ Toplama Oyunu',
      description: 'Basit toplama işlemlerini öğren',
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: '➕',
    },
    {
      id: 'shape-number' as GameType,
      title: '🔷 Şekil-Sayı',
      description: 'Şekillerdeki sayıları say ve eşleştir',
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: '🔷',
    },
  ];

  const handleBackToMenu = () => {
    setCurrentGame('menu');
  };

  const handleBackToModules = () => {
    router.push('/modules');
  };

  const handleShowHelp = (gameType: string) => {
    setHelpGameType(gameType);
    setShowHelpModal(true);
  };

  // Game Components
  if (currentGame === 'number-recognition') {
    return <NumberRecognitionGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'counting') {
    return <CountingGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'addition') {
    return <AdditionGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'shape-number') {
    return <ShapeNumberGame onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToModules}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Modüllere Dön
            </button>
            <button
              onClick={() => handleShowHelp('number-recognition')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg shadow hover:bg-purple-100 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔢 Matematik Dünyası
          </h1>
          <p className="text-lg text-gray-600">
            Sayılar, şekiller ve hesaplarla eğlencelı öğrenme!
          </p>
        </div>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {game.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-center">
                  {game.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentGame(game.id)}
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition-colors ${game.color}`}
                  >
                    Oyunu Başlat
                  </button>
                  <button
                    onClick={() => handleShowHelp(game.id)}
                    className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Oyun kurallarını görüntüle"
                  >
                    ❓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mathematics Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌟 Matematik Becerileri Geliştir
            </h2>
            <p className="text-gray-600 mb-6">
              Temel matematik kavramlarını oyunlarla öğren!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🔢</div>
              <h3 className="font-semibold mb-1 text-blue-800">Sayı Tanıma</h3>
              <p className="text-sm text-blue-600">1-10 arası sayıları öğren</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🧮</div>
              <h3 className="font-semibold mb-1 text-green-800">Sayma</h3>
              <p className="text-sm text-green-600">Nesneleri say ve eşleştir</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl mb-2">➕</div>
              <h3 className="font-semibold mb-1 text-purple-800">Toplama</h3>
              <p className="text-sm text-purple-600">Basit toplama işlemleri</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🔷</div>
              <h3 className="font-semibold mb-1 text-orange-800">Şekil-Sayı</h3>
              <p className="text-sm text-orange-600">Şekillerde sayı kavramı</p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🎯 Öğrenme Hedefleri:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1-10 arası sayıları tanıma ve adlandırma</li>
              <li>• Nesneleri sayma ve sayı-nesne ilişkisi kurma</li>
              <li>• Temel toplama işlemlerini anlama</li>
              <li>• Görsel-sayısal ilişki geliştirme</li>
              <li>• Problem çözme becerilerini güçlendirme</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <GameHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        gameType={helpGameType}
        gameName="Matematik"
      />
    </div>
  );
} 