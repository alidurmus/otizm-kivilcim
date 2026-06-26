'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface MathProblem {
  id: string;
  question: string;
  answer: number;
  options: number[];
  type: 'addition' | 'subtraction' | 'counting';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MathProblemsGameProps {
  onBack: () => void;
}

export default function MathProblemsGame({ onBack }: MathProblemsGameProps) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [totalQuestions] = useState(10);
  const [isAnswering, setIsAnswering] = useState(false);
  
  const { speak } = useElevenLabs();

  // Matematik problemleri havuzu
  const mathProblems: MathProblem[] = [
    // Kolay seviye (1-5 arası)
    { id: '1', question: '2 + 1 = ?', answer: 3, options: [2, 3, 4, 5], type: 'addition', difficulty: 'easy' },
    { id: '2', question: '1 + 1 = ?', answer: 2, options: [1, 2, 3, 4], type: 'addition', difficulty: 'easy' },
    { id: '3', question: '3 + 2 = ?', answer: 5, options: [4, 5, 6, 7], type: 'addition', difficulty: 'easy' },
    { id: '4', question: '4 - 1 = ?', answer: 3, options: [2, 3, 4, 5], type: 'subtraction', difficulty: 'easy' },
    { id: '5', question: '5 - 2 = ?', answer: 3, options: [2, 3, 4, 5], type: 'subtraction', difficulty: 'easy' },
    
    // Orta seviye (6-10 arası)
    { id: '6', question: '6 + 3 = ?', answer: 9, options: [8, 9, 10, 11], type: 'addition', difficulty: 'medium' },
    { id: '7', question: '7 + 2 = ?', answer: 9, options: [8, 9, 10, 11], type: 'addition', difficulty: 'medium' },
    { id: '8', question: '8 - 3 = ?', answer: 5, options: [4, 5, 6, 7], type: 'subtraction', difficulty: 'medium' },
    { id: '9', question: '10 - 4 = ?', answer: 6, options: [5, 6, 7, 8], type: 'subtraction', difficulty: 'medium' },
    { id: '10', question: '9 - 2 = ?', answer: 7, options: [6, 7, 8, 9], type: 'subtraction', difficulty: 'medium' },
    
    // Zor seviye (10+ arası)
    { id: '11', question: '8 + 7 = ?', answer: 15, options: [14, 15, 16, 17], type: 'addition', difficulty: 'hard' },
    { id: '12', question: '12 - 5 = ?', answer: 7, options: [6, 7, 8, 9], type: 'subtraction', difficulty: 'hard' },
    { id: '13', question: '9 + 6 = ?', answer: 15, options: [14, 15, 16, 17], type: 'addition', difficulty: 'hard' },
    { id: '14', question: '13 - 4 = ?', answer: 9, options: [8, 9, 10, 11], type: 'subtraction', difficulty: 'hard' },
    { id: '15', question: '7 + 8 = ?', answer: 15, options: [14, 15, 16, 17], type: 'addition', difficulty: 'hard' },
  ];

  // Zorluk seviyesine göre problem seç
  const getRandomProblem = (): MathProblem => {
    const filteredProblems = mathProblems.filter(p => p.difficulty === difficulty);
    return filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
  };

  // Oyunu başlat
  const startGame = () => {
    const problem = getRandomProblem();
    setCurrentProblem(problem);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setIsAnswering(false);
    speak(problem.question, 'sentence');
  };

  // Cevap seç
  const handleAnswerSelect = async (answer: number) => {
    if (showResult || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    const correct = answer === currentProblem?.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      await speak('Doğru! Harika!', 'celebration');
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      await speak('Biraz daha düşünelim.', 'sentence');
      setTimeout(() => {
        setShowResult(false);
        setIsAnswering(false);
        setSelectedAnswer(null);
      }, 500);
    }
  };

  // Sonraki soru
  const nextQuestion = () => {
    if (currentQuestion >= totalQuestions) {
      setGameComplete(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      if (finalScore >= 8) {
        speak('Harika! Matematik ustası oldun!', 'celebration');
      } else if (finalScore >= 5) {
        speak('Çok güzel! Daha çok pratik yapabiliriz.', 'celebration');
      } else {
        speak('Harika bir denemeydi. Tekrar deneyelim.', 'sentence');
      }
      return;
    }
    
    setCurrentQuestion(currentQuestion + 1);
    startGame();
  };

  // Oyunu yeniden başlat
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(1);
    setGameComplete(false);
    startGame();
  };

  // Zorluk seviyesi değiştir
  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    setScore(0);
    setCurrentQuestion(1);
    setGameComplete(false);
    setTimeout(() => startGame(), 500);
  };

  // İlk problem yükle
  useEffect(() => {
    startGame();
  }, []);

  if (gameComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-extrabold text-focus-blue mb-4">
              Matematik Problemleri Tamamlandı!
            </h2>
            
            <div className="text-4xl font-bold text-success-green mb-4">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-xl text-gray-700 dark:text-dark-text-secondary mb-6 font-bold">
              %{percentage} başarı oranı
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{finalScore}</div>
                <div className="text-sm font-bold text-blue-700 dark:text-blue-400">Doğru</div>
              </div>
              <div className="bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">{totalQuestions - finalScore}</div>
                <div className="text-sm font-bold text-orange-700 dark:text-orange-400">Tekrar Edilecek</div>
              </div>
              <div className="bg-success-green/20 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-800 dark:text-green-300">%{percentage}</div>
                <div className="text-sm font-bold text-green-700 dark:text-green-400">Başarı</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={restartGame}
                className="bg-focus-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                🔄 Tekrar Oyna
              </button>
              <button 
                onClick={onBack}
                className="bg-neutral-gray dark:bg-dark-border text-text-color dark:text-dark-text px-8 py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                ← Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onBack} variant="secondary">
            ← Geri Dön
          </Button>
          <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-dark-border">
            <div className="flex gap-4 text-lg font-bold text-gray-700 dark:text-dark-text-secondary">
              <div>Soru: <span className="text-focus-blue">{currentQuestion}/{totalQuestions}</span></div>
              <div>Puan: <span className="text-success-green">{score}</span></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-focus-blue mb-4">
            🎯 Matematik Problemleri
          </h1>
        </div>

        {/* Zorluk Seviyesi */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6 mb-8">
          <h3 className="text-xl font-bold text-center mb-4 text-text-color dark:text-dark-text">Zorluk Seviyesi</h3>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => changeDifficulty('easy')}
              className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                difficulty === 'easy' 
                  ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400' 
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-secondary hover:border-success-green'
              }`}
            >
              🟢 Kolay
            </button>
            <button 
              onClick={() => changeDifficulty('medium')}
              className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                difficulty === 'medium' 
                  ? 'bg-focus-blue/20 border-focus-blue text-blue-700 dark:text-blue-400' 
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-secondary hover:border-focus-blue'
              }`}
            >
              🔵 Orta
            </button>
            <button 
              onClick={() => changeDifficulty('hard')}
              className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                difficulty === 'hard' 
                  ? 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-400' 
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text-secondary hover:border-encourage-orange'
              }`}
            >
              🟠 Zor
            </button>
          </div>
        </div>

        {/* Matematik Problemi */}
        {currentProblem && (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-gentle-bounce">🧮</div>
              <h2 className="text-5xl font-extrabold text-focus-blue mb-6">
                {currentProblem.question}
              </h2>
              <button 
                onClick={() => speak(currentProblem.question, 'sentence')}
                className="bg-focus-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                🔊 Dinle
              </button>
            </div>

            {/* Cevap Seçenekleri */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult || isAnswering}
                  className={`p-6 rounded-xl font-bold text-3xl transition-colors border-4 disabled:opacity-50 ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentProblem.answer
                          ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400'
                          : 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-400'
                        : 'bg-focus-blue/20 border-focus-blue text-focus-blue'
                      : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-text-color dark:text-dark-text hover:border-focus-blue'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Sonuç */}
            {showResult && (
              <div className="text-center mt-8 p-6 bg-gray-50 dark:bg-dark-border rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
                  {isCorrect ? '✨ Doğru!' : '💡 Haydi tekrar düşünelim!'}
                </div>
                {!isCorrect && (
                  <div className="text-xl font-bold text-text-color dark:text-dark-text-secondary mb-6">
                    Doğru cevap: {currentProblem.answer}
                  </div>
                )}
                <button 
                  onClick={nextQuestion}
                  className="bg-focus-blue text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  {currentQuestion >= totalQuestions ? 'Sonuçları Gör' : 'Sonraki Soru'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* İlerleme Çubuğu */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">İlerleme</span>
            <span className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">{currentQuestion}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-4 overflow-hidden">
            <div 
              className="bg-focus-blue h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}