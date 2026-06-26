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
      description: 'Hızlı, yavaş ve durgun nesneleri tanı',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '🚗',
    },
    {
      id: 'weight' as GameType,
      title: '⚖️ Ağırlık Oyunu',
      description: 'Ağır ve hafif nesneleri öğren',
      color: 'bg-success-green hover:bg-green-600',
      icon: '⚖️',
    },
    {
      id: 'flow' as GameType,
      title: '💧 Akış Oyunu',
      description: 'Su ve hava akışını keşfet',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '💧',
    },
    {
      id: 'force' as GameType,
      title: '💪 Kuvvet Oyunu',
      description: 'İtme ve çekme kuvvetlerini öğren',
      color: 'bg-focus-blue hover:bg-blue-600',
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
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToModules}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-text-color dark:text-dark-text bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ← Modüllere Dön
            </button>
            <button
              onClick={() => handleShowHelp('motion')}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-focus-blue bg-blue-50 dark:bg-dark-surface border-2 border-blue-200 dark:border-dark-border rounded-xl transition-colors hover:bg-blue-100 dark:hover:bg-gray-800"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-extrabold text-text-color dark:text-dark-text mb-2">
            🔬 Fizik Dünyası
          </h1>
          <p className="text-lg text-gray-600 dark:text-dark-text-secondary">
            Hareket, ağırlık, akış ve kuvvetlerle eğlenceli öğrenme!
          </p>
        </div>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <h3 className="text-xl font-bold text-text-color dark:text-dark-text">
                    {game.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-dark-text-secondary mb-4 text-center">
                  {game.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentGame(game.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-bold transition-colors ${game.color}`}
                  >
                    Oyunu Başlat
                  </button>
                  <button
                    onClick={() => handleShowHelp(game.id)}
                    className="px-3 py-3 bg-neutral-gray dark:bg-dark-border text-gray-600 dark:text-dark-text-secondary rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-color dark:text-dark-text mb-4">
              🌟 Fizik Kavramları Öğren
            </h2>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
              Temel fizik kavramlarını oyunlarla keşfet!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <div className="text-3xl mb-2">🚗</div>
              <h3 className="font-bold mb-1 text-blue-800 dark:text-blue-300">Hareket</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Hızlı, yavaş ve durgun kavramları</p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="font-bold mb-1 text-green-800 dark:text-green-300">Ağırlık</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Ağır ve hafif nesneler</p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-bold mb-1 text-blue-800 dark:text-blue-300">Akış</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Su ve hava akışı</p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="font-bold mb-1 text-blue-800 dark:text-blue-300">Kuvvet</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">İtme ve çekme kuvvetleri</p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="mt-6 p-4 bg-neutral-gray dark:bg-dark-border rounded-xl">
            <h3 className="font-bold text-text-color dark:text-dark-text mb-2">🎯 Öğrenme Hedefleri:</h3>
            <ul className="text-sm text-gray-600 dark:text-dark-text-secondary space-y-1">
              <li>• Hareket kavramlarını anlama (hızlı, yavaş, durgun)</li>
              <li>• Ağırlık farklarını fark etme ve karşılaştırma</li>
              <li>• Akış kavramını öğrenme (su, hava, katı)</li>
              <li>• Temel kuvvet türlerini tanıma</li>
              <li>• Fiziksel dünyayı gözlemleme becerisini geliştirme</li>
            </ul>
          </div>

          {/* Safety Note */}
          <div className="mt-4 p-4 bg-encourage-orange/20 dark:bg-encourage-orange/10 rounded-xl border-l-4 border-encourage-orange">
            <div className="flex">
              <div className="text-encourage-orange mr-3 text-xl">💡</div>
              <div>
                <h4 className="font-bold text-text-color dark:text-dark-text mb-1">Güvenlik Notu:</h4>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  Bu oyunlar sadece teorik öğrenme içindir. Gerçek deneyleri her zaman bir yetişkin gözetiminde yapın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <GameHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        gameType={helpGameType}
        gameName="Fizik Oyunları"
      />
    </div>
  );
}