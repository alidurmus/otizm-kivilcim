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
    <div className="min-h-screen soft-gradient-bg p-4 md:p-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-panel premium-shadow rounded-2xl p-6 md:p-8 mb-6 animate-slow-slide-up">
          <div className="text-center">
            <div className="inline-block mb-3">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-4xl mx-auto">
                🎯
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-adaptive mb-2 tracking-tight">
              Kelime Eşleştirme
            </h1>
            <p className="text-adaptive-secondary text-base mb-4">
              Kelimeleri doğru resimlerle eşleştir!
            </p>
            <div className="inline-flex items-center gap-2 bg-focus-blue/10 text-focus-blue px-5 py-2.5 rounded-xl font-bold text-lg">
              <span>⭐</span>
              <span>Puan: {score}</span>
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {isGameComplete && (
          <div className="glass-panel rounded-2xl p-6 text-center mb-6 border-2 border-success-green/50 animate-slow-slide-up">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">
              Tebrikler!
            </h2>
            <p className="text-emerald-600 dark:text-emerald-300 font-semibold">
              Tüm kelimeleri başarıyla eşleştirdin!
            </p>
          </div>
        )}

        {/* Game Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Kelimeler */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-lg font-extrabold text-adaptive text-center mb-4 flex items-center justify-center gap-2">
              <span className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-sm">📝</span>
              Kelimeler
            </h3>
            <div className="space-y-3">
              {wordPairs.map((pair) => (
                <button
                  key={`word-${pair.id}`}
                  onClick={() => handleWordClick(pair.id, pair.word)}
                  disabled={matches.has(pair.id)}
                  aria-label={`Kelime: ${pair.word}`}
                  className={`
                    w-full p-4 rounded-xl text-xl font-extrabold transition-all duration-500
                    ${matches.has(pair.id)
                      ? 'glass-panel border-2 border-success-green/60 text-emerald-700 dark:text-emerald-400 cursor-default opacity-70'
                      : selectedWord === pair.id
                      ? 'glass-panel border-2 border-focus-blue text-focus-blue scale-[1.03] premium-shadow'
                      : 'glass-panel border border-transparent text-adaptive hover:border-focus-blue/30 hover:scale-[1.02]'
                    }
                  `}
                >
                  {matches.has(pair.id) && <span className="mr-2">✓</span>}
                  {pair.word}
                </button>
              ))}
            </div>
          </div>

          {/* Resimler */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-lg font-extrabold text-adaptive text-center mb-4 flex items-center justify-center gap-2">
              <span className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-sm">🖼️</span>
              Resimler
            </h3>
            <div className="space-y-3">
              {wordPairs.map((pair) => (
                <button
                  key={`image-${pair.id}`}
                  onClick={() => handleImageClick(pair.id)}
                  disabled={matches.has(pair.id)}
                  aria-label={`Resim: ${pair.word}`}
                  className={`
                    w-full p-4 rounded-xl text-4xl transition-all duration-500
                    ${matches.has(pair.id)
                      ? 'glass-panel border-2 border-success-green/60 cursor-default opacity-70'
                      : selectedImage === pair.id
                      ? 'glass-panel border-2 border-focus-blue scale-[1.03] premium-shadow'
                      : 'glass-panel border border-transparent hover:border-focus-blue/30 hover:scale-[1.02]'
                    }
                  `}
                >
                  {pair.image}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="glass-panel px-6 py-3.5 rounded-xl font-bold text-adaptive hover:scale-[1.03] transition-all duration-500"
              aria-label="Menüye geri dön"
            >
              ← Geri Dön
            </button>
          )}
          {isGameComplete && (
            <button
              onClick={resetGame}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-400/80 to-cyan-400/80 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.03] transition-all duration-500"
              aria-label="Oyunu tekrar başlat"
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