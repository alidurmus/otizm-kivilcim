'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface Props {
  onBack: () => void;
}

const colorMixes = [
  { color1: 'Sarı', color2: 'Mavi', result: 'Yeşil', emoji1: '🟡', emoji2: '🔵', resultEmoji: '🟢', options: ['Mor', 'Yeşil', 'Turuncu'] },
  { color1: 'Kırmızı', color2: 'Sarı', result: 'Turuncu', emoji1: '🔴', emoji2: '🟡', resultEmoji: '🟠', options: ['Turuncu', 'Yeşil', 'Pembe'] },
  { color1: 'Kırmızı', color2: 'Mavi', result: 'Mor', emoji1: '🔴', emoji2: '🔵', resultEmoji: '🟣', options: ['Siyah', 'Mor', 'Yeşil'] },
];

export default function ChemistryBasics({ onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  const currentMix = colorMixes[currentIndex];

  useEffect(() => {
    speak('Sihirli renklere hoş geldin! İki rengi karıştırınca hangi renk ortaya çıkar, hadi bulalım!', 'sentence');
  }, []);

  const handleAnswer = useCallback(async (answer: string) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const correct = answer === currentMix.result;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalAnswered(prev => prev + 1);

    if (correct) {
      setScore(s => s + 1);
      await speak(`Harika! ${currentMix.color1} ve ${currentMix.color2} karışırsa ${currentMix.result} olur.`, 'celebration');
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setCurrentIndex((prev) => (prev + 1) % colorMixes.length);
      }, 1500);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
      }, 500);
    }
  }, [currentMix, isAnswering, speak]);

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg transition-colors duration-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="secondary">← Geri Dön</Button>
          <div className="bg-white dark:bg-dark-surface px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border">
            <span className="text-xl font-extrabold text-focus-blue">
              Puan: {score}/{totalAnswered}
            </span>
          </div>
        </div>

        <div className="text-center mb-8 bg-white dark:bg-dark-surface p-6 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">🧪 Sihirli Renkler</h1>
          <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">Renkleri karıştırıp yeni renkler keşfet!</p>
        </div>

        {/* Main Game Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10 mb-8 text-center animate-gentle-bounce">
          <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-10">
            Hangi renk ortaya çıkar?
          </h2>
          
          {/* Color Mix Display */}
          <div className="flex justify-center items-center gap-6 text-[6rem] mb-10">
            <div>{currentMix.emoji1}</div>
            <div className="text-6xl text-gray-400 dark:text-dark-text-secondary font-extrabold">+</div>
            <div>{currentMix.emoji2}</div>
            <div className="text-6xl text-gray-400 dark:text-dark-text-secondary font-extrabold">=</div>
            <div className="text-[7rem] animate-pulse">❓</div>
          </div>
          
          <p className="text-2xl text-text-color dark:text-dark-text font-extrabold mb-10">
            {currentMix.color1} + {currentMix.color2}
          </p>

          {!showFeedback ? (
            <div className="flex justify-center gap-4 flex-wrap">
              {currentMix.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={isAnswering}
                  className="py-4 px-8 bg-focus-blue hover:opacity-90 text-white rounded-xl text-2xl font-extrabold transition-all duration-300 disabled:opacity-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className={`text-center mt-6 p-6 rounded-2xl border-4 ${isCorrect ? 'bg-success-green/10 border-success-green' : 'bg-encourage-orange/10 border-encourage-orange'}`}>
              <div className="text-7xl mb-6">{isCorrect ? currentMix.resultEmoji : '💡'}</div>
              <div className={`text-3xl font-extrabold mb-4 ${isCorrect ? 'text-green-700 dark:text-green-500' : 'text-orange-700 dark:text-orange-500'}`}>
                {isCorrect ? '🎉 Doğru, harika!' : 'Haydi tekrar düşünelim'}
              </div>
              <div className="text-gray-700 dark:text-dark-text text-xl font-bold">
                {currentMix.color1} + {currentMix.color2} = {currentMix.result}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8">
          <h3 className="text-2xl font-extrabold text-focus-blue mb-6 text-center flex justify-center items-center gap-2">
            <span className="text-3xl">🎨</span> Renk Bilgisi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
            <div className="text-center p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🟡 + 🔵</div>
              <h4 className="font-extrabold text-success-green mb-2 text-xl">= Yeşil 🟢</h4>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Sarı ve mavi karışırsa</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🔴 + 🟡</div>
              <h4 className="font-extrabold text-encourage-orange mb-2 text-xl">= Turuncu 🟠</h4>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Kırmızı ve sarı karışırsa</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🔴 + 🔵</div>
              <h4 className="font-extrabold text-focus-blue mb-2 text-xl">= Mor 🟣</h4>
              <p className="text-gray-600 dark:text-gray-400 font-bold">Kırmızı ve mavi karışırsa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
