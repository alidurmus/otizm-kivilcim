'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

interface FlowGameProps {
  onBack: () => void;
}

interface FlowQuestion {
  object: string;
  emoji: string;
  correctAnswer: 'su akışı' | 'hava akışı' | 'akmaz';
  options: string[];
  description: string;
  flowType: string;
}

const flowItems = [
  { name: 'musluk', emoji: '🚰', flow: 'su akışı', description: 'Açıldığında su akar', type: 'Sıvı akışı' },
  { name: 'rüzgar', emoji: '🌬️', flow: 'hava akışı', description: 'Hava hareket eder ve eser', type: 'Gaz akışı' },
  { name: 'taş', emoji: '🪨', flow: 'akmaz', description: 'Katı halde, hareket etmez', type: 'Katı madde' },
  { name: 'nehir', emoji: '🏞️', flow: 'su akışı', description: 'Sürekli akan su', type: 'Doğal su akışı' },
  { name: 'fan', emoji: '🪭', flow: 'hava akışı', description: 'Hava akımı oluşturur', type: 'Yapay hava akışı' },
  { name: 'masa', emoji: '🪑', flow: 'akmaz', description: 'Katı eşya, yerinde durur', type: 'Katı madde' },
  { name: 'şelale', emoji: '💧', flow: 'su akışı', description: 'Yüksekten aşağı akan su', type: 'Doğal su akışı' },
  { name: 'yel değirmeni', emoji: '🌪️', flow: 'hava akışı', description: 'Rüzgar ile döner', type: 'Rüzgar enerjisi' },
  { name: 'duvar', emoji: '🧱', flow: 'akmaz', description: 'Sert yapı, hareket etmez', type: 'Katı yapı' },
  { name: 'gökkuşağı arkasındaki bulut', emoji: '☁️', flow: 'hava akışı', description: 'Bulutlar havada hareket eder', type: 'Atmosfer olayı' },
] as const;

export default function FlowGame({ onBack }: FlowGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<FlowQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { speak } = useElevenLabs();

  const generateQuestion = useCallback(() => {
    const item = flowItems[Math.floor(Math.random() * flowItems.length)];
    const options = ['su akışı', 'hava akışı', 'akmaz'].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      object: item.name,
      emoji: item.emoji,
      correctAnswer: item.flow as 'su akışı' | 'hava akışı' | 'akmaz',
      options,
      description: item.description,
      flowType: item.type
    });
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    // Soruyu seslendir
    setTimeout(() => {
      speak(`Bu ${item.name} nasıl akar?`, 'sentence');
    }, 1000);
  }, [speak]);

  // İlk yükleme
  useEffect(() => {
    generateQuestion();
    speak('Akış oyununa hoş geldin! Su, hava ve katı maddelerin nasıl hareket ettiğini öğrenelim.', 'sentence');
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
      await speak(`Doğru! ${currentQuestion.object} gerçekten ${currentQuestion.correctAnswer}!`, 'celebration');
    } else {
      await speak(`${currentQuestion.object} aslında ${currentQuestion.correctAnswer}. ${currentQuestion.description}`, 'sentence');
    }
    
    // 4 saniye sonra yeni soru
    setTimeout(() => {
      generateQuestion();
    }, 4000);
  };

  const explainFlow = async () => {
    if (!currentQuestion) return;
    
    await speak(`${currentQuestion.object}: ${currentQuestion.description}. Bu bir ${currentQuestion.flowType} örneğidir.`, 'sentence');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💧</div>
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
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
            <span className="text-lg font-semibold text-cyan-600">
              Puan: {score}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💧 Akış Oyunu</h1>
          <p className="text-gray-600">Su, hava ve katı maddelerin hareketini keşfedelim!</p>
        </div>

        {/* Flow Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bu {currentQuestion.object} nasıl akar?
            </h2>
            
            {/* Flow Animation */}
            <div className="relative flex justify-center items-center mb-6">
              <div className={`text-8xl transition-transform duration-2000 ${
                currentQuestion.correctAnswer === 'su akışı' ? 'animate-bounce' :
                currentQuestion.correctAnswer === 'hava akışı' ? 'animate-pulse' : ''
              }`}>
                {currentQuestion.emoji}
              </div>
              
              {/* Flow indicators */}
              {currentQuestion.correctAnswer === 'su akışı' && (
                <div className="absolute -bottom-4 text-blue-500 animate-bounce">
                  💧💧💧
                </div>
              )}
              {currentQuestion.correctAnswer === 'hava akışı' && (
                <div className="absolute -right-8 text-gray-400 animate-pulse">
                  💨💨💨
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">
              {currentQuestion.description}
            </p>
            <p className="text-sm text-blue-600 font-semibold">
              {currentQuestion.flowType}
            </p>
          </div>
          
          {/* Explain Button */}
          <div className="text-center">
            <button
              onClick={explainFlow}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-600 transition-colors"
            >
              🔊 Akış Açıklaması
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Akış türünü seç:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`
                  py-6 px-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  text-lg font-bold border-4 
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  ${
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : showFeedback && option === selectedAnswer && !isCorrect
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-200 text-cyan-600 hover:border-cyan-300'
                  }
                `}
              >
                <div className="text-4xl mb-3">
                  {option === 'su akışı' ? '💧' : option === 'hava akışı' ? '💨' : '🧱'}
                </div>
                <div className="text-2xl mb-2">
                  {option === 'su akışı' ? '↓' : option === 'hava akışı' ? '→' : '■'}
                </div>
                {option.toUpperCase()}
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
                ? `Evet! ${currentQuestion.object} ${currentQuestion.correctAnswer}.`
                : `${currentQuestion.object} aslında ${currentQuestion.correctAnswer}.`
              }
            </div>
          </div>
        )}

        {/* Physics Facts */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🧪 Fizik Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">💧</div>
              <h4 className="font-semibold text-blue-800 mb-2">Su Akışı (Sıvı)</h4>
              <p className="text-blue-600">Sıvılar yerçekimi ile aşağı akar. Şekli kabına göre değişir.</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">💨</div>
              <h4 className="font-semibold text-gray-800 mb-2">Hava Akışı (Gaz)</h4>
              <p className="text-gray-600">Gazlar hareket eder, yayılır. Rüzgar hava akışıdır.</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl mb-2">🧱</div>
              <h4 className="font-semibold text-orange-800 mb-2">Katı Maddeler</h4>
              <p className="text-orange-600">Katılar akmaz, şekillerini korur, sabit dururlar.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-purple-800">
              <strong>Akış</strong> = Maddenin yerini değiştirme hareketidir. Sıvılar ve gazlar akar, katılar akmaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 