'use client';

import React, { useState, useEffect } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';
import { ExerciseErrorBoundary } from '@/components/ErrorBoundary';

interface WordPair {
  id: string;
  word: string;
  image: string;
  audio?: string;
}

const wordPairs: WordPair[] = [
  { id: '1', word: 'el', image: '✋' },
  { id: '2', word: 'at', image: '🐴' },
  { id: '3', word: 'ev', image: '🏠' },
  { id: '4', word: 'ok', image: '🏹' },
  { id: '5', word: 'su', image: '💧' },
];

function WordMatchingGameCore({ onBack }: { onBack?: () => void }) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const { speak } = useElevenLabs();

  const resetGame = () => {
    setSelectedWord(null);
    setSelectedImage(null);
    setMatches(new Set());
    setScore(0);
  };

  const handleWordClick = async (wordId: string, word: string) => {
    if (matches.has(wordId)) return;
    
    setSelectedWord(wordId);
    await speak(word, 'word');
    
    if (selectedImage) {
      if (selectedImage === wordId) {
        setMatches(prev => new Set([...prev, wordId]));
        setScore(prev => prev + 10);
        await speak('Harika! Doğru eşleştirme!', 'celebration');
        setSelectedWord(null);
        setSelectedImage(null);
      } else {
        await speak('Bir daha deneyelim.', 'sentence');
        setSelectedWord(null);
        setSelectedImage(null);
      }
    }
  };

  const handleImageClick = async (imageId: string) => {
    if (matches.has(imageId)) return;
    
    setSelectedImage(imageId);
    
    if (selectedWord) {
      if (selectedWord === imageId) {
        setMatches(prev => new Set([...prev, imageId]));
        setScore(prev => prev + 10);
        await speak('Harika! Doğru eşleştirme!', 'celebration');
        setSelectedWord(null);
        setSelectedImage(null);
      } else {
        await speak('Bir daha deneyelim.', 'sentence');
        setSelectedWord(null);
        setSelectedImage(null);
      }
    }
  };

  const isGameComplete = matches.size === wordPairs.length;

  useEffect(() => {
    if (isGameComplete) {
      speak('Tebrikler! Tüm kelimeleri doğru eşleştirdin!', 'celebration');
    }
  }, [isGameComplete, speak]);

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2 animate-gentle-bounce">
            🎯 Kelime Eşleştirme
          </h1>
          <p className="text-gray-600 dark:text-dark-text-secondary text-lg">
            Kelimeleri doğru resimlerle eşleştir!
          </p>
          <div className="mt-4 text-xl font-bold text-focus-blue bg-focus-blue/10 inline-block px-4 py-2 rounded-xl">
            Puan: {score}
          </div>
        </div>

      {isGameComplete && (
        <div className="bg-success-green/20 border-2 border-success-green rounded-xl p-6 text-center mb-8 animate-gentle-bounce">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-400 mb-2">
            Tebrikler!
          </h2>
          <p className="text-green-700 dark:text-green-300 font-bold">
            Tüm kelimeleri başarıyla eşleştirdin!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kelimeler */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-center text-text-color dark:text-dark-text">Kelimeler</h3>
          <div className="space-y-3">
            {wordPairs.map((pair) => (
              <button
                key={`word-${pair.id}`}
                onClick={() => handleWordClick(pair.id, pair.word)}
                disabled={matches.has(pair.id)}
                className={`
                  w-full p-4 rounded-xl text-xl font-extrabold transition-all duration-300
                  ${matches.has(pair.id)
                    ? 'bg-success-green/20 text-green-800 dark:text-green-400 border-2 border-success-green cursor-not-allowed'
                    : selectedWord === pair.id
                    ? 'bg-focus-blue/20 text-blue-800 dark:text-blue-400 border-2 border-focus-blue scale-[1.02]'
                    : 'bg-gray-50 dark:bg-dark-border text-text-color dark:text-dark-text border-2 border-gray-200 dark:border-gray-600 hover:border-focus-blue hover:scale-[1.02]'
                  }
                `}
              >
                {pair.word}
              </button>
            ))}
          </div>
        </div>

        {/* Resimler */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-center text-text-color dark:text-dark-text">Resimler</h3>
          <div className="space-y-3">
            {wordPairs.map((pair) => (
              <button
                key={`image-${pair.id}`}
                onClick={() => handleImageClick(pair.id)}
                disabled={matches.has(pair.id)}
                className={`
                  w-full p-4 rounded-xl text-4xl transition-all duration-300
                  ${matches.has(pair.id)
                    ? 'bg-success-green/20 border-2 border-success-green cursor-not-allowed'
                    : selectedImage === pair.id
                    ? 'bg-focus-blue/20 border-2 border-focus-blue scale-[1.02]'
                    : 'bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 hover:border-focus-blue hover:scale-[1.02]'
                  }
                `}
              >
                {pair.image}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8 space-x-4 flex justify-center">
        {onBack && (
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gray-100 dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl font-extrabold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ← Geri Dön
          </button>
        )}
        {isGameComplete && (
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-focus-blue text-white rounded-xl font-extrabold hover:bg-blue-600 transition-colors"
          >
            🔄 Tekrar Oyna
          </button>
        )}
      </div>
    </div>
  </div>
  );
}

export default function WordMatchingGame({ onBack }: { onBack?: () => void }) {
  return (
    <ExerciseErrorBoundary
      exerciseName="Kelime Eşleştirme"
      onBackToMenu={onBack}
      onRetry={() => {
        // Component will re-render automatically when error boundary resets
        window.location.reload();
      }}
    >
      <WordMatchingGameCore onBack={onBack} />
    </ExerciseErrorBoundary>
  );
} 