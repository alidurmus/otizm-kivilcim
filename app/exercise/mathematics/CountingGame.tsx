'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

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
  { name: 'kalp', emoji: '❤️' },
  { name: 'çiçek', emoji: '🌸' },
  { name: 'araba', emoji: '🚗' },
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
    if (!currentQuestion) return;
    
    setSelectedCount(count);
    const correct = count === currentQuestion.correctCount;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      await speak(`Aferin! ${currentQuestion.correctCount} doğru cevap!`, 'celebration');
    } else {
      await speak(`Doğru cevap ${currentQuestion.correctCount} idi. Tekrar sayalım.`, 'sentence');
    }
    
    // 3 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 3000);
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
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="text-2xl">Yükleniyor...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            ← Geri Dön
          </button>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <span className="text-lg font-semibold text-green-600">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔢 Sayma Oyunu</h1>
          <p className="text-gray-600">Nesneleri say ve doğru sayıyı seç!</p>
        </div>

        {/* Objects Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Kaç tane {currentQuestion.objectType} var?
            </h2>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-6">
            {currentQuestion.items.map((item, index) => (
              <div
                key={index}
                className={`
                  aspect-square bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg
                  flex items-center justify-center text-6xl transition-all duration-300
                  ${showCounting && index < (selectedCount || 0) ? 'ring-4 ring-green-500 scale-110' : ''}
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
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors disabled:opacity-50"
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
              disabled={showFeedback || showCounting}
              className={`
                aspect-square bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                text-3xl font-bold text-green-600 hover:bg-green-50
                ${showFeedback && count === currentQuestion.correctCount ? 'bg-green-100 ring-4 ring-green-500' : ''}
                ${showFeedback && count === selectedCount && !isCorrect ? 'bg-red-100 ring-4 ring-red-500' : ''}
                ${showFeedback || showCounting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              `}
            >
              {count}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center mt-8">
            <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '🎉 Doğru!' : '❌ Yanlış'}
            </div>
            {!isCorrect && (
              <div className="text-gray-600 mt-2">
                Doğru cevap: {currentQuestion.correctCount} tane {currentQuestion.objectType}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 