'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NatureExploration from './NatureExploration';
import ChemistryBasics from './ChemistryBasics';
import SpaceAndSky from './SpaceAndSky';
import GameHelpModal from '@/components/GameHelpModal';

type GameType = 'menu' | 'nature' | 'chemistry' | 'space';

export default function SciencePage() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('nature');
  const router = useRouter();

  const games = [
    {
      id: 'nature' as GameType,
      title: '🌳 Doğa Keşfi',
      description: 'Canlı ve cansız varlıkları tanı',
      color: 'bg-success-green text-white',
      icon: '🌳',
    },
    {
      id: 'chemistry' as GameType,
      title: '🧪 Sihirli Renkler',
      description: 'Renkleri karıştırıp yeni renkler üret',
      color: 'bg-focus-blue text-white',
      icon: '🧪',
    },
    {
      id: 'space' as GameType,
      title: '⭐ Uzay ve Gökyüzü',
      description: 'Gece, gündüz ve gökyüzü cisimlerini keşfet',
      color: 'bg-encourage-orange text-white',
      icon: '⭐',
    }
  ];

  const handleBackToMenu = () => setCurrentGame('menu');
  const handleBackToModules = () => router.push('/modules');

  const handleShowHelp = (gameType: string) => {
    setHelpGameType(gameType);
    setShowHelpModal(true);
  };

  if (currentGame === 'nature') return <NatureExploration onBack={handleBackToMenu} />;
  if (currentGame === 'chemistry') return <ChemistryBasics onBack={handleBackToMenu} />;
  if (currentGame === 'space') return <SpaceAndSky onBack={handleBackToMenu} />;

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg transition-colors duration-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
          <button
            onClick={handleBackToModules}
            className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
          >
            ← Modüllere Dön
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-extrabold text-focus-blue">
              🌱 Fen Bilimleri
            </h1>
            <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">
              Doğayı, renkleri ve gökyüzünü eğlenceli oyunlarla keşfet!
            </p>
          </div>

          <button
            onClick={() => handleShowHelp('nature')}
            className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
          >
            ❓ Yardım
          </button>
        </div>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-gray-200 dark:border-dark-border hover:border-focus-blue transition-all duration-300 overflow-hidden transform hover:scale-[1.02] animate-slow-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 bg-gray-50 dark:bg-dark-border w-24 h-24 mx-auto rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
                    {game.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-2">
                    {game.title}
                  </h3>
                  <p className="text-base font-bold text-gray-600 dark:text-dark-text-secondary">
                    {game.description}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentGame(game.id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-extrabold transition-opacity hover:opacity-90 ${game.color}`}
                  >
                    BAŞLA
                  </button>
                  <button
                    onClick={() => handleShowHelp(game.id)}
                    className="px-4 py-3 bg-gray-100 dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    title="Oyun kurallarını görüntüle"
                  >
                    ❓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Science Concepts Section */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-focus-blue mb-4">
              🌟 Fen Kavramlarını Öğren
            </h2>
            <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">
              Temel fen kavramlarını oyunlarla keşfet!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-center">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="font-extrabold text-lg text-text-color dark:text-dark-text mb-2">Doğa</h3>
              <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Canlı ve cansız varlıklar</p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-center">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="font-extrabold text-lg text-text-color dark:text-dark-text mb-2">Renkler</h3>
              <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Renk karışımları ve tonlar</p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-extrabold text-lg text-text-color dark:text-dark-text mb-2">Gökyüzü</h3>
              <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Gece ve gündüz kavramları</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Objectives */}
            <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
              <h3 className="font-extrabold text-focus-blue mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> Öğrenme Hedefleri:
              </h3>
              <ul className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary space-y-3">
                <li>• Canlı ve cansız varlıklar arasındaki farkı kavrama</li>
                <li>• Ana renklerin karışım sonuçlarını öğrenme</li>
                <li>• Gece ve gündüz kavramlarını anlama</li>
                <li>• Gökyüzü cisimlerini tanıma ve sınıflandırma</li>
                <li>• Doğayı gözlemleme becerisini geliştirme</li>
              </ul>
            </div>

            {/* Safety Note */}
            <div className="p-6 bg-focus-blue/5 dark:bg-focus-blue/10 border-2 border-focus-blue/20 rounded-2xl flex flex-col justify-center">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="font-extrabold text-focus-blue mb-2 text-lg">Güvenlik Notu:</h4>
                  <p className="text-sm font-bold text-gray-700 dark:text-dark-text-secondary leading-relaxed">
                    Bu oyunlar temel fen kavramlarını eğlenceli ve güvenli bir şekilde öğretmeyi amaçlar. Gerçek deneyleri her zaman bir yetişkin gözetiminde yapın.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showHelpModal && (
        <GameHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          gameType={helpGameType}
          gameName="Fen Bilimleri Oyunları"
        />
      )}
    </div>
  );
}
