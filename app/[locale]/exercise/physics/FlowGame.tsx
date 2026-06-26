'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface FlowGameProps {
  onBack: () => void;
}

interface FlowQuestion {
  object: string;
  emoji: string;
  correctAnswer: 'su akışı' | 'hava akışı' | 'akmaz';
  options: string[];
  description: string;
  flowType: string;
}

const flowItems = [
  { name: 'musluk', emoji: '🚰', flow: 'su akışı', description: 'Açıldığında su akar', type: 'Sıvı akışı' },
  { name: 'rüzgar', emoji: '🌬️', flow: 'hava akışı', description: 'Hava hareket eder ve eser', type: 'Gaz akışı' },
  { name: 'taş', emoji: '🪨', flow: 'akmaz', description: 'Katı halde, hareket etmez', type: 'Katı madde' },
  { name: 'nehir', emoji: '🏞️', flow: 'su akışı', description: 'Sürekli akan su', type: 'Doğal su akışı' },
  { name: 'fan', emoji: '🪭', flow: 'hava akışı', description: 'Hava akımı oluşturur', type: 'Yapay hava akışı' },
  { name: 'masa', emoji: '🪑', flow: 'akmaz', description: 'Katı eşya, yerinde durur', type: 'Katı madde' },
  { name: 'şelale', emoji: '💧', flow: 'su akışı', description: 'Yüksekten aşağı akan su', type: 'Doğal su akışı' },
  { name: 'yel değirmeni', emoji: '🌪️', flow: 'hava akışı', description: 'Rüzgar ile döner', type: 'Rüzgar enerjisi' },
  { name: 'duvar', emoji: '🧱', flow: 'akmaz', description: 'Sert yapı, hareket etmez', type: 'Katı yapı' },
  { name: 'gökkuşağı arkasındaki bulut', emoji: '☁️', flow: 'hava akışı', description: 'Bulutlar havada hareket eder', type: 'Atmosfer olayı' },
] as const;

export default function FlowGame({ onBack }: FlowGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<FlowQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  const generateQuestion = useCallback(() => {
    const item = flowItems[Math.floor(Math.random() * flowItems.length)];
    const options = ['su akışı', 'hava akışı', 'akmaz'].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      object: item.name,
      emoji: item.emoji,
      correctAnswer: item.flow as 'su akışı' | 'hava akışı' | 'akmaz',
      options,
      description: item.description,
      flowType: item.type
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsAnswering(false);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Bu ${item.name} nasıl akar?`, 'sentence');
    }, 1000);
  }, [speak]);

  // İlk yükleme
  useEffect(() => {
    generateQuestion();
    speak('Akış oyununa hoş geldin! Su, hava ve katı maddelerin nasıl hareket ettiğini öğrenelim.', 'sentence');
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

  const explainFlow = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.object}: ${currentQuestion.description}. Bu bir ${currentQuestion.flowType} örneğidir.`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gentle-bounce">💧</div>
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
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">💧 Akış Oyunu</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Su, hava ve katı maddelerin hareketini keşfedelim!</p>
        </div>

        {/* Flow Display */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-text-color dark:text-dark-text mb-4">
              Bu {currentQuestion.object} nasıl akar?
            </h2>
            
            {/* Flow Animation */}
            <div className="relative flex justify-center items-center mb-8">
              <div className={`text-8xl transition-transform duration-1000 ${
                currentQuestion.correctAnswer === 'su akışı' ? 'animate-gentle-bounce' :
                currentQuestion.correctAnswer === 'hava akışı' ? 'animate-calm-pulse' : ''
              }`}>
                {currentQuestion.emoji}
              </div>
              
              {/* Flow indicators */}
              {currentQuestion.correctAnswer === 'su akışı' && (
                <div className="absolute -bottom-4 text-focus-blue animate-gentle-bounce">
                  💧💧💧
                </div>
              )}
              {currentQuestion.correctAnswer === 'hava akışı' && (
                <div className="absolute -right-8 text-neutral-gray dark:text-dark-text-secondary animate-calm-pulse">
                  💨💨💨
                </div>
              )}
            </div>
            
            <p className="text-text-color dark:text-dark-text font-semibold mb-2">
              {currentQuestion.description}
            </p>
            <p className="text-sm text-focus-blue font-bold">
              {currentQuestion.flowType}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainFlow}
              className="px-6 py-3 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              🔊 Akış Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-6 text-center">
            Akış türünü seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswering}
                className={`
                  py-6 px-4 bg-white dark:bg-dark-surface rounded-xl transition-all duration-300
                  text-lg font-bold border-4 disabled:opacity-50
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
                <div className="text-4xl mb-3">
                  {option === 'su akışı' ? '💧' : option === 'hava akışı' ? '💨' : '🧱'}
                </div>
                <div className="text-2xl mb-2">
                  {option === 'su akışı' ? '↓' : option === 'hava akışı' ? '→' : '■'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl">
              <div className="text-3xl mb-2">💧</div>
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Su Akışı (Sıvı)</h4>
              <p className="text-blue-700 dark:text-blue-400">Sıvılar yerçekimi ile aşağı akar. Şekli kabına göre değişir.</p>
            </div>
            <div className="text-center p-4 bg-neutral-gray dark:bg-dark-border rounded-xl">
              <div className="text-3xl mb-2">💨</div>
              <h4 className="font-bold text-text-color dark:text-dark-text mb-2">Hava Akışı (Gaz)</h4>
              <p className="text-gray-600 dark:text-dark-text-secondary">Gazlar hareket eder, yayılır. Rüzgar hava akışıdır.</p>
            </div>
            <div className="text-center p-4 bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl">
              <div className="text-3xl mb-2">🧱</div>
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">Katı Maddeler</h4>
              <p className="text-orange-700 dark:text-orange-400">Katılar akmaz, şekillerini korur, sabit dururlar.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-calm-blue/50 dark:bg-dark-border rounded-xl text-center">
            <p className="text-sm text-text-color dark:text-dark-text">
              <strong>Akış</strong> = Maddenin yerini değiştirme hareketidir. Sıvılar ve gazlar akar, katılar akmaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}