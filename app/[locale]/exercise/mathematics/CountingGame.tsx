'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface CountingGameProps {
  onBack: () => void;
}

interface CountingQuestion {
  items: string[];
  correctCount: number;
  objectType: string;
  emoji: string;
}

const objectTypes = [
  { name: 'elma', emoji: '🍎' },
  { name: 'yıldız', emoji: '⭐' },
  { name: 'kalp', emoji: '💙' }, // Switched from red heart to blue heart
  { name: 'çiçek', emoji: '🌸' },
  { name: 'araba', emoji: '🚙' }, // Switched from red car to blue SUV
  { name: 'balon', emoji: '🎈' },
  { name: 'kelebek', emoji: '🦋' },
  { name: 'top', emoji: '⚽' },
];

// Sayı ses dosyaları mapping
const numberAudioPaths: Record<number, string> = {
  1: '/audio/numbers/1.mp3',
  2: '/audio/numbers/2.mp3',
  3: '/audio/numbers/3.mp3',
  4: '/audio/numbers/4.mp3',
  5: '/audio/numbers/5.mp3',
  6: '/audio/numbers/6.mp3',
  7: '/audio/numbers/7.mp3',
  8: '/audio/numbers/8.mp3',
  9: '/audio/numbers/9.mp3',
  10: '/audio/numbers/10.mp3',
};

export default function CountingGame({ onBack }: CountingGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<CountingQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [showCounting, setShowCounting] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  // Sayı ses dosyasını çal - static dosya varsa onu kullan, yoksa ElevenLabs
  const playNumberAudio = async (number: number) => {
    const audioPath = numberAudioPaths[number];
    if (audioPath) {
      try {
        const audio = new Audio(audioPath);
        await audio.play();
        console.log(`✅ Static number audio played: ${audioPath}`);
      } catch (error) {
        console.log(`❌ Static number audio failed, using ElevenLabs: ${error}`);
        await speak(number.toString(), 'word');
      }
    } else {
      await speak(number.toString(), 'word');
    }
  };

  const generateQuestion = () => {
    const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const count = Math.floor(Math.random() * 8) + 1; // 1-8 arası
    
    const items = Array(count).fill(objectType.emoji);
    
    const question: CountingQuestion = {
      items,
      correctCount: count,
      objectType: objectType.name,
      emoji: objectType.emoji,
    };
    
    setCurrentQuestion(question);
    setShowFeedback(false);
    setSelectedCount(null);
    setShowCounting(false);
    setIsAnswering(false);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Kaç tane ${objectType.name} var? Sayalım!`, 'sentence');
    }, 500);
  };

  useEffect(() => {
    speak('Sayma oyununa hoş geldin! Nesneleri sayalım.', 'sentence');
    generateQuestion();
  }, [speak]);

  const handleCountSelection = async (count: number) => {
    if (!currentQuestion || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedCount(count);
    const correct = count === currentQuestion.correctCount;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTotalQuestions(prev => prev + 1);
      setScore(prev => prev + 1);
      await speak(`Aferin! ${currentQuestion.correctCount} doğru cevap!`, 'celebration');
      // Sadece doğru bilindiğinde yeni soruya geç
      setTimeout(() => {
        generateQuestion();
      }, 1000);
    } else {
      await speak('Bir daha sayalım.', 'sentence');
      // Yanlış bilindiğinde soruyu değiştirme, kilidi aç
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setSelectedCount(null);
      }, 500);
    }
  };

  const showCountingAnimation = async () => {
    if (!currentQuestion) return;
    
    setShowCounting(true);
    await speak('Birlikte sayalım:', 'sentence');
    
    // Her nesneyi tek tek say
    for (let i = 1; i <= currentQuestion.correctCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      await playNumberAudio(i);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await speak(`Toplam ${currentQuestion.correctCount} tane ${currentQuestion.objectType}!`, 'sentence');
    
    setShowCounting(false);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg flex items-center justify-center transition-colors duration-500">
        <div className="text-2xl font-bold text-text-color dark:text-dark-text">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="secondary">
            ← Geri Dön
          </Button>
          <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-dark-border">
            <span className="text-lg font-bold text-success-green">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-focus-blue mb-4">🔢 Sayma Oyunu</h1>
          <p className="text-xl text-gray-600 dark:text-dark-text-secondary font-bold">Nesneleri say ve doğru sayıyı seç!</p>
        </div>

        {/* Objects Display */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-4">
              Kaç tane {currentQuestion.objectType} var?
            </h2>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-6 max-w-3xl mx-auto mb-10">
            {currentQuestion.items.map((item, index) => (
              <div
                key={index}
                className={`
                  aspect-square bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-100 dark:border-gray-700
                  flex items-center justify-center text-[4rem] transition-all duration-300
                  ${showCounting && index < (selectedCount || 0) ? 'border-focus-blue bg-focus-blue/10 scale-110' : ''}
                `}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={showCountingAnimation}
              disabled={showCounting}
              className="px-8 py-4 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-xl"
            >
              {showCounting ? '🔄 Sayıyor...' : '🔍 Birlikte Sayalım'}
            </button>
          </div>
        </div>

        {/* Count Options */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((count) => (
            <button
              key={count}
              onClick={() => handleCountSelection(count)}
              disabled={isAnswering || showCounting}
              className={`
                aspect-square bg-white dark:bg-dark-surface rounded-2xl transition-all duration-300
                text-3xl font-extrabold border-4 flex items-center justify-center
                ${(isAnswering || showCounting) ? 'cursor-default opacity-60' : 'cursor-pointer hover:border-focus-blue hover:scale-105'}
                ${showFeedback && count === currentQuestion.correctCount ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400' : ''}
                ${showFeedback && count === selectedCount && !isCorrect ? 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-400' : ''}
                ${!showFeedback ? 'border-gray-200 dark:border-dark-border text-focus-blue' : ''}
              `}
            >
              {count}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center mt-8 p-6 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
              {isCorrect ? '🎉 Doğru!' : '💡 Haydi tekrar düşünelim!'}
            </div>
            {!isCorrect && (
              <div className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary mt-4">
                Doğru cevap: {currentQuestion.correctCount} tane {currentQuestion.objectType}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}