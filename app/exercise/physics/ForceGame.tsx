'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

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
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`${item.name} yaparken hangi kuvvet kullanırız?`, 'sentence');
    }, 1000);
  }, [speak]);

  // İlk yükleme
  useEffect(() => {
    generateQuestion();
    speak('Kuvvet oyununa hoş geldin! İtme ve çekme kuvvetlerini öğrenelim.', 'sentence');
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
      await speak(`Doğru! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer} kuvveti kullanır!`, 'celebration');
    } else {
      await speak(`${currentQuestion.object} aslında ${currentQuestion.correctAnswer} kuvveti kullanır. ${currentQuestion.description}`, 'sentence');
    }
    
    // 4 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 4000);
  };

  const explainForce = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.action}. Bu ${currentQuestion.correctAnswer} kuvvetidir.`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💪</div>
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
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
            <span className="text-lg font-semibold text-purple-600">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💪 Kuvvet Oyunu</h1>
          <p className="text-gray-600">İtme ve çekme kuvvetlerini keşfedelim!</p>
        </div>

        {/* Force Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentQuestion.object} yaparken hangi kuvvet kullanırız?
            </h2>
            
            {/* Force Animation */}
            <div className="relative flex justify-center items-center mb-6">
              <div className={`text-8xl transition-transform duration-1000 ${
                currentQuestion.correctAnswer === 'itme' ? 'animate-pulse' : 'animate-bounce'
              }`}>
                {currentQuestion.emoji}
              </div>
              
              {/* Force indicators */}
              {currentQuestion.correctAnswer === 'itme' && (
                <div className="absolute -right-8 text-red-500 animate-pulse text-2xl">
                  ➡️ 👋
                </div>
              )}
              {currentQuestion.correctAnswer === 'çekme' && (
                <div className="absolute -left-8 text-blue-500 animate-bounce text-2xl">
                  👋 ⬅️
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">
              {currentQuestion.description}
            </p>
            <p className="text-sm text-purple-600 font-semibold">
              {currentQuestion.action}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainForce}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-colors"
            >
              🔊 Kuvvet Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Kuvvet türünü seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
                      : 'border-gray-200 text-purple-600 hover:border-purple-300'
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
                <p className="text-sm mt-2 text-gray-600">
                  {option === 'itme' ? 'Kendimizden uzağa doğru' : 'Kendimize doğru'}
                </p>
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
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer} kuvveti kullanır.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer} kuvveti kullanır.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl mb-2">🫸</div>
              <h4 className="font-semibold text-red-800 mb-2">İtme Kuvveti</h4>
              <p className="text-red-600">Nesneyi kendimizden uzağa doğru hareket ettiren kuvvet. Ellerimizle iter, ayaklarımızla teperiz.</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🫷</div>
              <h4 className="font-semibold text-blue-800 mb-2">Çekme Kuvveti</h4>
              <p className="text-blue-600">Nesneyi kendimize doğru hareket ettiren kuvvet. Ellerimizle tutup çekeriz.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <h5 className="font-semibold text-yellow-800 mb-1">İtme Örnekleri</h5>
              <p className="text-yellow-600">• Kapı kapama • Top atma • Sandalye itme • Araba itme</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <h5 className="font-semibold text-green-800 mb-1">Çekme Örnekleri</h5>
              <p className="text-green-600">• Kapı açma • İp çekme • Çekmece açma • Halat çekme</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-purple-800">
              <strong>Kuvvet</strong> = Nesneleri hareket ettiren, durduran veya şeklini değiştiren etkidir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 