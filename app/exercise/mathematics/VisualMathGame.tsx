'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

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
    speak(`${problem.title}. ${problem.question}`, 'sentence');
  };

  // Cevap seç
  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentProblem?.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      speak('Mükemmel! Grafiği doğru okudun!', 'celebration');
    } else {
      speak('Tekrar bakalım. Görseli dikkatlice incele.', 'sentence');
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
        speak('Sorun yok. Daha çok pratik yapalım.', 'sentence');
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

  // Görsel oluştur
  const renderVisual = (problem: VisualMathProblem) => {
    switch (problem.visual) {
      case 'bars':
        return (
          <div className="flex items-end justify-center gap-2 h-32">
            {problem.data.map((height, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-8 bg-gradient-to-t ${getBarColor(index)} rounded-t-lg`}
                  style={{ height: `${height * 20}px` }}
                />
                <div className="text-sm mt-1 text-gray-600">{height}</div>
              </div>
            ))}
          </div>
        );
      
      case 'circles':
        return (
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: problem.data[0] }, (_, index) => (
              <div 
                key={index} 
                className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'squares':
        return (
          <div className="flex flex-wrap justify-center gap-2 max-w-xs">
            {Array.from({ length: problem.data[0] }, (_, index) => (
              <div 
                key={index} 
                className="w-8 h-8 bg-green-500 animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'triangles':
        return (
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: problem.data[0] }, (_, index) => (
              <div 
                key={index} 
                className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 animate-pulse"
                style={{ animationDelay: `${index * 0.15}s` }}
              />
            ))}
          </div>
        );
      
      case 'number_line':
        return (
          <div className="flex justify-center">
            <div className="flex items-center">
              {Array.from({ length: 11 }, (_, index) => (
                <div key={index} className="flex flex-col items-center mx-2">
                  <div 
                    className={`w-4 h-4 rounded-full ${
                      index === problem.data[0] ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
                    }`}
                  />
                  <div className="text-sm mt-1">{index}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-500">Görsel yükleniyor...</div>;
    }
  };

  // Çubuk renkleri
  const getBarColor = (index: number) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-purple-400 to-purple-600'
    ];
    return colors[index % colors.length];
  };

  // İlk problem yükle
  useEffect(() => {
    startGame();
  }, []);

  if (gameComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">📈</div>
            <h2 className="text-3xl font-bold text-teal-600 mb-4">
              Görsel Matematik Tamamlandı!
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
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-600 mb-4">
            📈 Görsel Matematik
          </h1>
          <div className="flex justify-center items-center gap-4 text-lg text-gray-700">
            <div>Soru: {currentQuestion}/{totalQuestions}</div>
            <div>•</div>
            <div>Puan: {score}</div>
          </div>
        </div>

        {/* Matematik Görsel Problemi */}
        {currentProblem && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-teal-600 mb-6">
                {currentProblem.title}
              </h2>
              
              {/* Görsel Alan */}
              <div className="bg-gray-50 rounded-lg p-8 mb-6 min-h-[200px] flex items-center justify-center">
                {renderVisual(currentProblem)}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentProblem.question}
              </h3>
              
              <button 
                onClick={() => speak(currentProblem.question, 'sentence')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
                  className={`p-6 rounded-xl font-bold text-2xl transition-colors ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentProblem.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-teal-500 text-white'
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
                  {isCorrect ? '✅ Mükemmel!' : '❌ Tekrar Dene!'}
                </div>
                {!isCorrect && (
                  <div className="text-lg text-gray-700 mb-4">
                    Doğru cevap: {currentProblem.correctAnswer}
                  </div>
                )}
                <button 
                  onClick={nextQuestion}
                  className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  {currentQuestion >= totalQuestions ? 'Sonuçları Gör' : 'Sonraki Grafik'}
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
              className="bg-teal-500 h-4 rounded-full transition-all duration-500"
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