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

export default function MotionGame({ onBack }: MotionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<MotionQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
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
    setIsAnswering(false);
    
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

  const handleAnswer = useCallback(async (answer: string) => {
    if (!currentQuestion || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setTotalQuestions(prev => prev + 1);
      setScore(prev => prev + 1);
      await speak(`Aferin! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer} hareket eder!`, 'celebration');
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
  }, [currentQuestion, isAnswering, speak, generateQuestion]);

  const explainMotion = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.object} ${currentQuestion.soundDescription}`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gentle-bounce">🚗</div>
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
            <span className="text-lg font-bold text-focus-blue">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">🚗 Hareket Oyunu</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Nesnelerin nasıl hareket ettiğini öğrenelim!</p>
        </div>

        {/* Object Display */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-text-color dark:text-dark-text mb-6">
              Bu {currentQuestion.object} nasıl hareket eder?
            </h2>
            
            {/* Object */}
            <div className="text-8xl mb-6 animate-gentle-bounce">
              {currentQuestion.emoji}
            </div>
            
            <p className="text-text-color dark:text-dark-text font-semibold mb-4">
              {currentQuestion.soundDescription}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainMotion}
              className="px-6 py-3 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              🔊 Hareket Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-6 text-center">
            Hareket türünü seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswering}
                className={`
                  py-6 px-4 bg-white dark:bg-dark-surface rounded-xl transition-all duration-300
                  text-2xl font-bold border-4 disabled:opacity-50
                  ${isAnswering ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'border-success-green bg-success-green/20 text-green-700 dark:text-green-400'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-encourage-orange bg-encourage-orange/20 text-orange-700 dark:text-orange-400'
                      : 'border-gray-200 dark:border-dark-border text-focus-blue hover:border-focus-blue'
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
          <div className="text-center mt-8 p-6 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
              {isCorrect ? '🎉 Harika, doğru bildin!' : '💡 Haydi tekrar düşünelim'}
            </div>
            <div className="text-gray-600 dark:text-dark-text-secondary text-lg">
              {isCorrect 
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer} hareket eder.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer} hareket eder.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl">
              <div className="text-2xl mb-2">🏃‍♂️</div>
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-1">Hızlı Hareket</h4>
              <p className="text-orange-700 dark:text-orange-400">Kısa sürede uzun mesafe almak</p>
            </div>
            <div className="text-center p-3 bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl">
              <div className="text-2xl mb-2">🐌</div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">Yavaş Hareket</h4>
              <p className="text-blue-700 dark:text-blue-400">Uzun sürede kısa mesafe almak</p>
            </div>
            <div className="text-center p-3 bg-neutral-gray dark:bg-dark-border rounded-xl">
              <div className="text-2xl mb-2">⏸️</div>
              <h4 className="font-bold text-text-color dark:text-dark-text mb-1">Durgun</h4>
              <p className="text-gray-600 dark:text-dark-text-secondary">Hiç hareket etmemek</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}