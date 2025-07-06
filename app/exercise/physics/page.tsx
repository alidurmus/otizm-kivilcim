'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MotionGame from './MotionGame';
import WeightGame from './WeightGame';
import FlowGame from './FlowGame';
import ForceGame from './ForceGame';
import GameHelpModal from '@/components/GameHelpModal';

type GameType = 'menu' | 'motion' | 'weight' | 'flow' | 'force';

export default function PhysicsPage() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('motion');
  const router = useRouter();

  const games = [
    {
      id: 'motion' as GameType,
      title: '🚗 Hareket Oyunu',
      description: 'Nesnelerin hareketini keşfet: hızlı, yavaş, durgun',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: '🚗',
    },
    {
      id: 'weight' as GameType,
      title: '⚖️ Ağırlık Oyunu',
      description: 'Hafif ve ağır nesneleri karşılaştır',
      color: 'bg-green-500 hover:bg-green-600',
      icon: '⚖️',
    },
    {
      id: 'flow' as GameType,
      title: '💧 Akış Oyunu',
      description: 'Su ve havanın akışını gözlemle',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      icon: '💧',
    },
    {
      id: 'force' as GameType,
      title: '💪 Kuvvet Oyunu',
      description: 'İtme, çekme ve döndürme kuvvetleri',
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: '💪',
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
  if (currentGame === 'motion') {
    return <MotionGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'weight') {
    return <WeightGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'flow') {
    return <FlowGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'force') {
    return <ForceGame onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
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
              onClick={() => handleShowHelp('motion')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔬 Fizik ve Fen Dünyası
          </h1>
          <p className="text-lg text-gray-600">
            Doğanın yasalarını keşfet ve eğlenerek öğren!
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

        {/* Physics Concepts Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌟 Fizik Kavramlarını Keşfet
            </h2>
            <p className="text-gray-600 mb-6">
              Günlük yaşamdaki fizik olaylarını anlayalım!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🚗</div>
              <h3 className="font-semibold mb-1 text-blue-800">Hareket</h3>
              <p className="text-sm text-blue-600">Hızlı, yavaş, durgun</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="font-semibold mb-1 text-green-800">Ağırlık</h3>
              <p className="text-sm text-green-600">Hafif ve ağır nesneler</p>
            </div>
            
            <div className="p-4 bg-cyan-50 rounded-lg text-center">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-semibold mb-1 text-cyan-800">Akış</h3>
              <p className="text-sm text-cyan-600">Su ve hava akımları</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="font-semibold mb-1 text-orange-800">Kuvvet</h3>
              <p className="text-sm text-orange-600">İtme, çekme, döndürme</p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🎯 Öğrenme Hedefleri:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nesnelerin hareket türlerini tanıma (hızlı, yavaş, durgun)</li>
              <li>• Ağırlık kavramını anlama ve karşılaştırma yapma</li>
              <li>• Su ve hava akışlarını gözlemleme</li>
              <li>• Temel kuvvet türlerini keşfetme (itme, çekme)</li>
              <li>• Günlük yaşamdaki fizik olaylarını anlama</li>
              <li>• Neden-sonuç ilişkisi kurma becerisi</li>
            </ul>
          </div>

          {/* Safety Note */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Güvenlik Notu:</h3>
            <p className="text-sm text-yellow-700">
              Tüm aktiviteler sanal ortamda güvenli bir şekilde gerçekleştirilir. 
              Gerçek hayatta deneyler yaparken mutlaka yetişkin gözetimi gereklidir.
            </p>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <GameHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        gameType={helpGameType}
      />
    </div>
  );
} 