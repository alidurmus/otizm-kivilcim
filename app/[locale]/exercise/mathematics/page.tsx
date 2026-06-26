'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useElevenLabs } from '@/lib/elevenlabs';
import NumberRecognitionGame from './NumberRecognitionGame';
import AdditionGame from './AdditionGame';
import CountingGame from './CountingGame';
import ShapeNumberGame from './ShapeNumberGame';
import MathProblemsGame from './MathProblemsGame';
import VisualMathGame from './VisualMathGame';
import GameHelpModal from '@/components/GameHelpModal';

type GameType = 'menu' | 'number-recognition' | 'addition' | 'counting' | 'shape-number' | 'math-problems' | 'visual-math';

export default function MathematicsPage() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('number-recognition');
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const { speak } = useElevenLabs();
  const router = useRouter();

  // KURAL: Her modül kendi karşılama mesajı ile karşılasın
  useEffect(() => {
    if (!hasPlayedWelcome && currentGame === 'menu') {
      speak('Matematik Dünyası modülüne hoş geldin! Sayıları öğren ve temel matematik becerilerini geliştir.', 'sentence');
      setHasPlayedWelcome(true);
    }
  }, [speak, hasPlayedWelcome, currentGame]);

  const games = [
    {
      id: 'number-recognition' as GameType,
      title: '🔢 Sayı Tanıma',
      description: '1-10 arası sayıları görsel objelerle öğrenin',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '📊',
    },
    {
      id: 'addition' as GameType,
      title: '➕ Toplama Oyunları',
      description: 'Basit toplama işlemleri ve görsel matematik',
      color: 'bg-success-green hover:bg-green-600 text-text-color',
      icon: '➕',
    },
    {
      id: 'counting' as GameType,
      title: '🔢 Sayma Becerileri',
      description: 'Nesneleri sayma ve sayı-miktar ilişkilendirme',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '🔢',
    },
    {
      id: 'shape-number' as GameType,
      title: '📐 Şekil-Sayı Eşleştirme',
      description: 'Geometrik şekilleri sayılarla eşleştirin',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '📐',
    },
    {
      id: 'math-problems' as GameType,
      title: '🎯 Matematik Problemleri',
      description: 'Yaşa uygun basit matematik soruları',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '🎯',
    },
    {
      id: 'visual-math' as GameType,
      title: '📈 Görsel Matematik',
      description: 'Çizelgeler ve grafiklerle matematik öğrenin',
      color: 'bg-focus-blue hover:bg-blue-600',
      icon: '📈',
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

  const handleGameStart = (gameId: GameType) => {
    setCurrentGame(gameId);
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

  if (currentGame === 'math-problems') {
    return <MathProblemsGame onBack={handleBackToMenu} />;
  }

  if (currentGame === 'visual-math') {
    return <VisualMathGame onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-focus-blue dark:text-focus-blue mb-4">
            🔢 Matematik Dünyası
          </h1>
          <p className="text-xl text-text-color dark:text-dark-text-secondary">
            Sayıları öğrenin ve temel matematik becerilerini geliştirin
          </p>
        </div>

        {/* Activities Grid - Dynamic from games array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {games.map((game) => (
            <div key={game.id} className="bg-white dark:bg-dark-surface rounded-2xl p-6 border-2 border-gray-200 dark:border-dark-border hover:border-focus-blue dark:hover:border-focus-blue transition-colors">
              <div className="text-center">
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-focus-blue dark:text-focus-blue mb-3">
                  {game.title}
                </h3>
                <p className="text-gray-600 dark:text-dark-text-secondary mb-4">
                  {game.description}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleGameStart(game.id)}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors text-white ${game.color}`}
                  >
                    BAŞLA
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

        {/* Progress Section */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 border-2 border-gray-200 dark:border-dark-border">
          <h3 className="text-xl font-bold text-text-color dark:text-dark-text mb-4">
            📊 İlerleme Durumu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-focus-blue">0/10</div>
              <div className="text-sm text-gray-600 dark:text-dark-text-secondary font-bold">Öğrenilen Sayılar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-success-green">0/20</div>
              <div className="text-sm text-gray-600 dark:text-dark-text-secondary font-bold">Çözülen Problemler</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-focus-blue">%0</div>
              <div className="text-sm text-gray-600 dark:text-dark-text-secondary font-bold">Tamamlama Oranı</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button 
            onClick={handleBackToModules}
            className="bg-neutral-gray dark:bg-dark-border text-text-color dark:text-dark-text px-6 py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Modüllere Dön
          </button>
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