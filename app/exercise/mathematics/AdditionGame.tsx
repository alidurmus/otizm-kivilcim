'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

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

const emojis = ['🟡', '🔵', '🟢', '🔴', '🟣'];

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
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.result;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
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
    } else {
      await playNumberAudio(currentQuestion.number1);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('artı', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.number2);
      await new Promise(resolve => setTimeout(resolve, 400));
      await speak('eşittir', 'word');
      await new Promise(resolve => setTimeout(resolve, 400));
      await playNumberAudio(currentQuestion.result);
      await new Promise(resolve => setTimeout(resolve, 600));
      await speak('idi. Tekrar deneyelim.', 'sentence');
    }
    
    // 3 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 3000);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">➕</div>
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowVisualHelp(!showVisualHelp)}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors text-sm"
            >
              {showVisualHelp ? '👁️ Görseli Gizle' : '👁️ Görseli Göster'}
            </button>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-lg font-semibold text-purple-600">
                Puan: {score}/{totalQuestions}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">➕ Toplama Oyunu</h1>
          <p className="text-gray-600">Sayıları toplayarak doğru sonucu bul!</p>
        </div>

        {/* Addition Problem */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            {/* Mathematical Expression */}
            <div className="text-6xl font-bold text-purple-600 mb-6 flex items-center justify-center gap-4">
              <span>{currentQuestion.number1}</span>
              <span className="text-4xl">+</span>
              <span>{currentQuestion.number2}</span>
              <span className="text-4xl">=</span>
              <span className="text-gray-400">?</span>
            </div>
            
            {/* Visual Representation */}
            {showVisualHelp && (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-8 mb-4">
                  {/* First Group */}
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-2 max-w-32">
                      {currentQuestion.visual1.map((emoji, index) => (
                        <span key={index} className="text-3xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="text-lg font-semibold text-gray-600">{currentQuestion.number1}</div>
                  </div>
                  
                  <div className="text-4xl text-purple-500">+</div>
                  
                  {/* Second Group */}
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-2 max-w-32">
                      {currentQuestion.visual2.map((emoji, index) => (
                        <span key={index} className="text-3xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="text-lg font-semibold text-gray-600">{currentQuestion.number2}</div>
                  </div>
                  
                  <div className="text-4xl text-purple-500">=</div>
                  
                  <div className="text-center">
                    <div className="text-4xl text-gray-400">?</div>
                    <div className="text-lg font-semibold text-gray-400">Toplam</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Explanation Button */}
            <button
              onClick={explainAddition}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              📚 Açıkla
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Cevabını seç:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`
                  aspect-square bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  text-4xl font-bold border-4 
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.result
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-200 text-purple-600 hover:border-purple-300'
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
          <div className="text-center mt-8">
            <div className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '🎉 Harika!' : '🤔 Tekrar Deneyelim'}
            </div>
            <div className="text-gray-600 text-lg">
              {isCorrect 
                ? `Evet! ${currentQuestion.number1} + ${currentQuestion.number2} = ${currentQuestion.result}`
                : `Doğru cevap: ${currentQuestion.number1} + ${currentQuestion.number2} = ${currentQuestion.result}`
              }
            </div>
          </div>
        )}

        {/* Math Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">💡 Toplama İpuçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">👆</div>
              <p className="text-purple-800">Parmaklarınla say</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🧮</div>
              <p className="text-blue-800">Nesneleri birleştir</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">➕</div>
              <p className="text-green-800">Toplama = Birleştirme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 