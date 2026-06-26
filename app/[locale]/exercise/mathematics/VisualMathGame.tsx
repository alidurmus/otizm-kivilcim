'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import Button from '@/components/Button';

interface VisualMathProblem {
  id: string;
  title: string;
  type: 'bar_chart' | 'pie_chart' | 'number_line' | 'shape_counting';
  data: number[];
  question: string;
  correctAnswer: number;
  options: number[];
  visual: string;
}

interface VisualMathGameProps {
  onBack: () => void;
}

export default function VisualMathGame({ onBack }: VisualMathGameProps) {
  const [currentProblem, setCurrentProblem] = useState<VisualMathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [totalQuestions] = useState(8);
  const [isAnswering, setIsAnswering] = useState(false);
  
  const { speak } = useElevenLabs();

  // Görsel matematik problemleri
  const visualMathProblems: VisualMathProblem[] = [
    {
      id: '1',
      title: 'Çubuk Grafik',
      type: 'bar_chart',
      data: [3, 2, 4, 1],
      question: 'En yüksek çubuk kaç birim?',
      correctAnswer: 4,
      options: [2, 3, 4, 5],
      visual: 'bars'
    },
    {
      id: '2',
      title: 'Şekil Sayma',
      type: 'shape_counting',
      data: [5],
      question: 'Kaç tane daire var?',
      correctAnswer: 5,
      options: [4, 5, 6, 7],
      visual: 'circles'
    },
    {
      id: '3',
      title: 'Sayı Doğrusu',
      type: 'number_line',
      data: [7],
      question: 'İşaretli sayı kaç?',
      correctAnswer: 7,
      options: [6, 7, 8, 9],
      visual: 'number_line'
    },
    {
      id: '4',
      title: 'Çubuk Grafik Karşılaştırma',
      type: 'bar_chart',
      data: [2, 5, 3, 1],
      question: 'En düşük ve en yüksek çubuk toplamı kaç?',
      correctAnswer: 6,
      options: [5, 6, 7, 8],
      visual: 'bars'
    },
    {
      id: '5',
      title: 'Kare Sayma',
      type: 'shape_counting',
      data: [8],
      question: 'Kaç tane kare var?',
      correctAnswer: 8,
      options: [6, 7, 8, 9],
      visual: 'squares'
    },
    {
      id: '6',
      title: 'Üçgen Gruplama',
      type: 'shape_counting',
      data: [6],
      question: 'Kaç tane üçgen var?',
      correctAnswer: 6,
      options: [5, 6, 7, 8],
      visual: 'triangles'
    },
    {
      id: '7',
      title: 'Çizelge Okuma',
      type: 'bar_chart',
      data: [1, 3, 2, 4],
      question: 'Kaç farklı renk çubuk var?',
      correctAnswer: 4,
      options: [3, 4, 5, 6],
      visual: 'bars'
    },
    {
      id: '8',
      title: 'Sayı Doğrusu Atlama',
      type: 'number_line',
      data: [10],
      question: '5\'ten sonra hangi sayı gelir?',
      correctAnswer: 6,
      options: [5, 6, 7, 8],
      visual: 'number_line'
    }
  ];

  // Rastgele problem seç
  const getRandomProblem = (): VisualMathProblem => {
    const availableProblems = visualMathProblems.filter(p => 
      !usedProblems.includes(p.id)
    );
    
    if (availableProblems.length === 0) {
      return visualMathProblems[0];
    }
    
    return availableProblems[Math.floor(Math.random() * availableProblems.length)];
  };

  const [usedProblems, setUsedProblems] = useState<string[]>([]);

  // Oyunu başlat
  const startGame = () => {
    const problem = getRandomProblem();
    setCurrentProblem(problem);
    setUsedProblems([...usedProblems, problem.id]);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setIsAnswering(false);
    speak(`${problem.title}. ${problem.question}`, 'sentence');
  };

  // Cevap seç
  const handleAnswerSelect = async (answer: number) => {
    if (showResult || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answer);
    const correct = answer === currentProblem?.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      await speak('Mükemmel! Grafiği doğru okudun!', 'celebration');
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
      if (finalScore >= 6) {
        speak('Harika! Görsel matematik uzmanı oldun!', 'celebration');
      } else if (finalScore >= 4) {
        speak('Güzel! Grafikler artık daha kolay!', 'celebration');
      } else {
        speak('Harika bir denemeydi. Birlikte daha çok pratik yapabiliriz.', 'sentence');
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
    setUsedProblems([]);
    startGame();
  };

  // Çubuk renkleri - flat design palette
  const getBarColor = (index: number) => {
    const colors = [
      'bg-focus-blue',
      'bg-success-green',
      'bg-encourage-orange',
      'bg-neutral-gray',
      'bg-blue-400'
    ];
    return colors[index % colors.length];
  };

  // Görsel oluştur
  const renderVisual = (problem: VisualMathProblem) => {
    switch (problem.visual) {
      case 'bars':
        return (
          <div className="flex items-end justify-center gap-4 h-32">
            {problem.data.map((height, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-10 rounded-t-lg ${getBarColor(index)}`}
                  style={{ height: `${height * 20}px` }}
                />
                <div className="text-sm mt-2 text-text-color dark:text-dark-text font-bold">{height}</div>
              </div>
            ))}
          </div>
        );
      
      case 'circles':
        return (
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: problem.data[0] }, (_, index) => (
              <div 
                key={index} 
                className="w-10 h-10 bg-focus-blue rounded-full animate-calm-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'squares':
        return (
          <div className="flex flex-wrap justify-center gap-3 max-w-xs">
            {Array.from({ length: problem.data[0] }, (_, index) => (
              <div 
                key={index} 
                className="w-10 h-10 bg-success-green rounded-lg animate-gentle-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'triangles':
        return (
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: problem.data[0] }, (_, index) => (
              <div 
                key={index} 
                className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-encourage-orange animate-calm-pulse"
                style={{ animationDelay: `${index * 0.15}s` }}
              />
            ))}
          </div>
        );
      
      case 'number_line':
        return (
          <div className="flex justify-center w-full px-4">
            <div className="flex items-center w-full justify-between relative">
              <div className="absolute top-2 left-0 w-full h-1 bg-gray-300 dark:bg-dark-border -z-10" />
              {Array.from({ length: 11 }, (_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-5 h-5 rounded-full border-2 ${
                      index === problem.data[0] 
                        ? 'bg-encourage-orange border-white animate-calm-pulse' 
                        : 'bg-white border-gray-300 dark:border-dark-border'
                    }`}
                  />
                  <div className={`text-sm mt-2 font-bold ${index === problem.data[0] ? 'text-encourage-orange' : 'text-gray-500'}`}>{index}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-500">Görsel yükleniyor...</div>;
    }
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
            <div className="text-6xl mb-6">📈</div>
            <h2 className="text-3xl font-extrabold text-focus-blue mb-4">
              Görsel Matematik Tamamlandı!
            </h2>
            
            <div className="text-4xl font-bold text-success-green mb-4">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-xl text-gray-700 dark:text-dark-text-secondary mb-6">
              %{percentage} başarı oranı
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-focus-blue/20 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{finalScore}</div>
                <div className="text-sm text-blue-700 dark:text-blue-400">Doğru</div>
              </div>
              <div className="bg-encourage-orange/20 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">{totalQuestions - finalScore}</div>
                <div className="text-sm text-orange-700 dark:text-orange-400">Tekrar Denenecek</div>
              </div>
              <div className="bg-success-green/20 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-800 dark:text-green-300">%{percentage}</div>
                <div className="text-sm text-green-700 dark:text-green-400">Başarı</div>
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
            📈 Görsel Matematik
          </h1>
        </div>

        {/* Matematik Görsel Problemi */}
        {currentProblem && (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-6">
                {currentProblem.title}
              </h2>
              
              {/* Görsel Alan */}
              <div className="bg-gray-50 dark:bg-dark-border rounded-xl p-8 mb-8 min-h-[200px] flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
                {renderVisual(currentProblem)}
              </div>
              
              <h3 className="text-xl font-bold text-text-color dark:text-dark-text mb-6">
                {currentProblem.question}
              </h3>
              
              <button 
                onClick={() => speak(currentProblem.question, 'sentence')}
                className="bg-focus-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                🔊 Soruyu Dinle
              </button>
            </div>

            {/* Cevap Seçenekleri */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-6 rounded-xl font-bold text-2xl transition-colors border-4 disabled:opacity-50 ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentProblem.correctAnswer
                          ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400'
                          : 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-400'
                        : 'bg-focus-blue/20 border-focus-blue text-focus-blue'
                      : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-text-color dark:text-dark-text hover:border-focus-blue'
                  }`}
                  disabled={showResult || isAnswering}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Sonuç */}
            {showResult && (
              <div className="text-center mt-8 p-6 bg-gray-50 dark:bg-dark-border rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-encourage-orange'}`}>
                  {isCorrect ? '✨ Mükemmel!' : '💡 Haydi tekrar düşünelim!'}
                </div>
                {!isCorrect && (
                  <div className="text-lg text-text-color dark:text-dark-text-secondary mb-6 font-semibold">
                    Doğru cevap: {currentProblem.correctAnswer}
                  </div>
                )}
                <button 
                  onClick={nextQuestion}
                  className="bg-focus-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
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