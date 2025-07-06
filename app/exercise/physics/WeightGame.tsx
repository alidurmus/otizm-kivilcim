'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

interface WeightGameProps {
  onBack: () => void;
}

interface WeightQuestion {
  object: string;
  emoji: string;
  correctAnswer: 'ağır' | 'hafif';
  options: string[];
  description: string;
}

const weightItems = [
  { name: 'fil', emoji: '🐘', weight: 'ağır', description: 'Çok büyük ve ağır bir hayvandır' },
  { name: 'tüy', emoji: '🪶', weight: 'hafif', description: 'Havada uçabilen çok hafif bir şeydir' },
  { name: 'araba', emoji: '🚗', weight: 'ağır', description: 'Metal ve cam parçalarından yapılmıştır' },
  { name: 'kelebek', emoji: '🦋', weight: 'hafif', description: 'Çok nazik ve hafif uçabilen böcektir' },
  { name: 'televizyon', emoji: '📺', weight: 'ağır', description: 'Büyük elektronik cihaz, metal ve cam içerir' },
  { name: 'balon', emoji: '🎈', weight: 'hafif', description: 'İçinde hava olan kauçuk, çok hafiftir' },
  { name: 'kitap', emoji: '📚', weight: 'ağır', description: 'Kağıt ve karton yaprak birleşimi' },
  { name: 'sabun köpüğü', emoji: '🫧', weight: 'hafif', description: 'Su ve sabundan oluşan hava kabarcıkları' },
  { name: 'ağaç', emoji: '🌳', weight: 'ağır', description: 'Büyük ve güçlü odunsu gövdesi vardır' },
  { name: 'yaprak', emoji: '🍃', weight: 'hafif', description: 'İnce ve hafif bitki parçasıdır' },
] as const;

export default function WeightGame({ onBack }: WeightGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<WeightQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { speak } = useElevenLabs();

  const generateQuestion = useCallback(() => {
    const item = weightItems[Math.floor(Math.random() * weightItems.length)];
    const options = ['ağır', 'hafif'].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      object: item.name,
      emoji: item.emoji,
      correctAnswer: item.weight as 'ağır' | 'hafif',
      options,
      description: item.description
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Bu ${item.name} ağır mı hafif mi?`, 'sentence');
    }, 1000);
  }, [speak]);

  // İlk yükleme
  useEffect(() => {
    generateQuestion();
    speak('Ağırlık oyununa hoş geldin! Nesnelerin ağır mı hafif mi olduğunu öğrenelim.', 'sentence');
  }, []);

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      await speak(`Doğru! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer}!`, 'celebration');
    } else {
      await speak(`${currentQuestion.object} aslında ${currentQuestion.correctAnswer}. ${currentQuestion.description}`, 'sentence');
    }
    
    // 4 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 4000);
  };

  const explainWeight = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.object} ${currentQuestion.description}`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚖️</div>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⚖️ Ağırlık Oyunu</h1>
          <p className="text-gray-600">Nesnelerin ağır mı hafif mi olduğunu öğrenelim!</p>
        </div>

        {/* Scale Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bu {currentQuestion.object} ağır mı hafif mi?
            </h2>
            
            {/* Scale Animation */}
            <div className="relative flex justify-center items-center mb-6">
              <div className="text-6xl">⚖️</div>
              <div className={`absolute -top-4 text-6xl transition-transform duration-1000 ${
                currentQuestion.correctAnswer === 'ağır' ? 'animate-bounce' : 'animate-pulse'
              }`}>
                {currentQuestion.emoji}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              {currentQuestion.description}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainWeight}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
            >
              🔊 Ağırlık Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Ağırlığını seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`
                  py-8 px-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  text-2xl font-bold border-4 
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-200 text-green-600 hover:border-green-300'
                  }
                `}
              >
                <div className="text-4xl mb-3">
                  {option === 'ağır' ? '🏋️‍♂️' : '🪶'}
                </div>
                <div className="text-3xl mb-2">
                  {option === 'ağır' ? '⬇️' : '⬆️'}
                </div>
                {option.toUpperCase()}
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
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer}.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer}.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl mb-2">🏋️‍♂️</div>
              <h4 className="font-semibold text-red-800 mb-2">Ağır Nesneler</h4>
              <p className="text-red-600">Yerçekimi onları güçlü bir şekilde aşağı çeker. Taşımak için daha fazla güç gerekir.</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🪶</div>
              <h4 className="font-semibold text-blue-800 mb-2">Hafif Nesneler</h4>
              <p className="text-blue-600">Yerçekimi onları zayıf çeker. Kolayca taşınabilir, rüzgarla uçabilir.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
            <p className="text-sm text-yellow-800">
              <strong>Ağırlık</strong> = Bir nesnenin üzerine uygulanan yerçekimi kuvvetidir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 