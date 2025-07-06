'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

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
    speak(problem.question, 'sentence');
  };

  // Cevap seç
  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentProblem?.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      speak('Doğru! Harika!', 'celebration');
    } else {
      speak('Yanlış. Tekrar dene.', 'sentence');
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
        speak('Güzel! Daha çok pratik yapalım.', 'celebration');
      } else {
        speak('Sorun yok. Tekrar deneyelim.', 'sentence');
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Matematik Problemleri Tamamlandı!
            </h2>
            
            <div className="text-4xl font-bold text-green-600 mb-4">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-xl text-gray-700 mb-6">
              %{percentage} başarı oranı
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{finalScore}</div>
                <div className="text-sm text-gray-600">Doğru</div>
              </div>
              <div className="bg-red-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{totalQuestions - finalScore}</div>
                <div className="text-sm text-gray-600">Yanlış</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">%{percentage}</div>
                <div className="text-sm text-gray-600">Başarı</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={restartGame}
                className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                🔄 Tekrar Oyna
              </button>
              <br />
              <button 
                onClick={onBack}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            🎯 Matematik Problemleri
          </h1>
          <div className="flex justify-center items-center gap-4 text-lg text-gray-700">
            <div>Soru: {currentQuestion}/{totalQuestions}</div>
            <div>•</div>
            <div>Puan: {score}</div>
          </div>
        </div>

        {/* Zorluk Seviyesi */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-center mb-4">Zorluk Seviyesi</h3>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => changeDifficulty('easy')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                difficulty === 'easy' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🟢 Kolay
            </button>
            <button 
              onClick={() => changeDifficulty('medium')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                difficulty === 'medium' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🟡 Orta
            </button>
            <button 
              onClick={() => changeDifficulty('hard')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                difficulty === 'hard' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔴 Zor
            </button>
          </div>
        </div>

        {/* Matematik Problemi */}
        {currentProblem && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🧮</div>
              <h2 className="text-4xl font-bold text-red-600 mb-4">
                {currentProblem.question}
              </h2>
              <button 
                onClick={() => speak(currentProblem.question, 'sentence')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
                  className={`p-6 rounded-xl font-bold text-2xl transition-colors ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentProblem.answer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Sonuç */}
            {showResult && (
              <div className="text-center mt-8">
                <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Doğru!' : '❌ Yanlış!'}
                </div>
                {!isCorrect && (
                  <div className="text-lg text-gray-700 mb-4">
                    Doğru cevap: {currentProblem.answer}
                  </div>
                )}
                <button 
                  onClick={nextQuestion}
                  className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  {currentQuestion >= totalQuestions ? 'Sonuçları Gör' : 'Sonraki Soru'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* İlerleme Çubuğu */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">İlerleme</span>
            <span className="text-sm text-gray-600">{currentQuestion}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-red-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button 
            onClick={onBack}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
} 