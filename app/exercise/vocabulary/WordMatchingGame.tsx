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
    
    if (selectedImage && selectedImage === wordId) {
      // Correct match
      setMatches(prev => new Set([...prev, wordId]));
      setScore(prev => prev + 10);
      await speak('Harika! Doğru eşleştirme!', 'celebration');
      setSelectedWord(null);
      setSelectedImage(null);
    }
  };

  const handleImageClick = (imageId: string) => {
    if (matches.has(imageId)) return;
    
    setSelectedImage(imageId);
    
    if (selectedWord && selectedWord === imageId) {
      // Correct match
      setMatches(prev => new Set([...prev, imageId]));
      setScore(prev => prev + 10);
      speak('Harika! Doğru eşleştirme!', 'celebration');
      setSelectedWord(null);
      setSelectedImage(null);
    }
  };

  const isGameComplete = matches.size === wordPairs.length;

  useEffect(() => {
    if (isGameComplete) {
      speak('Tebrikler! Tüm kelimeleri doğru eşleştirdin!', 'celebration');
    }
  }, [isGameComplete, speak]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎯 Kelime Eşleştirme
        </h1>
        <p className="text-gray-600">
          Kelimeleri doğru resimlerle eşleştir!
        </p>
        <div className="mt-4 text-xl font-semibold text-blue-600">
          Puan: {score}
        </div>
      </div>

      {isGameComplete && (
        <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 text-center mb-8">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Tebrikler!
          </h2>
          <p className="text-green-700">
            Tüm kelimeleri başarıyla eşleştirdin!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kelimeler */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">Kelimeler</h3>
          <div className="space-y-3">
            {wordPairs.map((pair) => (
              <button
                key={`word-${pair.id}`}
                onClick={() => handleWordClick(pair.id, pair.word)}
                disabled={matches.has(pair.id)}
                className={`
                  w-full p-4 rounded-xl text-xl font-bold transition-all duration-200
                  ${matches.has(pair.id)
                    ? 'bg-green-200 text-green-800 cursor-not-allowed'
                    : selectedWord === pair.id
                    ? 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                    : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
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
          <h3 className="text-xl font-semibold mb-4 text-center">Resimler</h3>
          <div className="space-y-3">
            {wordPairs.map((pair) => (
              <button
                key={`image-${pair.id}`}
                onClick={() => handleImageClick(pair.id)}
                disabled={matches.has(pair.id)}
                className={`
                  w-full p-4 rounded-xl text-4xl transition-all duration-200
                  ${matches.has(pair.id)
                    ? 'bg-green-200 cursor-not-allowed'
                    : selectedImage === pair.id
                    ? 'bg-blue-200 border-2 border-blue-400'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                {pair.image}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8 space-x-4">
        {isGameComplete && (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            🔄 Tekrar Oyna
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            ← Geri Dön
          </button>
        )}
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