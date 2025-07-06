'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

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

export default function HafizaOyunu({ onBack }: { onBack?: () => void }) {
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

    // Kartın Türkçe ismini Gülsu ile söyle
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
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1500);
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🧠 Hafıza Oyunu
        </h1>
        <p className="text-gray-600 mb-4">
          Aynı kartları bularak eşleştir!
        </p>
        <div className="flex justify-center gap-8 text-lg font-semibold">
          <div className="text-blue-600">Puan: {score}</div>
          <div className="text-purple-600">Hamle: {moves}</div>
        </div>
      </div>

      {isGameComplete && (
        <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 text-center mb-8">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Tebrikler!
          </h2>
          <p className="text-green-700">
            {moves} hamlede tüm eşleştirmeleri buldun!
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || flippedCards.length >= 2}
            className={`
              aspect-square rounded-xl text-3xl font-bold transition-all duration-300
              ${card.isMatched
                ? 'bg-green-200 text-green-800 cursor-not-allowed'
                : card.isFlipped
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
              }
            `}
          >
            {card.isFlipped || card.isMatched ? card.content : '?'}
          </button>
        ))}
      </div>

      <div className="text-center space-x-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          🔄 Yeni Oyun
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            ← Geri Dön
          </button>
        )}
      </div>
    </div>
  );
}
