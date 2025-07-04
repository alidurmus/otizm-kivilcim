'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WordMatchingGame from './WordMatchingGame';
import HafizaOyunu from './HafizaOyunu';
import GameHelpModal from '@/components/GameHelpModal';

type GameType = 'menu' | 'word-matching' | 'memory';

export default function VocabularyPage() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('word-matching');
  const router = useRouter();

  const games = [
    {
      id: 'word-matching' as GameType,
      title: '🎯 Kelime Eşleştirme',
      description: 'Kelimeleri doğru resimlerle eşleştir',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'memory' as GameType,
      title: '🧠 Hafıza Oyunu',
      description: 'Eşleşen kartları bul ve hatırla',
      color: 'bg-green-500 hover:bg-green-600',
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

  if (currentGame === 'word-matching') {
    return <WordMatchingGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'memory') {
    return <HafizaOyunu onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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
              onClick={() => handleShowHelp('word-matching')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Anlam ve Kelime Dağarcığı
          </h1>
          <p className="text-lg text-gray-600">
            Kelimeler ve anlamlarıyla oyna, öğren!
          </p>
        </div>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {game.title}
                </h3>
                <p className="text-gray-600 mb-4">
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

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌟 Kelime Dağarcığını Geliştir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Eşleştirme</h3>
                <p>Kelimeler ve resimleri doğru şekilde eşleştir</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-1">Hafıza</h3>
                <p>Kartları çevir ve eşleşenleri bul</p>
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
        gameName=""
      />
    </div>
  );
}