'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface Props {
  onBack: () => void;
}

const items = [
  { name: 'Ağaç', emoji: '🌳', isAlive: true, desc: 'Ağaçlar büyür ve suya ihtiyaç duyar.' },
  { name: 'Taş', emoji: '🪨', isAlive: false, desc: 'Taşlar cansızdır, büyümezler.' },
  { name: 'Kedi', emoji: '🐱', isAlive: true, desc: 'Kediler yemek yer ve hareket eder.' },
  { name: 'Araba', emoji: '🚗', isAlive: false, desc: 'Arabalar hareket eder ama cansızdır.' },
  { name: 'Çiçek', emoji: '🌻', isAlive: true, desc: 'Çiçekler güneş ışığıyla büyür.' },
  { name: 'Kitap', emoji: '📚', isAlive: false, desc: 'Kitaplar cansız nesnelerdir.' },
  { name: 'Kuş', emoji: '🐦', isAlive: true, desc: 'Kuşlar uçar, yemek yer ve yuva yapar.' },
  { name: 'Sandalye', emoji: '🪑', isAlive: false, desc: 'Sandalyeler cansız nesnelerdir.' },
];

export default function NatureExploration({ onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  const currentItem = items[currentIndex];

  useEffect(() => {
    speak('Doğa keşfine hoş geldin! Ekrana gelen varlığın canlı mı cansız mı olduğunu bul.', 'sentence');
  }, []);

  const handleAnswer = useCallback(async (answerIsAlive: boolean) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const correct = answerIsAlive === currentItem.isAlive;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalAnswered(prev => prev + 1);

    if (correct) {
      setScore(s => s + 1);
      await speak(`Aferin! ${currentItem.name} ${currentItem.isAlive ? 'canlıdır' : 'cansızdır'}. ${currentItem.desc}`, 'celebration');
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 1500);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
      }, 500);
    }
  }, [currentItem, isAnswering, speak]);

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg transition-colors duration-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="secondary">← Geri Dön</Button>
          <div className="bg-white dark:bg-dark-surface px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border">
            <span className="text-xl font-extrabold text-focus-blue">
              Puan: {score}/{totalAnswered}
            </span>
          </div>
        </div>

        <div className="text-center mb-8 bg-white dark:bg-dark-surface p-6 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">🌳 Doğa Keşfi</h1>
          <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">Canlı ve cansız varlıkları ayırt etmeyi öğrenelim!</p>
        </div>

        {/* Main Game Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10 mb-8 text-center animate-gentle-bounce">
          <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-8">
            Bu varlık canlı mı, yoksa cansız mı?
          </h2>
          
          <div className="text-9xl mb-6">{currentItem.emoji}</div>
          <p className="text-2xl text-text-color dark:text-dark-text font-extrabold mb-10">{currentItem.name}</p>

          {!showFeedback ? (
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleAnswer(true)}
                disabled={isAnswering}
                className="py-4 px-10 bg-success-green hover:opacity-90 text-white rounded-xl text-2xl font-extrabold transition-all duration-300 disabled:opacity-50"
              >
                🌱 Canlı
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={isAnswering}
                className="py-4 px-10 bg-gray-400 hover:bg-gray-500 text-white rounded-xl text-2xl font-extrabold transition-all duration-300 disabled:opacity-50"
              >
                🪨 Cansız
              </button>
            </div>
          ) : (
            <div className={`text-center mt-6 p-6 rounded-2xl border-4 ${isCorrect ? 'bg-success-green/10 border-success-green' : 'bg-encourage-orange/10 border-encourage-orange'}`}>
              <div className={`text-3xl font-extrabold mb-4 ${isCorrect ? 'text-green-700 dark:text-green-500' : 'text-orange-700 dark:text-orange-500'}`}>
                {isCorrect ? '🎉 Harika, doğru bildin!' : '💡 Haydi tekrar düşünelim'}
              </div>
              <div className="text-gray-700 dark:text-dark-text text-xl font-bold">
                {currentItem.desc}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8">
          <h3 className="text-2xl font-extrabold text-focus-blue mb-6 text-center flex justify-center items-center gap-2">
            <span className="text-3xl">🧪</span> Fen Bilgisi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div className="text-center p-6 bg-success-green/10 dark:bg-green-900/20 rounded-2xl border-2 border-success-green/30">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="font-extrabold text-green-800 dark:text-green-300 mb-2 text-xl">Canlı Varlıklar</h4>
              <p className="text-green-700 dark:text-green-400 font-bold">Büyür, beslenir ve hareket eder</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🪨</div>
              <h4 className="font-extrabold text-gray-800 dark:text-dark-text mb-2 text-xl">Cansız Varlıklar</h4>
              <p className="text-gray-600 dark:text-dark-text-secondary font-bold">Büyümez, beslenmez, kendiliğinden hareket etmez</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
