'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

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
  const [isAnswering, setIsAnswering] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
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
    setIsAnswering(false);
    
    // Soruyu seslendir (static ses dosyasıyla)
    setTimeout(() => {
      playNumberAudio(correctAnswer);
    }, 1000);
  };

  const handleQuizAnswer = async (selectedOption: NumberQuestion) => {
    if (isAnswering) return;

    setIsAnswering(true);
    setSelectedNumber(selectedOption.number);
    const correct = selectedOption.number === currentNumber.number;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTotalQuestions(prev => prev + 1);
      setScore(prev => prev + 1);
      await speak('Aferin! Çok doğru.', 'celebration');
      // Sadece doğru bilince yeni soruya geç
      setTimeout(() => {
        generateQuizQuestion();
      }, 1000);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      // Yanlış bilince soruyu değiştirme, tekrar denemesi için kilidi aç
      setTimeout(() => {
        setShowFeedback(false);
        setIsAnswering(false);
        setSelectedNumber(null);
      }, 500);
    }
  };

  if (gamePhase === 'quiz') {
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
            <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">🔢 Sayı Tanıma Quiz</h1>
            <p className="text-gray-600 dark:text-dark-text-secondary">Duyduğun sayıyı seç!</p>
          </div>

          {/* Quiz Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {quizOptions.map((option) => (
              <button
                key={option.number}
                onClick={() => handleQuizAnswer(option)}
                disabled={showFeedback || isAnswering}
                className={`
                  aspect-square bg-white dark:bg-dark-surface rounded-2xl transition-all duration-300
                  text-6xl font-extrabold text-focus-blue border-4
                  ${(showFeedback || isAnswering) ? 'cursor-default' : 'cursor-pointer hover:border-focus-blue hover:scale-105'}
                  ${showFeedback && option.number === currentNumber.number ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400' : ''}
                  ${showFeedback && option.number !== currentNumber.number && !isCorrect && selectedNumber === option.number ? 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-400' : ''}
                  ${!showFeedback ? 'border-gray-200 dark:border-dark-border' : ''}
                `}
              >
                {option.displayNumber}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center mt-8 p-6 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border">
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
                {isCorrect ? '🎉 Doğru!' : '💡 Haydi tekrar düşünelim'}
              </div>
              {!isCorrect && (
                <div className="text-gray-600 dark:text-dark-text-secondary mt-2 font-bold text-lg">
                  Doğru cevap: {currentNumber.audioText} ({currentNumber.displayNumber})
                </div>
              )}
            </div>
          )}

          {/* Quiz Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => playNumberAudio(currentNumber)}
              className="px-6 py-3 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
            >
              🔊 Tekrar Dinle
            </button>
            <button
              onClick={() => setGamePhase('learn')}
              className="px-6 py-3 bg-neutral-gray dark:bg-dark-border text-text-color dark:text-dark-text font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              📚 Öğrenme Moduna Dön
            </button>
          </div>
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
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-success-green text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
          >
            🎯 Quiz Başlat
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-focus-blue mb-4">🔢 Sayı Tanıma</h1>
          <p className="text-xl text-gray-600 dark:text-dark-text-secondary">Sayıları öğren ve tanı!</p>
        </div>

        {/* Number Display */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-12 mb-8 text-center flex flex-col items-center justify-center">
          <div className="text-[12rem] leading-none font-extrabold text-focus-blue mb-4 animate-gentle-bounce">
            {currentNumber.displayNumber}
          </div>
          <div className="text-3xl text-gray-700 dark:text-dark-text font-bold mb-8 capitalize">
            {currentNumber.audioText}
          </div>
          <button
            onClick={playNumberSound}
            className="px-8 py-4 bg-focus-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors text-xl w-full max-w-sm"
          >
            🔊 Sesini Dinle
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-sm mx-auto mb-12">
          <button
            onClick={previousNumber}
            className="px-6 py-3 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-focus-blue font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ← Önceki
          </button>
          <button
            onClick={nextNumber}
            className="px-6 py-3 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border text-focus-blue font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Sonraki →
          </button>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          {numbers.map((num) => (
            <button
              key={num.number}
              onClick={() => {
                setCurrentNumber(num);
                playNumberAudio(num);
              }}
              className={`
                aspect-square rounded-2xl transition-all duration-300
                text-3xl font-extrabold border-4 flex items-center justify-center
                ${currentNumber.number === num.number 
                  ? 'bg-focus-blue/10 border-focus-blue text-focus-blue' 
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:border-focus-blue'
                }
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