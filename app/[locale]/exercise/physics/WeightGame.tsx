'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

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
  const [isAnswering, setIsAnswering] = useState(false);
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
    setIsAnswering(false);
    
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
    if (!currentQuestion || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setTotalQuestions(prev => prev + 1);
      setScore(prev => prev + 1);
      await speak(`Doğru! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer}!`, 'celebration');
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const explainWeight = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.object} ${currentQuestion.description}`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gentle-bounce">⚖️</div>
          <div className="text-xl text-text-color dark:text-dark-text font-bold">Yükleniyor...</div>
        </div>
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
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">⚖️ Ağırlık Oyunu</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Nesnelerin ağır mı hafif mi olduğunu öğrenelim!</p>
        </div>

        {/* Scale Display */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-text-color dark:text-dark-text mb-6">
              Bu {currentQuestion.object} ağır mı hafif mi?
            </h2>
            
            {/* Scale Animation */}
            <div className="relative flex justify-center items-center mb-8">
              <div className="text-6xl">⚖️</div>
              <div className={`absolute -top-4 text-6xl transition-transform duration-1000 ${
                currentQuestion.correctAnswer === 'ağır' ? 'animate-gentle-bounce' : 'animate-calm-pulse'
              }`}>
                {currentQuestion.emoji}
              </div>
            </div>
            
            <p className="text-text-color dark:text-dark-text font-semibold mb-4">
              {currentQuestion.description}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainWeight}
              className="px-6 py-3 bg-success-green text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
            >
              🔊 Ağırlık Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-6 text-center">
            Ağırlığını seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswering}
                className={`
                  py-8 px-6 bg-white dark:bg-dark-surface rounded-xl transition-all duration-300
                  text-2xl font-bold border-4 disabled:opacity-50
                  ${isAnswering ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'border-success-green bg-success-green/20 text-green-700 dark:text-green-400'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-encourage-orange bg-encourage-orange/20 text-orange-700 dark:text-orange-400'
                      : 'border-gray-200 dark:border-dark-border text-success-green hover:border-success-green'
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
          <div className="text-center mt-8 p-6 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
              {isCorrect ? '🎉 Harika, doğru bildin!' : '💡 Haydi tekrar düşünelim'}
            </div>
            <div className="text-gray-600 dark:text-dark-text-secondary text-lg">
              {isCorrect 
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer}.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer}.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center p-4 bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl">
              <div className="text-3xl mb-2">🏋️‍♂️</div>
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">Ağır Nesneler</h4>
              <p className="text-orange-700 dark:text-orange-400">Yerçekimi onları güçlü bir şekilde aşağı çeker. Taşımak için daha fazla güç gerekir.</p>
            </div>
            <div className="text-center p-4 bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl">
              <div className="text-3xl mb-2">🪶</div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Hafif Nesneler</h4>
              <p className="text-blue-700 dark:text-blue-400">Yerçekimi onları zayıf çeker. Kolayca taşınabilir, rüzgarla uçabilir.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-neutral-gray dark:bg-dark-border rounded-xl text-center">
            <p className="text-sm text-text-color dark:text-dark-text-secondary">
              <strong>Ağırlık</strong> = Bir nesnenin üzerine uygulanan yerçekimi kuvvetidir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}