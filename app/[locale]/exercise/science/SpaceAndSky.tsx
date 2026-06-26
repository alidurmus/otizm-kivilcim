'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface Props {
  onBack: () => void;
}

const items = [
  { name: 'Güneş', emoji: '☀️', type: 'gündüz', desc: 'Güneş gündüzleri gökyüzünde parlar ve bizi ısıtır.' },
  { name: 'Ay', emoji: '🌙', type: 'gece', desc: 'Ay geceleri gökyüzünü aydınlatır.' },
  { name: 'Yıldız', emoji: '⭐', type: 'gece', desc: 'Yıldızlar gece gökyüzünde parlak noktalar gibi görünür.' },
  { name: 'Bulut', emoji: '☁️', type: 'gündüz', desc: 'Bulutlar gündüzleri gökyüzünde beyaz pamuklara benzer.' },
  { name: 'Gökkuşağı', emoji: '🌈', type: 'gündüz', desc: 'Gökkuşağı yağmurdan sonra gündüzleri gökyüzünde belirir.' },
  { name: 'Kutup Yıldızı', emoji: '🌟', type: 'gece', desc: 'Kutup Yıldızı geceleri hep aynı yerde görünür.' },
];

export default function SpaceAndSky({ onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  const currentItem = items[currentIndex];

  useEffect(() => {
    speak('Uzay ve Gökyüzü oyununa hoş geldin! Ekrana gelen nesneyi gece mi yoksa gündüz mü görürüz?', 'sentence');
  }, []);

  const handleAnswer = useCallback(async (answer: string) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const correct = answer === currentItem.type;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalAnswered(prev => prev + 1);

    if (correct) {
      setScore(s => s + 1);
      await speak(`Aferin! ${currentItem.name} genellikle ${currentItem.type} görünür. ${currentItem.desc}`, 'celebration');
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
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">⭐ Uzay ve Gökyüzü</h1>
          <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">Gece ve gündüz kavramlarını öğrenelim!</p>
        </div>

        {/* Main Game Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10 mb-8 text-center animate-gentle-bounce">
          <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-8">
            Bunu ne zaman görebiliriz?
          </h2>
          <div className="text-9xl mb-6">{currentItem.emoji}</div>
          <p className="text-2xl text-text-color dark:text-dark-text font-extrabold mb-10">{currentItem.name}</p>

          {!showFeedback ? (
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleAnswer('gündüz')}
                disabled={isAnswering}
                className="py-4 px-10 bg-encourage-orange hover:opacity-90 text-white rounded-xl text-2xl font-extrabold transition-all duration-300 disabled:opacity-50"
              >
                ☀️ Gündüz
              </button>
              <button
                onClick={() => handleAnswer('gece')}
                disabled={isAnswering}
                className="py-4 px-10 bg-gray-800 hover:opacity-90 text-white rounded-xl text-2xl font-extrabold transition-all duration-300 disabled:opacity-50"
              >
                🌙 Gece
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
            <span className="text-3xl">🌍</span> Gökyüzü Bilgisi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div className="text-center p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">☀️</div>
              <h4 className="font-extrabold text-encourage-orange mb-2 text-xl">Gündüz</h4>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Güneş gökyüzünde parlak bir şekilde görünür</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🌙</div>
              <h4 className="font-extrabold text-gray-800 dark:text-gray-200 mb-2 text-xl">Gece</h4>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Ay ve yıldızlar gökyüzünü aydınlatır</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
