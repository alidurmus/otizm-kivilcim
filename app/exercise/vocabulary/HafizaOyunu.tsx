'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { useElevenLabs } from '@/lib/elevenlabs';

// --- Veri Yapısı ve Oyun Verisi ---
const cardPairs = ['🍎', '🍌', '🍇', '🍓', '🚗', '✈️', '🐕', '🐈'];

const generateGameDeck = () => {
  const deck = [...cardPairs, ...cardPairs];
  return deck.sort(() => Math.random() - 0.5).map((content, index) => ({
    id: index,
    content,
    isFlipped: false,
    isMatched: false,
  }));
};

// --- Bileşenler ---

const CompletionCard = ({ score, onRestart }: { score: number, onRestart: () => void }) => (
  <div className="text-center bg-adaptive rounded-2xl shadow-lg p-8">
    <div className="text-5xl mb-4">🏆</div>
    <h2 className="text-3xl font-bold text-adaptive mb-4">Tebrikler!</h2>
    <p className="text-lg text-adaptive-secondary mb-6">
      Hafıza oyununu {score} denemede tamamladın!
    </p>
    <Button variant="primary" size="large" onClick={onRestart}>
      Tekrar Oyna
    </Button>
  </div>
);

// --- Ana Oyun Bileşeni ---

export default function HafizaOyunu({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState(generateGameDeck());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [tries, setTries] = useState(0);
  const { speak } = useElevenLabs();

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTries(prev => prev + 1);
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = deck.find(c => c.id === firstCardId);
      const secondCard = deck.find(c => c.id === secondCardId);

      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        // Eşleşme var
        setDeck(prevDeck => prevDeck.map(card => 
          card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card
        ));
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        speak('Harika bir eşleşme!', 'celebration');
      } else {
        // Eşleşme yok, kartları geri çevir
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  }, [flippedCards, deck]);

  const handleCardClick = (cardId: number) => {
    const clickedCard = deck.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return;
    }

    setFlippedCards(prev => [...prev, cardId]);
  };

  const restartGame = () => {
    setDeck(generateGameDeck());
    setFlippedCards([]);
    setMatchedPairs(0);
    setTries(0);
  };

  if (matchedPairs === cardPairs.length) {
    return <CompletionCard score={tries} onRestart={restartGame} />;
  }

  return (
    <div className="w-full">
      <ProgressBar current={matchedPairs} total={cardPairs.length} label="Eşleşen Çiftler" />

      <div className="bg-adaptive rounded-2xl shadow-lg dark:shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold text-adaptive">Hafıza Oyunu</h2>
                <p className="text-adaptive-secondary">Aynı olan kartları bul.</p>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-adaptive">Deneme Sayısı</div>
                <div className="text-2xl font-bold text-focus-blue">{tries}</div>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {deck.map(card => (
            <div 
              key={card.id} 
              className="aspect-square perspective-1000"
              onClick={() => handleCardClick(card.id)}
            >
              <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
                flippedCards.includes(card.id) || card.isMatched ? 'rotate-y-180' : ''
              }`}>
                {/* Kartın Ön Yüzü (Kapalı Hali) */}
                <div className="absolute w-full h-full backface-hidden bg-encourage-orange rounded-xl flex items-center justify-center text-4xl font-bold text-white cursor-pointer shadow-lg hover:shadow-xl">
                  ?
                </div>
                {/* Kartın Arka Yüzü (Açık Hali) */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-adaptive-light dark:bg-dark-surface rounded-xl flex items-center justify-center text-5xl cursor-pointer shadow-lg">
                  {card.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
