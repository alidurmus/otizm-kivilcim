'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

interface NumberRecognitionGameProps {
  onBack: () => void;
}

interface NumberQuestion {
  number: number;
  displayNumber: string;
  audioText: string;
}

const numbers: NumberQuestion[] = [
  { number: 1, displayNumber: '1', audioText: 'Bir' },
  { number: 2, displayNumber: '2', audioText: 'İki' },
  { number: 3, displayNumber: '3', audioText: 'Üç' },
  { number: 4, displayNumber: '4', audioText: 'Dört' },
  { number: 5, displayNumber: '5', audioText: 'Beş' },
  { number: 6, displayNumber: '6', audioText: 'Altı' },
  { number: 7, displayNumber: '7', audioText: 'Yedi' },
  { number: 8, displayNumber: '8', audioText: 'Sekiz' },
  { number: 9, displayNumber: '9', audioText: 'Dokuz' },
  { number: 10, displayNumber: '10', audioText: 'On' },
];

export default function NumberRecognitionGame({ onBack }: NumberRecognitionGameProps) {
  const [currentNumber, setCurrentNumber] = useState<NumberQuestion>(numbers[0]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gamePhase, setGamePhase] = useState<'learn' | 'quiz'>('learn');
  const [quizOptions, setQuizOptions] = useState<NumberQuestion[]>([]);
  const { speak } = useElevenLabs();

  useEffect(() => {
    // Oyun başlarken hoş geldiniz mesajını çal
    speak('Sayı tanıma oyununa hoş geldin! Sayıları öğrenelim.', 'sentence');
  }, [speak]);

  const playNumberSound = async () => {
    await speak(currentNumber.audioText, 'word');
  };

  const nextNumber = () => {
    const currentIndex = numbers.findIndex(n => n.number === currentNumber.number);
    const nextIndex = (currentIndex + 1) % numbers.length;
    setCurrentNumber(numbers[nextIndex]);
    setShowFeedback(false);
  };

  const previousNumber = () => {
    const currentIndex = numbers.findIndex(n => n.number === currentNumber.number);
    const prevIndex = currentIndex === 0 ? numbers.length - 1 : currentIndex - 1;
    setCurrentNumber(numbers[prevIndex]);
    setShowFeedback(false);
  };

  const startQuiz = () => {
    setGamePhase('quiz');
    generateQuizQuestion();
    speak('Şimdi quiz zamanı! Duyduğun sayıyı seç.', 'sentence');
  };

  const generateQuizQuestion = () => {
    const correctAnswer = numbers[Math.floor(Math.random() * numbers.length)];
    setCurrentNumber(correctAnswer);
    
    // 3 yanlış seçenek oluştur
    const wrongOptions = numbers
      .filter(n => n.number !== correctAnswer.number)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctAnswer, ...wrongOptions]
      .sort(() => Math.random() - 0.5);
    
    setQuizOptions(allOptions);
    setShowFeedback(false);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(correctAnswer.audioText, 'word');
    }, 1000);
  };

  const handleQuizAnswer = async (selectedNumber: NumberQuestion) => {
    const correct = selectedNumber.number === currentNumber.number;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      await speak('Aferin! Doğru sayıyı seçtin.', 'celebration');
    } else {
      await speak(`Doğru cevap ${currentNumber.audioText} idi. Tekrar deneyelim.`, 'sentence');
    }
    
    // 2 saniye sonra yeni soru
    setTimeout(() => {
      generateQuizQuestion();
    }, 2000);
  };

  if (gamePhase === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔢 Sayı Tanıma Quiz</h1>
            <p className="text-gray-600">Duyduğun sayıyı seç!</p>
          </div>

          {/* Quiz Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {quizOptions.map((option) => (
              <button
                key={option.number}
                onClick={() => handleQuizAnswer(option)}
                disabled={showFeedback}
                className={`
                  aspect-square bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  text-6xl font-bold text-purple-600 hover:bg-purple-50
                  ${showFeedback ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                  ${showFeedback && option.number === currentNumber.number ? 'bg-green-100 ring-4 ring-green-500' : ''}
                  ${showFeedback && option.number !== currentNumber.number && isCorrect === false ? 'bg-red-100' : ''}
                `}
              >
                {option.displayNumber}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center mt-8">
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 Doğru!' : '❌ Yanlış'}
              </div>
              {!isCorrect && (
                <div className="text-gray-600 mt-2">
                  Doğru cevap: {currentNumber.audioText} ({currentNumber.displayNumber})
                </div>
              )}
            </div>
          )}

          {/* Quiz Controls */}
          <div className="text-center mt-8">
            <button
              onClick={() => speak(currentNumber.audioText, 'word')}
              className="mx-2 px-6 py-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-colors"
            >
              🔊 Tekrar Dinle
            </button>
            <button
              onClick={() => setGamePhase('learn')}
              className="mx-2 px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"
            >
              📚 Öğrenme Moduna Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            ← Geri Dön
          </button>
          <button
            onClick={startQuiz}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-colors"
          >
            🎯 Quiz Başlat
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔢 Sayı Tanıma</h1>
          <p className="text-gray-600">Sayıları öğren ve seslerini dinle!</p>
        </div>

        {/* Main Number Display */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-12 max-w-sm mx-auto">
            <div className="text-9xl font-bold text-purple-600 mb-4">
              {currentNumber.displayNumber}
            </div>
            <div className="text-2xl font-semibold text-gray-700">
              {currentNumber.audioText}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={previousNumber}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"
          >
            ← Önceki
          </button>
          <button
            onClick={playNumberSound}
            className="px-8 py-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-colors text-lg font-semibold"
          >
            🔊 Dinle
          </button>
          <button
            onClick={nextNumber}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"
          >
            Sonraki →
          </button>
        </div>

        {/* Number Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🔢 Tüm Sayılar</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {numbers.map((num) => (
              <button
                key={num.number}
                onClick={() => setCurrentNumber(num)}
                className={`
                  aspect-square rounded-lg shadow text-2xl font-bold transition-colors
                  ${currentNumber.number === num.number 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {num.displayNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 