'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface AdditionGameProps {
  onBack: () => void;
}

interface AdditionQuestion {
  number1: number;
  number2: number;
  result: number;
  options: number[];
  visual1: string[];
  visual2: string[];
}

const emojis = ['🔵', '🟢', '🟣', '🔷', '💎']; // Removed red and yellow emojis

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

export default function AdditionGame({ onBack }: AdditionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<AdditionQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showVisualHelp, setShowVisualHelp] = useState(true);
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

  // Toplama seslendirir - sayıları Turkish static audio ile
  const speakAdditionProblem = async (num1: number, num2: number) => {
    await speak('toplama işlemi:', 'sentence');
    await new Promise(resolve => setTimeout(resolve, 800));
    await playNumberAudio(num1);
    await new Promise(resolve => setTimeout(resolve, 600));
    await speak('artı', 'word');
    await new Promise(resolve => setTimeout(resolve, 600));
    await playNumberAudio(num2);
    await new Promise(resolve => setTimeout(resolve, 600));
    await speak('kaç eder?', 'sentence');
  };

  const generateQuestion = useCallback(() => {
    // Basit toplama: 1-5 + 1-5 = 2-10
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const result = num1 + num2;
    
    // Görsel yardım için emoji'ler
    const emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
    const emoji2 = emojis[Math.floor(Math.random() * emojis.length)];
    
    const visual1 = Array(num1).fill(emoji1);
    const visual2 = Array(num2).fill(emoji2);
    
    // Seçenekler oluştur
    const wrongOptions: number[] = [];
    while (wrongOptions.length < 3) {
      const wrong = Math.floor(Math.random() * 12) + 1;
      if (wrong !== result && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }
    
    const options = [result, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      number1: num1,
      number2: num2,
      result,
      options,
      visual1,
      visual2
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsAnswering(false);
    
    // Soruyu seslendir - static audio ile
    setTimeout(() => {
      speakAdditionProblem(num1, num2);
    }, 1000);
  }, []);

  // ✅ FIX: Initialize game once on mount (no dependency loop)
  useEffect(() => {
    speak('Toplama oyununa hoş geldin! Sayıları toplayalım.', 'sentence');
    
    // Generate first question after welcome message
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  }, []); // ✅ Empty deps - only runs once

  const handleAnswer = async (answer: number) => {
    if (!currentQuestion || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.result;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTotalQuestions(prev => prev + 1);
      setScore(prev => prev + 1);
      // Static audio integration for celebration
      await speak('Mükemmel!', 'celebration');
      await new Promise(resolve => setTimeout(resolve, 600));
      await playNumberAudio(currentQuestion.number1);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('artı', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.number2);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('eşittir', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.result);
      
      // Sadece doğru bilince yeni soruya geç
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      
      // Yanlış bilince soruyu değiştirme, tekrar denemesi için kilidi aç
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const explainAddition = async () => {
    if (!currentQuestion) return;
    
    await speak('Toplama işlemini birlikte yapalım:', 'sentence');
    
    setTimeout(async () => {
      await speak('Önce', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.number1);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('tane nesnemiz var', 'sentence');
    }, 1500);
    
    setTimeout(async () => {
      await speak('Sonra', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.number2);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('tane daha ekliyoruz', 'sentence');
    }, 3500);
    
    setTimeout(async () => {
      await speak('Toplam', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.result);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('tane nesne oluyor!', 'sentence');
    }, 5500);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-gentle-bounce">➕</div>
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowVisualHelp(!showVisualHelp)}
              className="px-4 py-2 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-text-color dark:text-dark-text font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              {showVisualHelp ? '👁️ Görseli Gizle' : '👁️ Görseli Göster'}
            </button>
            <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-dark-border">
              <span className="text-lg font-bold text-focus-blue">
                Puan: {score}/{totalQuestions}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-focus-blue mb-4">➕ Toplama Oyunu</h1>
          <p className="text-lg text-gray-600 dark:text-dark-text-secondary font-bold">Sayıları toplayarak doğru sonucu bul!</p>
        </div>

        {/* Addition Problem */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
          <div className="text-center">
            {/* Mathematical Expression */}
            <div className="text-6xl font-extrabold text-focus-blue mb-8 flex items-center justify-center gap-4">
              <span>{currentQuestion.number1}</span>
              <span className="text-4xl text-neutral-gray dark:text-dark-text-secondary">+</span>
              <span>{currentQuestion.number2}</span>
              <span className="text-4xl text-neutral-gray dark:text-dark-text-secondary">=</span>
              <span className="text-gray-400 dark:text-gray-600">?</span>
            </div>
            
            {/* Visual Representation */}
            {showVisualHelp && (
              <div className="mb-8 p-6 bg-gray-50 dark:bg-dark-border rounded-xl">
                <div className="flex items-center justify-center gap-8 mb-4">
                  {/* First Group */}
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-3 max-w-32 animate-calm-pulse">
                      {currentQuestion.visual1.map((emoji, index) => (
                        <span key={index} className="text-3xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary">{currentQuestion.number1}</div>
                  </div>
                  
                  <div className="text-4xl font-bold text-focus-blue">+</div>
                  
                  {/* Second Group */}
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-3 max-w-32 animate-calm-pulse" style={{ animationDelay: '0.2s' }}>
                      {currentQuestion.visual2.map((emoji, index) => (
                        <span key={index} className="text-3xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary">{currentQuestion.number2}</div>
                  </div>
                  
                  <div className="text-4xl font-bold text-focus-blue">=</div>
                  
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-400 dark:text-gray-600 mb-3">?</div>
                    <div className="text-lg font-bold text-gray-400 dark:text-gray-500">Toplam</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Explanation Button */}
            <button
              onClick={explainAddition}
              className="px-6 py-3 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              📚 Açıkla
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-6 text-center">
            Cevabını seç:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswering}
                className={`
                  aspect-square bg-white dark:bg-dark-surface rounded-2xl transition-all duration-300
                  text-5xl font-extrabold border-4 disabled:opacity-50
                  ${isAnswering ? 'cursor-default' : 'cursor-pointer hover:border-focus-blue hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.result
                      ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-400'
                      : 'border-gray-200 dark:border-dark-border text-focus-blue'
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
              {isCorrect ? '🎉 Harika!' : '💡 Haydi tekrar düşünelim'}
            </div>
            <div className="text-text-color dark:text-dark-text-secondary font-bold text-xl mt-2">
              {isCorrect 
                ? `Evet! ${currentQuestion.number1} + ${currentQuestion.number2} = ${currentQuestion.result}`
                : `Doğru cevap: ${currentQuestion.number1} + ${currentQuestion.number2} = ${currentQuestion.result}`
              }
            </div>
          </div>
        )}

        {/* Math Tips */}
        <div className="mt-8 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6">
          <h3 className="text-lg font-bold text-text-color dark:text-dark-text mb-4 text-center">💡 Toplama İpuçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl">
              <div className="text-3xl mb-2">👆</div>
              <p className="font-bold text-blue-800 dark:text-blue-300">Parmaklarınla say</p>
            </div>
            <div className="text-center p-4 bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl">
              <div className="text-3xl mb-2">🧮</div>
              <p className="font-bold text-orange-800 dark:text-orange-300">Nesneleri birleştir</p>
            </div>
            <div className="text-center p-4 bg-success-green/20 dark:bg-green-900/20 rounded-xl">
              <div className="text-3xl mb-2">➕</div>
              <p className="font-bold text-green-800 dark:text-green-300">Toplama = Birleştirme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}