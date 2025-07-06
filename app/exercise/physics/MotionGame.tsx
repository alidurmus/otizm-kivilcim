'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface MotionGameProps {
  onBack: () => void;
}

interface MotionQuestion {
  object: string;
  emoji: string;
  correctAnswer: 'hızlı' | 'yavaş' | 'durgun';
  options: string[];
  soundDescription: string;
}

const motionItems = [
  { name: 'araba', emoji: '🚗', motion: 'hızlı', sound: 'Vınn sesi çıkararak hızla gider' },
  { name: 'kaplumbağa', emoji: '🐢', motion: 'yavaş', sound: 'Yavaş yavaş ilerler' },
  { name: 'masa', emoji: '🪑', motion: 'durgun', sound: 'Hiç hareket etmez' },
  { name: 'uçak', emoji: '✈️', motion: 'hızlı', sound: 'Gökyüzünde hızla uçar' },
  { name: 'kedi', emoji: '🐱', motion: 'hızlı', sound: 'Hızla koşar ve zıplar' },
  { name: 'ev', emoji: '🏠', motion: 'durgun', sound: 'Yerinde sabit durur' },
  { name: 'salyangoz', emoji: '🐌', motion: 'yavaş', sound: 'Çok yavaş ilerler' },
  { name: 'roket', emoji: '🚀', motion: 'hızlı', sound: 'Çok hızla uzaya fırlar' },
] as const;

const MOTION_TYPES = {
  fast: { name: 'Hızlı', icon: '⚡', color: 'bg-red-500', description: 'Çok hızla hareket eder' },
  slow: { name: 'Yavaş', icon: '🐢', color: 'bg-yellow-500', description: 'Yavaşça hareket eder' },
  stationary: { name: 'Durgun', icon: '🚫', color: 'bg-gray-500', description: 'Hareket etmez' }
};

export default function MotionGame({ onBack }: MotionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<MotionQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { speak } = useElevenLabs();

  const generateQuestion = useCallback(() => {
    const item = motionItems[Math.floor(Math.random() * motionItems.length)];
    const options = ['hızlı', 'yavaş', 'durgun'].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      object: item.name,
      emoji: item.emoji,
      correctAnswer: item.motion as 'hızlı' | 'yavaş' | 'durgun',
      options,
      soundDescription: item.sound
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Bu ${item.name} nasıl hareket eder?`, 'sentence');
    }, 1000);
  }, [speak]);

  // İlk yükleme
  useEffect(() => {
    generateQuestion();
    speak('Hareket oyununa hoş geldin! Nesnelerin nasıl hareket ettiğini öğrenelim.', 'sentence');
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
      await speak(`Aferin! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer} hareket eder!`, 'celebration');
    } else {
      await speak(`${currentQuestion.object} aslında ${currentQuestion.correctAnswer} hareket eder. ${currentQuestion.soundDescription}`, 'sentence');
    }
    
    // 4 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 4000);
  };

  const explainMotion = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.object} ${currentQuestion.soundDescription}`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="secondary">
            ← Geri Dön
          </Button>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <span className="text-lg font-semibold text-blue-600">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚗 Hareket Oyunu</h1>
          <p className="text-gray-600">Nesnelerin nasıl hareket ettiğini öğrenelim!</p>
        </div>

        {/* Object Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bu {currentQuestion.object} nasıl hareket eder?
            </h2>
            
            {/* Object */}
            <div className="text-8xl mb-6 hover:scale-110 transition-transform duration-300">
              {currentQuestion.emoji}
            </div>
            
            <p className="text-gray-600 mb-4">
              {currentQuestion.soundDescription}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainMotion}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              🔊 Hareket Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Hareket türünü seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`
                  py-6 px-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  text-2xl font-bold border-4 
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-200 text-blue-600 hover:border-blue-300'
                  }
                `}
              >
                <div className="text-3xl mb-2">
                  {option === 'hızlı' ? '🏃‍♂️' : option === 'yavaş' ? '🐌' : '⏸️'}
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
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer} hareket eder.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer} hareket eder.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl mb-2">🏃‍♂️</div>
              <h4 className="font-semibold text-red-800 mb-1">Hızlı Hareket</h4>
              <p className="text-red-600">Kısa sürede uzun mesafe almak</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">🐌</div>
              <h4 className="font-semibold text-yellow-800 mb-1">Yavaş Hareket</h4>
              <p className="text-yellow-600">Uzun sürede kısa mesafe almak</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⏸️</div>
              <h4 className="font-semibold text-gray-800 mb-1">Durgun</h4>
              <p className="text-gray-600">Hiç hareket etmemek</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 