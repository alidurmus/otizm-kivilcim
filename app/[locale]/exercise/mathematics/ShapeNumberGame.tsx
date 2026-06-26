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
  { emoji: '⭐', name: 'yıldız', color: 'text-encourage-orange' },
  { emoji: '💎', name: 'elmas', color: 'text-focus-blue' },
  { emoji: '🔷', name: 'mavi kare', color: 'text-focus-blue' },
  { emoji: '🟣', name: 'mor daire', color: 'text-focus-blue' },
  { emoji: '🔶', name: 'turuncu elmas', color: 'text-encourage-orange' },
  { emoji: '🟢', name: 'yeşil daire', color: 'text-success-green' },
];

// Sayı ses dosyaları mapping - static audio files integration
const numberAudioPaths: Record<number, string> = {
  1: '/audio/numbers/1.mp3',
  2: '/audio/numbers/2.mp3',
  3: '/audio/numbers/3.mp3',
  4: '/audio/numbers/4.mp3',
  5: '/audio/numbers/5.mp3',
  6: '/audio/numbers/6.mp3',
  7: '/audio/numbers/7.mp3',
  8: '/audio/numbers/8.mp3',
  9: '/audio/numbers/9.mp3',
  10: '/audio/numbers/10.mp3',
};

// Türkçe sayı isimleri - ElevenLabs fallback için
const turkishNumbers: Record<number, string> = {
  1: 'bir', 2: 'iki', 3: 'üç', 4: 'dört', 5: 'beş',
  6: 'altı', 7: 'yedi', 8: 'sekiz', 9: 'dokuz', 10: 'on'
};

export default function ShapeNumberGame({ onBack }: ShapeNumberGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<ShapeQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [animateShapes, setAnimateShapes] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  // Sayı ses dosyasını çal - static dosya varsa onu kullan, yoksa ElevenLabs
  const playNumberAudio = async (number: number) => {
    const audioPath = numberAudioPaths[number];
    if (audioPath) {
      try {
        const audio = new Audio(audioPath);
        await audio.play();
        console.log(`✅ Static number audio played: ${audioPath}`);
      } catch (error) {
        console.log(`❌ Static number audio failed, using ElevenLabs: ${error}`);
        const turkishName = turkishNumbers[number] || number.toString();
        await speak(turkishName, 'word');
      }
    } else {
      const turkishName = turkishNumbers[number] || number.toString();
      await speak(turkishName, 'word');
    }
  };

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
    setIsAnswering(false);
    
    // Soruyu seslendir - mix of static audio and ElevenLabs
    setTimeout(async () => {
      await speak('Kaç tane', 'sentence');
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak(randomShape.name, 'word'); // ElevenLabs for shape names
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('var? Şekilleri sayalım!', 'sentence');
    }, 1000);
  }, [createPattern]);

  useEffect(() => {
    speak('Şekil-sayı oyununa hoş geldin! Şekilleri sayarak matematik öğrenelim.', 'sentence');
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  }, []); // Only run on component mount

  const handleAnswer = async (answer: number) => {
    if (!currentQuestion || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.pattern.count;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTotalQuestions(prev => prev + 1);
      setScore(prev => prev + 1);
      setAnimateShapes(true);
      // Static audio integration for celebration
      await speak('Mükemmel!', 'celebration');
      await new Promise(resolve => setTimeout(resolve, 500));
      await playNumberAudio(currentQuestion.pattern.count);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('tane', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak(currentQuestion.pattern.name, 'word');
      
      // Sadece doğru bilindiğinde yeni soruya geç
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      
      // Yanlış bilindiğinde soruyu değiştirme, tekrar denemesi için kilidi aç
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const countShapesWithAnimation = async () => {
    if (!currentQuestion) return;
    
    await speak('Şekilleri tek tek sayalım:', 'sentence');
    
    let count = 0;
    for (let row = 0; row < currentQuestion.pattern.pattern.length; row++) {
      for (let col = 0; col < currentQuestion.pattern.pattern[row].length; col++) {
        if (currentQuestion.pattern.pattern[row][col] === 'x') {
          count++;
          setTimeout(async () => {
            await playNumberAudio(count); // Static audio for counting
            // Burada animasyon tetiklenebilir
          }, count * 1000);
        }
      }
    }
    
    setTimeout(async () => {
      await speak('Toplam', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.pattern.count);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('tane!', 'word');
    }, (count + 1) * 1000);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gentle-bounce">🔷</div>
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
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white dark:bg-dark-surface text-text-color dark:text-dark-text rounded-xl border-2 border-gray-200 dark:border-dark-border font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ← Geri Dön
          </button>
          <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-dark-border">
            <span className="text-lg font-bold text-focus-blue">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">🔷 Şekil-Sayı Oyunu</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Şekillerdeki desenleri say ve doğru sayıyı seç!</p>
        </div>

        {/* Pattern Display */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-text-color dark:text-dark-text mb-6">
              Kaç tane {currentQuestion.pattern.name} var?
            </h2>
            
            {/* Shape Pattern */}
            <div className="inline-block p-6 bg-gray-50 dark:bg-dark-border rounded-xl">
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
                          className={`text-4xl ${animateShapes ? 'animate-gentle-bounce' : ''} ${currentQuestion.pattern.color}`}
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
                className="px-6 py-3 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                🔍 Tek Tek Sayalım
              </button>
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-4 text-center">
            Cevabını seç:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswering}
                className={`
                  aspect-square bg-white dark:bg-dark-surface rounded-xl transition-all duration-300
                  text-4xl font-bold border-4 disabled:opacity-50
                  ${isAnswering ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.pattern.count
                      ? 'border-success-green bg-success-green/20 text-green-700 dark:text-green-400'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-encourage-orange bg-encourage-orange/20 text-orange-700 dark:text-orange-400'
                      : 'border-gray-200 dark:border-dark-border text-focus-blue hover:border-focus-blue'
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
          <div className="text-center mt-8 p-6 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
              {isCorrect ? '🎉 Harika, doğru bildin!' : '💡 Haydi tekrar düşünelim'}
            </div>
            <div className="text-gray-600 dark:text-dark-text-secondary text-lg">
              {isCorrect 
                ? `Evet! ${currentQuestion.pattern.count} tane ${currentQuestion.pattern.name} var.`
                : `Doğru cevap ${currentQuestion.pattern.count} idi.`
              }
            </div>
          </div>
        )}

        {/* Pattern Tips */}
        <div className="mt-8 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-4 text-center">💡 Desen Sayma İpuçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl">
              <div className="text-2xl mb-2">👀</div>
              <p className="text-orange-800 dark:text-orange-300 font-bold">Her şekli tek tek incele</p>
            </div>
            <div className="text-center p-3 bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl">
              <div className="text-2xl mb-2">📏</div>
              <p className="text-blue-800 dark:text-blue-300 font-bold">Sıra sıra say</p>
            </div>
            <div className="text-center p-3 bg-success-green/20 dark:bg-green-900/20 rounded-xl">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-green-800 dark:text-green-300 font-bold">Sayılarken işaretleyerek git</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}