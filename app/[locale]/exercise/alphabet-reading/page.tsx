'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Star, Award, BookOpen } from 'lucide-react';
import { useElevenLabs } from '@/lib/elevenlabs';

// Türk alfabesi harfleri - 29 harf
const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

// Sesli harfler
const VOWELS = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];

type GameMode = 'learn' | 'identify' | 'quiz';
type LetterCase = 'upper' | 'lower' | 'mixed';

export default function AlphabetReadingPage() {
  const router = useRouter();
  const { speak, stopCurrentAudio } = useElevenLabs();

  // Game state
  const [gameMode, setGameMode] = useState<GameMode>('learn');
  const [letterCase, setLetterCase] = useState<LetterCase>('upper');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);


  // Quiz state
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentLetter = TURKISH_ALPHABET[currentLetterIndex];

  // Welcome message - sadece bir kez çal
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const playWelcome = async () => {
      // Sayfa yüklenirken kısa bir delay
      timeoutId = setTimeout(async () => {
        if (!isPlaying) {
          setIsPlaying(true);
          try {
            await speak("Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.", 'sentence');
          } finally {
            setIsPlaying(false);
          }
        }
      }, 1000);
    };
    
    playWelcome();
    
    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Letter pronunciation with additional safety
  const pronounceLetter = useCallback(async (letter: string) => {
    if (isPlaying) return;
    try {
      setIsPlaying(true);
      // Önceki sesi durdur
      stopCurrentAudio();
      await speak(letter.toLowerCase(), 'letter');
    } catch (_error) {
      // Letter pronunciation failed - continuing silently
    } finally {
      setIsPlaying(false);
    }
  }, [speak, stopCurrentAudio, isPlaying]);

  // Generate quiz options
  const generateQuizOptions = useCallback((correctLetter: string) => {
    const allOptions = [...TURKISH_ALPHABET];
    const otherOptions = allOptions.filter(l => l !== correctLetter);
    
    // Randomly select 3 other options
    const randomOptions = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * otherOptions.length);
      randomOptions.push(otherOptions.splice(randomIndex, 1)[0]);
    }
    
    // Add correct answer and shuffle
    const options = [...randomOptions, correctLetter];
    return options.sort(() => Math.random() - 0.5);
  }, []);

  // Start quiz mode
  const startQuiz = useCallback(() => {
    // 🛑 Önce önceki sesleri durdur
    stopCurrentAudio();
    
    const randomIndex = Math.floor(Math.random() * TURKISH_ALPHABET.length);
    const letter = TURKISH_ALPHABET[randomIndex];
    const options = generateQuizOptions(letter);
    
    setCurrentLetterIndex(randomIndex);
    setCorrectAnswer(letter);
    setQuizOptions(options);
    setSelectedAnswer('');
    setShowFeedback(false);
    setGameMode('quiz');
    
    // Quiz harfini daha geç çal - önceki sesler bitmesi için bekle
    setTimeout(() => {
      pronounceLetter(letter);
    }, 800); 
  }, [generateQuizOptions, pronounceLetter, stopCurrentAudio]);

  // Handle quiz answer
  const handleQuizAnswer = useCallback(async (answer: string) => {
    if (isPlaying) return;
    
    // 🛑 Önce önceki sesleri durdur  
    stopCurrentAudio();
    setIsPlaying(true);
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    try {
      if (answer === correctAnswer) {
        setScore(prev => prev + 10);
        setStreak(prev => prev + 1);
        setShowCelebration(true);
        
        await speak("Doğru! Harika iş çıkardın!", 'celebration');
        
        // Celebration tamamlandıktan sonra yeni quiz başlat
        setTimeout(() => {
          setShowCelebration(false);
          setIsPlaying(false);
          startQuiz(); // Yeni quiz sorusu
        }, 1500);
      } else {
        setStreak(0);
        await speak("Bir daha deneyelim.", 'sentence');
        
        // Yanlış bilindiğinde soruyu değiştirme, tekrar denemesi için kilidi aç
        setTimeout(() => {
          setShowFeedback(false);
          setIsPlaying(false);
          setSelectedAnswer('');
        }, 500);
      }
    } catch (_error) {
       setIsPlaying(false);
    }
  }, [correctAnswer, speak, startQuiz, stopCurrentAudio, isPlaying]);

  // Navigate letters in learn mode
  const navigateToLetter = useCallback(async (direction: 'prev' | 'next') => {
    if (isPlaying) return;
    
    // 🛑 Önce önceki sesleri durdur
    stopCurrentAudio();
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentLetterIndex < TURKISH_ALPHABET.length - 1 ? currentLetterIndex + 1 : 0;
    } else {
      newIndex = currentLetterIndex > 0 ? currentLetterIndex - 1 : TURKISH_ALPHABET.length - 1;
    }
    
    setCurrentLetterIndex(newIndex);
    
    // Kısa bir delay ile yeni harfi seslendir
    setTimeout(() => {
      pronounceLetter(TURKISH_ALPHABET[newIndex]);
    }, 200);
  }, [currentLetterIndex, pronounceLetter, stopCurrentAudio, isPlaying]);

  // Letter case display helper
  const getDisplayLetter = (letter: string) => {
    switch (letterCase) {
      case 'lower':
        return letter.toLowerCase();
      case 'mixed':
        // Seeded from index to prevent hydration mismatch/jumping
        return letter.charCodeAt(0) % 2 === 0 ? letter : letter.toLowerCase();
      default:
        return letter;
    }
  };

  // Check if letter is vowel
  const isVowel = (letter: string) => VOWELS.includes(letter.toUpperCase());

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg transition-colors duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b-2 border-gray-200 dark:border-dark-border mb-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/modules')}
                className="p-3 bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Geri dön"
              >
                <ArrowLeft className="w-6 h-6 text-text-color dark:text-dark-text" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-focus-blue/10 rounded-xl flex items-center justify-center border border-focus-blue/20">
                  <BookOpen className="w-5 h-5 text-focus-blue" />
                </div>
                <h1 className="text-2xl font-extrabold text-focus-blue">Alfabe Okuma</h1>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-xl border-2 border-yellow-200 dark:border-yellow-700">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                <span className="text-base font-extrabold text-yellow-800 dark:text-yellow-400">{score} Puan</span>
              </div>
              <div className="flex items-center gap-2 bg-success-green/10 px-4 py-2 rounded-xl border-2 border-success-green/30">
                <Award className="w-5 h-5 text-success-green" />
                <span className="text-base font-extrabold text-green-800 dark:text-green-400">{streak} Seri</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Game Mode Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border w-fit mx-auto">
            <button
              onClick={() => setGameMode('learn')}
              className={`px-8 py-3 rounded-xl font-extrabold transition-all border-2 ${
                gameMode === 'learn'
                  ? 'bg-focus-blue text-white border-transparent'
                  : 'bg-white dark:bg-dark-border text-gray-700 dark:text-dark-text border-gray-200 dark:border-gray-600 hover:border-focus-blue'
              }`}
            >
              Öğren
            </button>
            <button
              onClick={startQuiz}
              className={`px-8 py-3 rounded-xl font-extrabold transition-all border-2 ${
                gameMode === 'quiz'
                  ? 'bg-success-green text-white border-transparent'
                  : 'bg-white dark:bg-dark-border text-gray-700 dark:text-dark-text border-gray-200 dark:border-gray-600 hover:border-success-green'
              }`}
            >
              Quiz
            </button>
          </div>
        </div>

        {/* Letter Case Selection */}
        {gameMode === 'learn' && (
          <div className="mb-8">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setLetterCase('upper')}
                className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all border-2 ${
                  letterCase === 'upper'
                    ? 'bg-focus-blue dark:bg-blue-400 text-white dark:text-gray-900 border-transparent'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text border-gray-200 dark:border-dark-border hover:border-gray-400'
                }`}
              >
                Büyük Harf
              </button>
              <button
                onClick={() => setLetterCase('lower')}
                className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all border-2 ${
                  letterCase === 'lower'
                    ? 'bg-focus-blue dark:bg-blue-400 text-white dark:text-gray-900 border-transparent'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text border-gray-200 dark:border-dark-border hover:border-gray-400'
                }`}
              >
                Küçük Harf
              </button>
              <button
                onClick={() => setLetterCase('mixed')}
                className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all border-2 ${
                  letterCase === 'mixed'
                    ? 'bg-focus-blue dark:bg-blue-400 text-white dark:text-gray-900 border-transparent'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text border-gray-200 dark:border-dark-border hover:border-gray-400'
                }`}
              >
                Karışık
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8">
          {gameMode === 'learn' ? (
            /* Learn Mode */
            <div className="text-center">
              {/* Current Letter Display */}
              <div className="mb-8">
                <button 
                  className={`inline-flex items-center justify-center w-56 h-56 rounded-3xl text-[8rem] font-extrabold transition-all duration-300 border-4 mb-6 ${
                    isVowel(currentLetter) 
                      ? 'bg-focus-blue/10 border-focus-blue text-focus-blue' 
                      : 'bg-success-green/10 border-success-green text-green-700 dark:text-green-500'
                  } ${isPlaying ? 'opacity-80 scale-[0.98]' : 'hover:scale-[1.02] hover:bg-opacity-20'}`}
                  onClick={() => pronounceLetter(currentLetter)}
                  disabled={isPlaying}
                >
                  {getDisplayLetter(currentLetter)}
                </button>
                
                {/* Letter Info */}
                <div className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-dark-border py-4 px-8 rounded-2xl w-fit mx-auto border-2 border-gray-100 dark:border-gray-700">
                  <p className="text-2xl font-extrabold text-text-color dark:text-dark-text">
                    {isVowel(currentLetter) ? 'Sesli Harf' : 'Sessiz Harf'}
                  </p>
                  <p className="text-base font-bold text-gray-500 dark:text-dark-text-secondary">
                    {currentLetterIndex + 1}. harf ({currentLetterIndex + 1}/{TURKISH_ALPHABET.length})
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-10 pb-10 border-b-2 border-gray-100 dark:border-dark-border">
                <button
                  onClick={() => navigateToLetter('prev')}
                  disabled={isPlaying}
                  className="px-8 py-4 bg-gray-200 dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl font-extrabold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  ← Önceki
                </button>
                
                <button
                  onClick={() => pronounceLetter(currentLetter)}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-8 py-4 bg-focus-blue text-white rounded-xl font-extrabold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Volume2 className="w-6 h-6" />
                  {isPlaying ? 'Dinleniyor...' : 'Dinle'}
                </button>
                
                <button
                  onClick={() => navigateToLetter('next')}
                  disabled={isPlaying}
                  className="px-8 py-4 bg-gray-200 dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl font-extrabold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Sonraki →
                </button>
              </div>

              {/* Alphabet Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 max-w-4xl mx-auto">
                {TURKISH_ALPHABET.map((letter, index) => (
                  <button
                    key={letter}
                    onClick={() => {
                      if (!isPlaying) {
                        setCurrentLetterIndex(index);
                        pronounceLetter(letter);
                      }
                    }}
                    disabled={isPlaying}
                    className={`aspect-square flex items-center justify-center text-xl font-extrabold rounded-xl transition-all border-2 ${
                      index === currentLetterIndex
                        ? 'bg-focus-blue text-white border-transparent scale-110 z-10 shadow-md'
                        : isVowel(letter)
                        ? 'bg-focus-blue/5 border-focus-blue/30 text-focus-blue hover:bg-focus-blue/10 hover:border-focus-blue'
                        : 'bg-success-green/5 border-success-green/30 text-green-700 dark:text-green-500 hover:bg-success-green/10 hover:border-success-green'
                    } ${isPlaying ? 'opacity-80' : ''}`}
                  >
                    {getDisplayLetter(letter)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Quiz Mode */
            <div className="text-center py-8">
              <div className="mb-12">
                <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-6">Hangi harfi duyuyorsun?</h2>
                
                {/* Play Sound Button */}
                <button
                  onClick={() => pronounceLetter(correctAnswer)}
                  disabled={isPlaying}
                  className="flex items-center gap-3 mx-auto px-10 py-5 bg-focus-blue text-white rounded-2xl font-extrabold hover:bg-blue-600 transition-colors border-4 border-transparent hover:border-blue-300 disabled:opacity-50"
                >
                  <Volume2 className="w-8 h-8" />
                  {isPlaying ? 'Dinleniyor...' : 'Tekrar Dinle'}
                </button>
              </div>

              {/* Quiz Options */}
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-10">
                {quizOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => !showFeedback && !isPlaying && handleQuizAnswer(option)}
                    disabled={showFeedback || isPlaying}
                    className={`aspect-square flex items-center justify-center text-6xl font-extrabold rounded-3xl transition-all border-4 ${
                      showFeedback
                        ? option === correctAnswer
                          ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-500'
                          : option === selectedAnswer
                          ? 'bg-encourage-orange/20 border-encourage-orange text-orange-700 dark:text-orange-500'
                          : 'bg-gray-100 dark:bg-dark-border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600'
                        : 'bg-gray-50 dark:bg-dark-border text-text-color dark:text-dark-text border-gray-200 dark:border-gray-600 hover:border-focus-blue hover:bg-white dark:hover:bg-dark-surface'
                    } ${(showFeedback || isPlaying) ? '' : 'hover:scale-105'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className={`inline-block px-8 py-4 rounded-xl text-2xl font-extrabold border-2 ${
                  selectedAnswer === correctAnswer 
                    ? 'bg-success-green/10 border-success-green text-green-700 dark:text-green-400 animate-gentle-bounce' 
                    : 'bg-encourage-orange/10 border-encourage-orange text-orange-700 dark:text-orange-400'
                }`}>
                  {selectedAnswer === correctAnswer ? '✓ Doğru!' : '✗ Tekrar dene!'}
                </div>
              )}
            </div>
          )}

          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
              <div className="text-[10rem] animate-gentle-bounce drop-shadow-2xl">🎉</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}