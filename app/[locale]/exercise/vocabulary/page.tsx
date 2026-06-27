'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WordMatchingGame from './WordMatchingGame';
import HafizaOyunu from './HafizaOyunu';
import GameHelpModal from '@/components/GameHelpModal';

type GameType = 'menu' | 'word-matching' | 'memory';

interface GameInfo {
  id: GameType;
  title: string;
  emoji: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
}

export default function VocabularyPage() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('word-matching');
  const router = useRouter();

  const games: GameInfo[] = [
    {
      id: 'word-matching',
      title: 'Kelime Eşleştirme',
      emoji: '🎯',
      description: 'Kelimeleri doğru resimlerle eşleştir ve kelime hazineni geliştir!',
      gradientFrom: 'from-blue-400/80',
      gradientTo: 'to-cyan-400/80',
      iconBg: 'bg-blue-500/20',
    },
    {
      id: 'memory',
      title: 'Hafıza Oyunu',
      emoji: '🧠',
      description: 'Eşleşen kartları bul, hafızanı güçlendir!',
      gradientFrom: 'from-emerald-400/80',
      gradientTo: 'to-teal-400/80',
      iconBg: 'bg-emerald-500/20',
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
    <div className="min-h-screen soft-gradient-bg p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-slow-slide-up">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToModules}
              className="glass-panel inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-adaptive rounded-xl hover:scale-[1.03] transition-all duration-500"
              aria-label="Modüllere geri dön"
            >
              <span className="text-lg">←</span>
              Modüllere Dön
            </button>
            <button
              onClick={() => handleShowHelp('word-matching')}
              className="glass-panel inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-focus-blue rounded-xl hover:scale-[1.03] transition-all duration-500"
              aria-label="Yardım menüsünü aç"
            >
              <span className="text-lg">❓</span>
              Yardım
            </button>
          </div>

          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="text-5xl md:text-6xl" role="img" aria-label="Kitap ikonu">📚</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-adaptive mb-3 tracking-tight">
              Anlam ve Kelime Dağarcığı
            </h1>
            <p className="text-lg text-adaptive-secondary max-w-md mx-auto">
              Kelimeler ve anlamlarıyla oyna, öğren ve eğlen!
            </p>
          </div>
        </div>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="glass-panel premium-shadow rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient Banner */}
              <div className={`bg-gradient-to-r ${game.gradientFrom} ${game.gradientTo} p-6 relative overflow-hidden`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/10 blur-lg" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`w-14 h-14 ${game.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border border-white/20`}>
                    {game.emoji}
                  </div>
                  <h3 className="text-xl font-extrabold text-white drop-shadow-sm">
                    {game.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-adaptive-secondary text-sm mb-5 leading-relaxed">
                  {game.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentGame(game.id)}
                    className={`flex-1 py-3.5 px-5 rounded-xl text-white font-bold bg-gradient-to-r ${game.gradientFrom} ${game.gradientTo} hover:shadow-lg hover:scale-[1.02] transition-all duration-500`}
                    aria-label={`${game.title} oyununu başlat`}
                  >
                    ▶ Oyunu Başlat
                  </button>
                  <button
                    onClick={() => handleShowHelp(game.id)}
                    className="px-4 py-3.5 glass-panel text-adaptive-secondary rounded-xl hover:scale-[1.05] transition-all duration-500"
                    aria-label={`${game.title} oyun kurallarını görüntüle`}
                  >
                    ❓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="glass-panel premium-shadow rounded-2xl p-8 animate-slow-slide-up">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-adaptive mb-6">
              🌟 Kelime Dağarcığını Geliştir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-xl p-5 hover:scale-[1.02] transition-all duration-500">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                  🎯
                </div>
                <h3 className="font-bold text-adaptive mb-1">Eşleştirme</h3>
                <p className="text-sm text-adaptive-secondary">Kelimeler ve resimleri doğru şekilde eşleştir</p>
              </div>
              <div className="glass-panel rounded-xl p-5 hover:scale-[1.02] transition-all duration-500">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                  🧠
                </div>
                <h3 className="font-bold text-adaptive mb-1">Hafıza</h3>
                <p className="text-sm text-adaptive-secondary">Kartları çevir ve eşleşenleri bul</p>
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