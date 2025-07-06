'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';

interface MotionGameProps {
  onBack: () => void;
}

interface MotionItem {
  id: number;
  name: string;
  icon: string;
  speed: 'fast' | 'slow' | 'stationary';
  description: string;
  sound: string;
}

const MOTION_ITEMS: MotionItem[] = [
  { id: 1, name: 'Araba', icon: '🚗', speed: 'fast', description: 'Hızla hareket eder', sound: 'Vııııın!' },
  { id: 2, name: 'Kaplumbağa', icon: '🐢', speed: 'slow', description: 'Yavaş hareket eder', sound: 'Sessizce...' },
  { id: 3, name: 'Masa', icon: '🪑', speed: 'stationary', description: 'Hareket etmez', sound: 'Sessiz' },
  { id: 4, name: 'Uçak', icon: '✈️', speed: 'fast', description: 'Hızla hareket eder', sound: 'Vuvuvuuu!' },
  { id: 5, name: 'Kedi', icon: '🐱', speed: 'slow', description: 'Yavaş hareket eder', sound: 'Miyav' },
  { id: 6, name: 'Ev', icon: '🏠', speed: 'stationary', description: 'Hareket etmez', sound: 'Sessiz' },
  { id: 7, name: 'Salyangoz', icon: '🐌', speed: 'slow', description: 'Çok yavaş hareket eder', sound: 'Şlap şlap' },
  { id: 8, name: 'Roket', icon: '🚀', speed: 'fast', description: 'Çok hızla hareket eder', sound: 'Vooosh!' },
];

const MOTION_TYPES = {
  fast: { name: 'Hızlı', icon: '⚡', color: 'bg-red-500', description: 'Çok hızla hareket eder' },
  slow: { name: 'Yavaş', icon: '🐢', color: 'bg-yellow-500', description: 'Yavaşça hareket eder' },
  stationary: { name: 'Durgun', icon: '🚫', color: 'bg-gray-500', description: 'Hareket etmez' }
};

export default function MotionGame({ onBack }: MotionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questions, setQuestions] = useState<MotionItem[]>([]);

  useEffect(() => {
    // Soruları karıştır
    const shuffled = [...MOTION_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
  }, []);

  const handleAnswer = (speed: string) => {
    setSelectedAnswer(speed);
    const correct = speed === questions[currentQuestion]?.speed;
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
    const shuffled = [...MOTION_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tebrikler!</h2>
            <p className="text-xl text-gray-600 mb-4">
              Hareket oyununu tamamladın!
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Puanın: {score}/{questions.length}
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="primary">
                Tekrar Oyna
              </Button>
              <Button onClick={onBack} variant="secondary">
                Geri Dön
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="secondary">
            ← Geri Dön
          </Button>
          <div className="text-lg font-semibold text-gray-700">
            Soru {currentQuestion + 1}/{questions.length} | Puan: {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bu nesne nasıl hareket eder?
            </h2>
            
            <div className="inline-block p-6 bg-blue-50 rounded-xl mb-4">
              <div className="text-8xl mb-4">{currentItem.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800">{currentItem.name}</h3>
              <p className="text-gray-600 mt-2">{currentItem.sound}</p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(MOTION_TYPES).map(([key, type]) => {
              const isSelected = selectedAnswer === key;
              const isCorrect = key === currentItem.speed;
              const showColors = showResult;
              
              let buttonClass = 'p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ';
              
              if (showColors) {
                if (isCorrect) {
                  buttonClass += 'bg-green-100 border-green-500 text-green-800';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-100 border-red-500 text-red-800';
                } else {
                  buttonClass += 'bg-gray-100 border-gray-300 text-gray-600';
                }
              } else {
                buttonClass += isSelected 
                  ? 'bg-blue-100 border-blue-500 text-blue-800' 
                  : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50';
              }

              return (
                <div
                  key={key}
                  onClick={() => !showResult && handleAnswer(key)}
                  className={buttonClass}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h4 className="text-xl font-bold mb-2">{type.name}</h4>
                    <p className="text-sm">{type.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <div className="text-center p-4 rounded-lg">
              {selectedAnswer === currentItem.speed ? (
                <div className="text-green-600">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-xl font-bold">Doğru! {currentItem.description}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-3xl mb-2">❌</div>
                  <p className="text-xl font-bold">
                    Doğru cevap: {MOTION_TYPES[currentItem.speed].name}
                  </p>
                  <p className="text-lg">{currentItem.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Physics Fact */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">🤓 Fizik Bilgisi:</h3>
          <p className="text-gray-600">
            Hareket, bir nesnenin zaman içinde yer değiştirmesidir. 
            Bazı nesneler çok hızlı (araba, uçak), bazıları yavaş (kaplumbağa), 
            bazıları da hiç hareket etmez (ev, masa).
          </p>
        </div>
      </div>
    </div>
  );
} 