'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

interface CountingGameProps {
  onBack: () => void;
}

interface CountingQuestion {
  objects: string[];
  correctCount: number;
  options: number[];
  objectType: string;
  emoji: string;
}

const objectTypes = [
  { name: 'elmalar', emoji: '🍎', color: 'text-red-500' },
  { name: 'yıldızlar', emoji: '⭐', color: 'text-yellow-500' },
  { name: 'kalpler', emoji: '❤️', color: 'text-pink-500' },
  { name: 'toplar', emoji: '⚽', color: 'text-blue-500' },
  { name: 'çiçekler', emoji: '🌸', color: 'text-pink-400' },
  { name: 'araba', emoji: '🚗', color: 'text-blue-600' },
  { name: 'kelebek', emoji: '🦋', color: 'text-purple-500' },
  { name: 'köpek', emoji: '🐕', color: 'text-amber-600' },
];

export default function CountingGame({ onBack }: CountingGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<CountingQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { speak } = useElevenLabs();

  const generateQuestion = useCallback(() => {
    const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const count = Math.floor(Math.random() * 8) + 1; // 1-8 arası nesne
    
    // Nesne dizisi oluştur
    const objects = Array(count).fill(objectType.emoji);
    
    // Seçenekler oluştur (doğru cevap + 3 yanlış)
    const wrongOptions: number[] = [];
    while (wrongOptions.length < 3) {
      const wrong = Math.floor(Math.random() * 10) + 1;
      if (wrong !== count && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }
    
    const options = [count, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      objects,
      correctCount: count,
      options,
      objectType: objectType.name,
      emoji: objectType.emoji
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Kaç tane ${objectType.name} var? Sayalım!`, 'sentence');
    }, 1000);
  }, [speak]);

  useEffect(() => {
    generateQuestion();
    speak('Sayma oyununa hoş geldin! Nesneleri sayalım.', 'sentence');
  }, [generateQuestion, speak]);

  const handleAnswer = async (answer: number) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctCount;
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

  const countObjects = async () => {
    if (!currentQuestion) return;
    
    await speak('Birlikte sayalım:', 'sentence');
    
    // Her nesne için sayma sesi
    for (let i = 1; i <= currentQuestion.correctCount; i++) {
      setTimeout(() => {
        speak(i.toString(), 'word');
      }, i * 800);
    }
    
    setTimeout(() => {
      speak(`Toplam ${currentQuestion.correctCount} tane ${currentQuestion.objectType}!`, 'sentence');
    }, (currentQuestion.correctCount + 1) * 800);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🧮</div>
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧮 Sayma Oyunu</h1>
          <p className="text-gray-600">Nesneleri say ve doğru sayıyı seç!</p>
        </div>

        {/* Objects Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Kaç tane {currentQuestion.objectType} var?
            </h2>
            
            {/* Objects Grid */}
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {currentQuestion.objects.map((obj, index) => (
                <div
                  key={index}
                  className="text-6xl animate-pulse hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {obj}
                </div>
              ))}
            </div>
          </div>
          
          {/* Count Helper Button */}
          <div className="text-center">
            <button
              onClick={countObjects}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              👆 Birlikte Sayalım
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Cevabını seç:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`
                  aspect-square bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  text-4xl font-bold border-4 
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.correctCount
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-200 text-green-600 hover:border-green-300'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center mt-8">
            <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '🎉 Harika!' : '🤔 Tekrar Deneyelim'}
            </div>
            <div className="text-gray-600 text-lg">
              {isCorrect 
                ? `Evet! ${currentQuestion.correctCount} tane ${currentQuestion.objectType} var.`
                : `Doğru cevap ${currentQuestion.correctCount} idi.`
              }
            </div>
          </div>
        )}

        {/* Game Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">💡 Sayma İpuçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">👆</div>
              <p className="text-blue-800">Parmaklarınla işaret ederek say</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🔢</div>
              <p className="text-green-800">Her nesne için bir sayı söyle</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-purple-800">Son söylediğin sayı toplam sayıdır</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 