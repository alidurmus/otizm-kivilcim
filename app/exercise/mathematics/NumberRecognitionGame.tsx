'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import { getStaticAudioPath } from '@/lib/audio-constants';

interface NumberRecognitionGameProps {
  onBack: () => void;
}

interface NumberQuestion {
  number: number;
  displayNumber: string;
  audioText: string;
  staticAudioPath: string;
}

// Sayılar - numbers klasöründeki static ses dosyalarıyla
const numbers: NumberQuestion[] = [
  { number: 1, displayNumber: '1', audioText: 'bir', staticAudioPath: '/audio/numbers/1.mp3' },
  { number: 2, displayNumber: '2', audioText: 'iki', staticAudioPath: '/audio/numbers/2.mp3' },
  { number: 3, displayNumber: '3', audioText: 'üç', staticAudioPath: '/audio/numbers/3.mp3' },
  { number: 4, displayNumber: '4', audioText: 'dört', staticAudioPath: '/audio/numbers/4.mp3' },
  { number: 5, displayNumber: '5', audioText: 'beş', staticAudioPath: '/audio/numbers/5.mp3' },
  { number: 6, displayNumber: '6', audioText: 'altı', staticAudioPath: '/audio/numbers/6.mp3' },
  { number: 7, displayNumber: '7', audioText: 'yedi', staticAudioPath: '/audio/numbers/7.mp3' },
  { number: 8, displayNumber: '8', audioText: 'sekiz', staticAudioPath: '/audio/numbers/8.mp3' },
  { number: 9, displayNumber: '9', audioText: 'dokuz', staticAudioPath: '/audio/numbers/9.mp3' },
  { number: 10, displayNumber: '10', audioText: 'on', staticAudioPath: '/audio/numbers/10.mp3' },
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

  // Sayı ses dosyasını çal - static dosya varsa onu kullan, yoksa ElevenLabs
  const playNumberAudio = async (number: NumberQuestion) => {
    try {
      const audio = new Audio(number.staticAudioPath);
      await audio.play();
      console.log(`✅ Static audio played: ${number.staticAudioPath}`);
    } catch (error) {
      console.log(`❌ Static audio failed, using ElevenLabs: ${error}`);
      await speak(number.audioText, 'word');
    }
  };

  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  useEffect(() => {
    // Oyun başlarken hoş geldiniz mesajını sadece bir kez çal
    if (!hasPlayedWelcome) {
      speak('Sayı tanıma modülüne hoş geldin! Birlikte sayıları öğreneceğiz.', 'sentence');
      setHasPlayedWelcome(true);
    }
  }, [speak, hasPlayedWelcome]);

  const playNumberSound = async () => {
    await playNumberAudio(currentNumber);
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
    
    // Soruyu seslendir (static ses dosyasıyla)
    setTimeout(() => {
      playNumberAudio(correctAnswer);
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
              onClick={() => playNumberAudio(currentNumber)}
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
          <p className="text-gray-600">Sayıları öğren ve tanı!</p>
        </div>

        {/* Number Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="text-8xl font-bold text-purple-600 mb-4">
            {currentNumber.displayNumber}
          </div>
          <div className="text-2xl text-gray-700 mb-6">
            {currentNumber.audioText}
          </div>
          <button
            onClick={playNumberSound}
            className="px-8 py-4 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-colors text-xl"
          >
            🔊 Sesini Dinle
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={previousNumber}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            ← Önceki Sayı
          </button>
          <button
            onClick={nextNumber}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Sonraki Sayı →
          </button>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto mt-8">
          {numbers.map((num) => (
            <button
              key={num.number}
              onClick={() => {
                setCurrentNumber(num);
                playNumberAudio(num);
              }}
              className={`
                aspect-square bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300
                text-3xl font-bold text-purple-600 hover:bg-purple-50
                ${currentNumber.number === num.number ? 'bg-purple-100 ring-4 ring-purple-500' : ''}
              `}
            >
              {num.displayNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 