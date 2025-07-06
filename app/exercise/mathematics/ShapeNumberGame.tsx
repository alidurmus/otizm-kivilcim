'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

interface ShapeNumberGameProps {
  onBack: () => void;
}

interface ShapePattern {
  shape: string;
  count: number;
  pattern: string[][];
  color: string;
  name: string;
}

interface ShapeQuestion {
  pattern: ShapePattern;
  options: number[];
}

const _shapes = [
  { emoji: '⭐', name: 'yıldız', color: 'text-yellow-500' },
  { emoji: '💎', name: 'elmas', color: 'text-blue-500' },
  { emoji: '🔷', name: 'mavi kare', color: 'text-blue-600' },
  { emoji: '🟣', name: 'mor daire', color: 'text-purple-500' },
  { emoji: '🔶', name: 'turuncu elmas', color: 'text-orange-500' },
  { emoji: '🟢', name: 'yeşil daire', color: 'text-green-500' },
];

export default function ShapeNumberGame({ onBack }: ShapeNumberGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<ShapeQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animateShapes, setAnimateShapes] = useState(false);
  const { speak } = useElevenLabs();

  const createPattern = useCallback((count: number): string[][] => {
    const patterns: { [key: number]: string[][] } = {
      1: [['x']],
      2: [['x', 'x']],
      3: [['x', 'x', 'x']],
      4: [
        ['x', 'x'],
        ['x', 'x']
      ],
      5: [
        ['x', 'x'],
        ['x', 'x'],
        ['x', '']
      ]
    };
    
    return patterns[count] || [['x']];
  }, []);

  const generateQuestion = useCallback(() => {
    const randomShape = _shapes[Math.floor(Math.random() * _shapes.length)];
    const count = Math.floor(Math.random() * 5) + 1;
    
    const pattern: ShapePattern = {
      shape: randomShape.emoji,
      count: count,
      pattern: createPattern(count),
      color: randomShape.color,
      name: randomShape.name
    };
    
    // Yanlış seçenekler oluştur
    const options = [count];
    while (options.length < 4) {
      const randomOption = Math.floor(Math.random() * 10) + 1;
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
    // Seçenekleri karıştır
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({ pattern, options: shuffledOptions });
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnimateShapes(false);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Kaç tane ${randomShape.name} var? Şekilleri sayalım!`, 'sentence');
    }, 1000);
  }, [speak, createPattern]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = async (answer: number) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.pattern.count;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      setAnimateShapes(true);
      await speak(`Mükemmel! ${currentQuestion.pattern.count} tane ${currentQuestion.pattern.name}!`, 'celebration');
    } else {
      await speak(`${currentQuestion.pattern.count} tane ${currentQuestion.pattern.name} vardı. Tekrar sayalım.`, 'sentence');
    }
    
    // 3 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 3000);
  };

  const countShapesWithAnimation = async () => {
    if (!currentQuestion) return;
    
    await speak('Şekilleri tek tek sayalım:', 'sentence');
    
    let count = 0;
    for (let row = 0; row < currentQuestion.pattern.pattern.length; row++) {
      for (let col = 0; col < currentQuestion.pattern.pattern[row].length; col++) {
        if (currentQuestion.pattern.pattern[row][col] === 'x') {
          count++;
          setTimeout(() => {
            speak(count.toString(), 'word');
            // Burada animasyon tetiklenebilir
          }, count * 1000);
        }
      }
    }
    
    setTimeout(() => {
      speak(`Toplam ${currentQuestion.pattern.count} tane!`, 'sentence');
    }, (count + 1) * 1000);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔷</div>
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4">
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
            <span className="text-lg font-semibold text-orange-600">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔷 Şekil-Sayı Oyunu</h1>
          <p className="text-gray-600">Şekillerdeki desenleri say ve doğru sayıyı seç!</p>
        </div>

        {/* Pattern Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Kaç tane {currentQuestion.pattern.name} var?
            </h2>
            
            {/* Shape Pattern */}
            <div className="inline-block p-6 bg-gray-50 rounded-xl">
              {currentQuestion.pattern.pattern.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2 mb-2">
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-12 h-12 flex items-center justify-center ${
                        cell === 'x' ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {cell === 'x' && (
                        <span 
                          className={`text-4xl ${animateShapes ? 'animate-bounce' : ''} ${currentQuestion.pattern.color}`}
                          style={{ animationDelay: `${(rowIndex * row.length + colIndex) * 100}ms` }}
                        >
                          {currentQuestion.pattern.shape}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Count Helper Button */}
            <div className="mt-6">
              <button
                onClick={countShapesWithAnimation}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
              >
                🔍 Tek Tek Sayalım
              </button>
            </div>
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
                    showFeedback && option === currentQuestion.pattern.count
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-200 text-orange-600 hover:border-orange-300'
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
                ? `Evet! ${currentQuestion.pattern.count} tane ${currentQuestion.pattern.name} var.`
                : `Doğru cevap ${currentQuestion.pattern.count} idi.`
              }
            </div>
          </div>
        )}

        {/* Pattern Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">💡 Desen Sayma İpuçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">👀</div>
              <p className="text-orange-800">Her şekli tek tek incele</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📏</div>
              <p className="text-blue-800">Sıra sıra say</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-green-800">Sayılarken işaretleyerek git</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 