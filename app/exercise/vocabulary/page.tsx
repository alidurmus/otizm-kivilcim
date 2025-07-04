'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import KivilcimIcon from '@/components/KivilcimIcon';
import KelimeEsleştirmeOyunu from './KelimeEsleştirmeOyunu';
import HafizaOyunu from './HafizaOyunu';

// Oyun seçimi için bir arayüz
const GameSelection = ({ onSelectGame }: { onSelectGame: (game: 'matching' | 'memory') => void }) => (
  <div className="text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-adaptive mb-4">
      Anlam ve Kelime Dağarcığı
    </h1>
    <p className="text-lg text-adaptive-secondary max-w-2xl mx-auto mb-12">
      Hangi oyunu oynamak istersin? Kelimeleri resimlerle eşleştir veya hafızanı test et!
    </p>
    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
      <div 
        className="bg-adaptive rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={() => onSelectGame('matching')}
      >
        <div className="text-5xl mb-4">🖼️</div>
        <h2 className="text-2xl font-bold text-adaptive mb-2">Resim Eşleştirme</h2>
        <p className="text-adaptive-secondary">Kelimeleri doğru resimlerle birleştir.</p>
      </div>
      <div 
        className="bg-adaptive rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={() => onSelectGame('memory')}
      >
        <div className="text-5xl mb-4">🧠</div>
        <h2 className="text-2xl font-bold text-adaptive mb-2">Hafıza Oyunu</h2>
        <p className="text-adaptive-secondary">Aynı kart çiftlerini bul.</p>
      </div>
    </div>
  </div>
);

export default function VocabularyPage() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<'matching' | 'memory' | null>(null);

  const handleGameSelection = (game: 'matching' | 'memory') => {
    setSelectedGame(game);
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500 p-4 md:p-6">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => selectedGame ? handleBackToSelection() : router.push('/modules')}
          >
            {selectedGame ? '← Oyun Seçimine Dön' : '← Modüllere Dön'}
          </Button>
          <KivilcimIcon size={60} />
        </div>

        <div className="max-w-4xl mx-auto">
          {!selectedGame && <GameSelection onSelectGame={handleGameSelection} />}
          {selectedGame === 'matching' && <KelimeEsleştirmeOyunu onBack={handleBackToSelection} />}
          {selectedGame === 'memory' && <HafizaOyunu onBack={handleBackToSelection} />}
        </div>
      </div>
    </div>
  );
}