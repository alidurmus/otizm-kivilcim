'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { useElevenLabs } from '@/lib/elevenlabs';

// --- Veri Yapısı ve Oyun Verisi ---
interface MatchItem {
  word: string;
  options: string[]; // Emoji veya resim URL'leri
  correctAnswer: string;
}

const gameData: MatchItem[] = [
  { word: 'Elma', options: ['🍎', '🍌', '🍇', '🍓'], correctAnswer: '🍎' },
  { word: 'Araba', options: ['✈️', '🚗', '🚲', '🚢'], correctAnswer: '🚗' },
  { word: 'Köpek', options: ['🐈', '🐕', '🐘', '🐅'], correctAnswer: '🐕' },
  { word: 'Güneş', options: ['🌙', '⭐', '☀️', '☁️'], correctAnswer: '☀️' },
  { word: 'Kitap', options: ['✏️', '📖', '💻', '🎒'], correctAnswer: '📖' },
];

// --- Bileşenler ---

const FeedbackCard = ({ isCorrect, word, onNext }: { isCorrect: boolean, word: string, onNext: () => void }) => (
  <div className={`mt-6 p-6 rounded-xl text-center ${
    isCorrect ? 'bg-success-green bg-opacity-30' : 'bg-encourage-orange bg-opacity-30'
  }`}>
    <div className="text-4xl mb-3">{isCorrect ? '🎉' : '🤔'}</div>
    <h3 className="text-xl font-bold text-adaptive mb-3">
      {isCorrect ? 'Harikasın!' : 'Tekrar Deneyelim'}
    </h3>
    <p className="text-adaptive-secondary mb-4">
      {isCorrect ? `Doğru! Bu bir ${word}.` : 'Bu doğru cevap değil. Haydi tekrar dene!'}
    </p>
    {isCorrect && (
      <Button variant="success" onClick={onNext}>Sıradaki</Button>
    )}
  </div>
);

const CompletionCard = ({ onRestart }: { onRestart: () => void }) => (
  <div className="text-center bg-adaptive rounded-2xl shadow-lg p-8">
    <div className="text-5xl mb-4">🏆</div>
    <h2 className="text-3xl font-bold text-adaptive mb-4">Tebrikler!</h2>
    <p className="text-lg text-adaptive-secondary mb-6">
      Resim eşleştirme oyununu başarıyla tamamladın!
    </p>
    <Button variant="primary" size="large" onClick={onRestart}>
      Tekrar Oyna
    </Button>
  </div>
);

// --- Ana Oyun Bileşeni ---

export default function KelimeEsleştirmeOyunu({ onBack }: { onBack: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledData, setShuffledData] = useState<MatchItem[]>([]);
  const { speak } = useElevenLabs();

  useEffect(() => {
    // Oyunu her başlattığında veya yeniden başlattığında veriyi karıştır
    setShuffledData(gameData.sort(() => Math.random() - 0.5));
  }, []);

  const currentItem = shuffledData[currentQuestionIndex];

  if (!currentItem) {
    return <CompletionCard onRestart={() => { setCurrentQuestionIndex(0); setSelectedAnswer(null); setIsCorrect(null); }} />;
  }

  const handleAnswerClick = (option: string) => {
    if (selectedAnswer) return; // Zaten bir cevap seçilmişse tekrar tıklamayı engelle

    setSelectedAnswer(option);
    const correct = option === currentItem.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      speak(`Harika! Bu bir ${currentItem.word}.`, 'celebration');
    } else {
      speak('Bu doğru değil. Tekrar dene.', 'word');
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const playWordSound = () => {
    speak(currentItem.word, 'word');
  };

  return (
    <div className="w-full">
      <ProgressBar current={currentQuestionIndex} total={gameData.length} label="Kelime Avı" />
      
      <div className="bg-adaptive rounded-2xl shadow-lg dark:shadow-xl p-8 text-center mt-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-adaptive mb-2">
          {currentItem.word}
        </h2>
        <p className="text-adaptive-secondary mb-8">Bu kelimenin resmi hangisi?</p>
        
        <Button variant="secondary" size="small" onClick={playWordSound} className="mb-8">
          🔊 Kelimeyi Dinle
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {currentItem.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerClick(option)}
              className={`p-4 md:p-6 bg-adaptive-light dark:bg-dark-surface rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg
                ${selectedAnswer && (option === currentItem.correctAnswer ? 'border-4 border-success-green ring-4 ring-green-500/50' : '')}
                ${selectedAnswer === option && !isCorrect ? 'border-4 border-encourage-orange ring-4 ring-orange-500/50' : ''}
              `}
            >
              <span className="text-5xl md:text-7xl">{option}</span>
            </div>
          ))}
        </div>

        {selectedAnswer && isCorrect !== null && (
          <FeedbackCard isCorrect={isCorrect} word={currentItem.word} onNext={handleNext} />
        )}
      </div>
    </div>
  );
}
