'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import { ExerciseErrorBoundary } from '@/components/ErrorBoundary';

interface Card {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardContents = ['🐱', '🐶', '🐸', '🐨', '🦁', '🐰'];

// Emoji'leri Türkçe kelimelerle eşleştiren mapping
const emojiToTurkish: { [key: string]: string } = {
  '🐱': 'kedi',
  '🐶': 'köpek',
  '🐸': 'kurbağa',
  '🐨': 'koala',
  '🦁': 'aslan',
  '🐰': 'tavşan'
};

function HafizaOyunuCore({ onBack }: { onBack?: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const { speak } = useElevenLabs();

  // Initialize cards
  useEffect(() => {
    const shuffledCards = [...cardContents, ...cardContents]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: `card-${index}`,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
  }, []);

  const handleCardClick = async (cardId: string) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Kartın Türkçe ismini söyle
    const turkishName = emojiToTurkish[card.content];
    if (turkishName) {
      await speak(turkishName, 'word');
    }

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      if (firstCard?.content === secondCard?.content) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isMatched: true }
              : c
          ));
          setScore(prev => prev + 10);
          speak('Harika! Eşleştirmeyi buldun!', 'celebration');
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        speak('Bir daha deneyelim.', 'sentence');
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isGameComplete = cards.length > 0 && cards.every(card => card.isMatched);

  useEffect(() => {
    if (isGameComplete) {
      speak('Tebrikler! Tüm eşleştirmeleri buldun!', 'celebration');
    }
  }, [isGameComplete, speak]);

  const resetGame = () => {
    const shuffledCards = [...cardContents, ...cardContents]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: `card-${index}`,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
  };

  return (
    <div className="min-h-screen soft-gradient-bg p-4 md:p-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-panel premium-shadow rounded-2xl p-6 md:p-8 mb-6 animate-slow-slide-up">
          <div className="text-center">
            <div className="inline-block mb-3">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-4xl mx-auto">
                🧠
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-adaptive mb-2 tracking-tight">
              Hafıza Oyunu
            </h1>
            <p className="text-adaptive-secondary text-base mb-6">
              Aynı kartları bularak eşleştir!
            </p>
            <div className="flex justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-5 py-2.5 rounded-xl font-bold text-lg">
                <span>⭐</span>
                <span>Puan: {score}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-5 py-2.5 rounded-xl font-bold text-lg">
                <span>🔄</span>
                <span>Hamle: {moves}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {isGameComplete && (
          <div className="glass-panel rounded-2xl p-6 text-center mb-6 border-2 border-emerald-400/50 animate-slow-slide-up">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">
              Tebrikler!
            </h2>
            <p className="text-emerald-600 dark:text-emerald-300 font-semibold">
              {moves} hamlede tüm eşleştirmeleri başarıyla buldun!
            </p>
          </div>
        )}

        {/* Game Board */}
        <div className="glass-panel premium-shadow rounded-2xl p-6 md:p-8 mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto [perspective:1000px]">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || flippedCards.length >= 2}
                aria-label={`Hafıza kartı: ${card.isMatched || card.isFlipped ? card.content : 'kapalı'}`}
                className="relative aspect-square w-full rounded-2xl cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
              >
                <div
                  className={`absolute inset-0 w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${
                    card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Front of card (Face down) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <div className="w-full h-full glass-panel rounded-2xl flex items-center justify-center text-4xl border-2 border-transparent group-hover:border-emerald-400/30 group-hover:scale-[1.02] transition-all duration-300">
                      ❓
                    </div>
                  </div>

                  {/* Back of card (Face up) */}
                  <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl flex items-center justify-center text-5xl border-2 shadow-lg transition-colors duration-300 ${
                    card.isMatched 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400' 
                      : 'glass-panel border-focus-blue'
                  }`}>
                    <span className={card.isMatched ? 'opacity-70 scale-90 transition-all duration-500' : 'animate-slow-slide-up'}>
                      {card.content}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="glass-panel px-6 py-3.5 rounded-xl font-bold text-adaptive hover:scale-[1.03] transition-all duration-500"
              aria-label="Menüye geri dön"
            >
              ← Geri Dön
            </button>
          )}
          <button
            onClick={resetGame}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-400/80 to-teal-400/80 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.03] transition-all duration-500"
            aria-label="Oyunu tekrar başlat"
          >
            🔄 Yeni Oyun
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HafizaOyunu({ onBack }: { onBack?: () => void }) {
  return (
    <ExerciseErrorBoundary
      exerciseName="Hafıza Oyunu"
      onBackToMenu={onBack}
      onRetry={() => {
        window.location.reload();
      }}
    >
      <HafizaOyunuCore onBack={onBack} />
    </ExerciseErrorBoundary>
  );
}
