'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface ForceGameProps {
  onBack: () => void;
}

interface ForceQuestion {
  object: string;
  emoji: string;
  correctAnswer: 'itme' | 'çekme';
  options: string[];
  description: string;
  action: string;
}

const forceItems = [
  { name: 'kapı açma', emoji: '🚪', force: 'çekme', description: 'Kapı kolunu çekerek açarız', action: 'Kola çekerek kapıyı açıyoruz' },
  { name: 'arabayı itme', emoji: '🚗', force: 'itme', description: 'Arabayı arkadan iterek hareket ettiririz', action: 'Arkadan iterek arabayı götürüyoruz' },
  { name: 'ip çekme', emoji: '🪢', force: 'çekme', description: 'İpi kendimize doğru çekeriz', action: 'İpi kendimize doğru çekiyoruz' },
  { name: 'topu itme', emoji: '⚽', force: 'itme', description: 'Topu ayakla iterek fırlatırız', action: 'Ayakla topu iterek atıyoruz' },
  { name: 'çekmece açma', emoji: '🗄️', force: 'çekme', description: 'Çekmeceyi tutup çekeriz', action: 'Tutup kendimize doğru çekiyoruz' },
  { name: 'sandalye itme', emoji: '🪑', force: 'itme', description: 'Sandalyeyi iterek hareket ettiririz', action: 'Sandalyeyi arkadan itiyoruz' },
  { name: 'halat çekme', emoji: '🪢', force: 'çekme', description: 'Halat çekme oyununda çekeriz', action: 'Halatı güçlü bir şekilde çekiyoruz' },
  { name: 'kapı kapama', emoji: '🚪', force: 'itme', description: 'Kapıyı iterek kapatırız', action: 'Kapıyı iterek kapatıyoruz' },
  { name: 'vagon çekme', emoji: '🚂', force: 'çekme', description: 'Tren vagonları çeker', action: 'Lokomotif vagonları çekiyor' },
  { name: 'duvar itme', emoji: '🧱', force: 'itme', description: 'Duvara karşı iter, ama hareket etmez', action: 'Duvara doğru itiyoruz ama hareket etmiyor' },
] as const;

export default function ForceGame({ onBack }: ForceGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<ForceQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  const generateQuestion = useCallback(() => {
    const item = forceItems[Math.floor(Math.random() * forceItems.length)];
    const options = ['itme', 'çekme'].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      object: item.name,
      emoji: item.emoji,
      correctAnswer: item.force as 'itme' | 'çekme',
      options,
      description: item.description,
      action: item.action
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsAnswering(false);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`${item.name} yaparken hangi kuvveti kullanırız?`, 'sentence');
    }, 1000);
  }, [speak]);

  // İlk yükleme
  useEffect(() => {
    generateQuestion();
    speak('Kuvvet oyununa hoş geldin! İtme ve çekme kuvvetlerini öğrenelim.', 'sentence');
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
      await speak(`Doğru! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer} kuvveti kullanır!`, 'celebration');
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

  const explainForce = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.action}. Bu ${currentQuestion.correctAnswer} kuvvetidir.`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gentle-bounce">💪</div>
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
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">💪 Kuvvet Oyunu</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">İtme ve çekme kuvvetlerini keşfedelim!</p>
        </div>

        {/* Force Display */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-text-color dark:text-dark-text mb-4">
              {currentQuestion.object} yaparken hangi kuvveti kullanırız?
            </h2>
            
            {/* Force Animation */}
            <div className="relative flex justify-center items-center mb-6">
              <div className={`text-8xl transition-transform duration-1000 ${
                currentQuestion.correctAnswer === 'itme' ? 'animate-calm-pulse' : 'animate-gentle-bounce'
              }`}>
                {currentQuestion.emoji}
              </div>
              
              {/* Force indicators */}
              {currentQuestion.correctAnswer === 'itme' && (
                <div className="absolute -right-8 text-encourage-orange animate-calm-pulse text-2xl">
                  ➡️ 👋
                </div>
              )}
              {currentQuestion.correctAnswer === 'çekme' && (
                <div className="absolute -left-8 text-focus-blue animate-gentle-bounce text-2xl">
                  👋 ⬅️
                </div>
              )}
            </div>
            
            <p className="text-text-color dark:text-dark-text font-semibold mb-2">
              {currentQuestion.description}
            </p>
            <p className="text-sm text-focus-blue font-bold">
              {currentQuestion.action}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainForce}
              className="px-6 py-3 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              🔊 Kuvvet Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-6 text-center">
            Kuvvet türünü seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
                      : 'border-gray-200 dark:border-dark-border text-focus-blue hover:border-focus-blue'
                  }
                `}
              >
                <div className="text-5xl mb-4">
                  {option === 'itme' ? '👋➡️' : '⬅️👋'}
                </div>
                <div className="text-4xl mb-3">
                  {option === 'itme' ? '🫸' : '🫷'}
                </div>
                <div className="text-xl">
                  {option === 'itme' ? 'İTME' : 'ÇEKME'}
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:text-dark-text-secondary">
                  {option === 'itme' ? 'Kendimizden uzağa doğru' : 'Kendimize doğru'}
                </p>
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
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer} kuvveti kullanır.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer} kuvveti kullanır.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center p-4 bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl">
              <div className="text-3xl mb-2">🫸</div>
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">İtme Kuvveti</h4>
              <p className="text-orange-700 dark:text-orange-400">Nesneyi kendimizden uzağa doğru hareket ettiren kuvvet. Ellerimizle iter, ayaklarımızla teperiz.</p>
            </div>
            <div className="text-center p-4 bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl">
              <div className="text-3xl mb-2">🫷</div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Çekme Kuvveti</h4>
              <p className="text-blue-700 dark:text-blue-400">Nesneyi kendimize doğru hareket ettiren kuvvet. Ellerimizle tutup çekeriz.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-neutral-gray dark:bg-dark-border rounded-xl text-center">
              <h5 className="font-bold text-text-color dark:text-dark-text mb-1">İtme Örnekleri</h5>
              <p className="text-gray-600 dark:text-dark-text-secondary">• Kapı kapama • Top atma • Sandalye itme • Araba itme</p>
            </div>
            <div className="p-3 bg-success-green/20 dark:bg-green-900/20 rounded-xl text-center">
              <h5 className="font-bold text-green-800 dark:text-green-300 mb-1">Çekme Örnekleri</h5>
              <p className="text-green-700 dark:text-green-400">• Kapı açma • İp çekme • Çekmece açma • Halat çekme</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-calm-blue/50 dark:bg-dark-border rounded-xl text-center">
            <p className="text-sm text-text-color dark:text-dark-text">
              <strong>Kuvvet</strong> = Nesneleri hareket ettiren, durduran veya şeklini değiştiren etkidir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}