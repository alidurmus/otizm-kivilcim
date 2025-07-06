'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';

interface WeightGameProps {
  onBack: () => void;
}

interface WeightItem {
  id: number;
  name: string;
  icon: string;
  weight: 'heavy' | 'light';
  description: string;
}

const WEIGHT_ITEMS: WeightItem[] = [
  { id: 1, name: 'Fil', icon: '🐘', weight: 'heavy', description: 'Çok ağırdır' },
  { id: 2, name: 'Tüy', icon: '🪶', weight: 'light', description: 'Çok hafiftir' },
  { id: 3, name: 'Araba', icon: '🚗', weight: 'heavy', description: 'Ağırdır' },
  { id: 4, name: 'Kelebek', icon: '🦋', weight: 'light', description: 'Hafiftir' },
  { id: 5, name: 'Televizyon', icon: '📺', weight: 'heavy', description: 'Ağırdır' },
  { id: 6, name: 'Balon', icon: '🎈', weight: 'light', description: 'Hafiftir' },
  { id: 7, name: 'Kitap', icon: '📚', weight: 'heavy', description: 'Biraz ağırdır' },
  { id: 8, name: 'Yaprak', icon: '🍃', weight: 'light', description: 'Çok hafiftir' },
  { id: 9, name: 'Buzdolabı', icon: '🧊', weight: 'heavy', description: 'Çok ağırdır' },
  { id: 10, name: 'Sabun Köpüğü', icon: '🫧', weight: 'light', description: 'Hafiftir' },
];

export default function WeightGame({ onBack }: WeightGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questions, setQuestions] = useState<WeightItem[]>([]);

  useEffect(() => {
    // Soruları karıştır
    const shuffled = [...WEIGHT_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
  }, []);

  const handleAnswer = (weight: string) => {
    setSelectedAnswer(weight);
    const correct = weight === questions[currentQuestion]?.weight;
    
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
    const shuffled = [...WEIGHT_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Harika!</h2>
            <p className="text-xl text-gray-600 mb-4">
              Ağırlık oyununu tamamladın!
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
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
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bu nesne ağır mı hafif mi?
            </h2>
            
            <div className="inline-block p-6 bg-green-50 rounded-xl mb-4">
              <div className="text-8xl mb-4">{currentItem.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800">{currentItem.name}</h3>
            </div>
          </div>

          {/* Scales Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-8">
              {/* Left Scale */}
              <div className="text-center">
                <div className="text-6xl mb-2">⚖️</div>
                <p className="text-gray-600">Tartı</p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              onClick={() => !showResult && handleAnswer('heavy')}
              className={`p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer text-center ${
                showResult 
                  ? (currentItem.weight === 'heavy' 
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : selectedAnswer === 'heavy' 
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600')
                  : selectedAnswer === 'heavy'
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-white border-gray-300 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="text-6xl mb-4">🏋️</div>
              <h4 className="text-2xl font-bold mb-2">Ağır</h4>
              <p className="text-lg">Kaldırmak zordur</p>
            </div>

            <div
              onClick={() => !showResult && handleAnswer('light')}
              className={`p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer text-center ${
                showResult 
                  ? (currentItem.weight === 'light' 
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : selectedAnswer === 'light' 
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600')
                  : selectedAnswer === 'light'
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-6xl mb-4">🪶</div>
              <h4 className="text-2xl font-bold mb-2">Hafif</h4>
              <p className="text-lg">Kolayca kaldırılır</p>
            </div>
          </div>

          {/* Result Message */}
          {showResult && (
            <div className="text-center p-4 rounded-lg">
              {selectedAnswer === currentItem.weight ? (
                <div className="text-green-600">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-xl font-bold">Doğru! {currentItem.description}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-3xl mb-2">❌</div>
                  <p className="text-xl font-bold">
                    Doğru cevap: {currentItem.weight === 'heavy' ? 'Ağır' : 'Hafif'}
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
            Ağırlık, yerçekiminin nesneleri yeryüzüne doğru çekme kuvvetidir. 
            Büyük ve yoğun nesneler daha ağır, küçük ve hafif maddelerden yapılmış nesneler daha hafiftir.
          </p>
        </div>
      </div>
    </div>
  );
} 