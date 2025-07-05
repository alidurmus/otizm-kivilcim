'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, RotateCcw, Star, Award, BookOpen } from 'lucide-react';
import { useElevenLabs } from '@/lib/elevenlabs';

// Türk alfabesi harfleri - 29 harf
const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

// Sesli ve sessiz harfler
const VOWELS = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];
const CONSONANTS = TURKISH_ALPHABET.filter(letter => !VOWELS.includes(letter));

interface AlphabetStats {
  totalLetters: number;
  learnedLetters: number;
  currentStreak: number;
  score: number;
}

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
  const [gameStats, setGameStats] = useState<AlphabetStats>({
    totalLetters: TURKISH_ALPHABET.length,
    learnedLetters: 0,
    currentStreak: 0,
    score: 0
  });

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
        console.log('👋 Playing welcome message...');
        await speak("Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.", 'sentence');
      }, 1000);
    };
    
    playWelcome();
    
    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Dependency array boş - sadece mount'ta çal

  // Letter pronunciation with additional safety
  const pronounceLetter = useCallback(async (letter: string) => {
    try {
      // Önceki sesi durdur
      stopCurrentAudio();
      
      console.log(`🔤 Pronouncing letter: ${letter}`);
      await speak(letter.toLowerCase(), 'letter');
    } catch (error) {
      console.error('Letter pronunciation failed:', error);
    }
  }, [speak, stopCurrentAudio]);

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
      console.log(`🎯 Starting new quiz with letter: ${letter}`);
      pronounceLetter(letter);
    }, 800); // 500ms → 800ms artırdım
  }, [generateQuizOptions, pronounceLetter, stopCurrentAudio]);

  // Handle quiz answer
  const handleQuizAnswer = useCallback(async (answer: string) => {
    // 🛑 Önce önceki sesleri durdur  
    stopCurrentAudio();
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === correctAnswer) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setShowCelebration(true);
      
      console.log('✅ Correct answer! Playing celebration...');
      await speak("Doğru! Harika iş çıkardın!", 'celebration');
      
      // Celebration tamamlandıktan sonra yeni quiz başlat
      setTimeout(() => {
        setShowCelebration(false);
        startQuiz(); // Yeni quiz sorusu
      }, 2500); // 2000ms → 2500ms (celebration'ın bitmesi için)
    } else {
      setStreak(0);
      console.log('❌ Wrong answer! Playing feedback...');
      await speak(`Hayır, bu ${answer}. Doğru cevap ${correctAnswer}. Tekrar deneyelim.`, 'sentence');
      
      // Feedback tamamlandıktan sonra tekrar dene
      setTimeout(() => {
        setShowFeedback(false);
        startQuiz(); // Aynı soruyu tekrar sor
      }, 3500); // 3000ms → 3500ms (feedback'in bitmesi için)
    }
  }, [correctAnswer, speak, startQuiz, stopCurrentAudio]);

  // Navigate letters in learn mode
  const navigateToLetter = useCallback(async (direction: 'prev' | 'next') => {
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
      console.log(`🔄 Navigating to letter: ${TURKISH_ALPHABET[newIndex]}`);
      pronounceLetter(TURKISH_ALPHABET[newIndex]);
    }, 200); // 200ms delay ekledim
  }, [currentLetterIndex, pronounceLetter, stopCurrentAudio]);

  // Letter case display helper
  const getDisplayLetter = (letter: string) => {
    switch (letterCase) {
      case 'lower':
        return letter.toLowerCase();
      case 'mixed':
        return Math.random() > 0.5 ? letter : letter.toLowerCase();
      default:
        return letter;
    }
  };

  // Check if letter is vowel
  const isVowel = (letter: string) => VOWELS.includes(letter.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/modules')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Geri dön"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-800">Alfabe Okuma</h1>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">{score}</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">{streak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Game Mode Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setGameMode('learn')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                gameMode === 'learn'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-400'
              }`}
            >
              Öğren
            </button>
            <button
              onClick={startQuiz}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                gameMode === 'quiz'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400'
              }`}
            >
              Quiz
            </button>
          </div>
        </div>

        {/* Letter Case Selection */}
        {gameMode === 'learn' && (
          <div className="mb-6">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setLetterCase('upper')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  letterCase === 'upper'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 border border-green-200 hover:border-green-400'
                }`}
              >
                Büyük Harf
              </button>
              <button
                onClick={() => setLetterCase('lower')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  letterCase === 'lower'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 border border-green-200 hover:border-green-400'
                }`}
              >
                Küçük Harf
              </button>
              <button
                onClick={() => setLetterCase('mixed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  letterCase === 'mixed'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 border border-green-200 hover:border-green-400'
                }`}
              >
                Karışık
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {gameMode === 'learn' ? (
          /* Learn Mode */
          <div className="text-center">
            {/* Current Letter Display */}
            <div className="mb-8">
              <div 
                className={`inline-flex items-center justify-center w-48 h-48 rounded-3xl text-8xl font-bold text-white shadow-2xl mb-6 cursor-pointer transform hover:scale-105 transition-all ${
                  isVowel(currentLetter) 
                    ? 'bg-gradient-to-br from-pink-400 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                }`}
                onClick={() => pronounceLetter(currentLetter)}
              >
                {getDisplayLetter(currentLetter)}
              </div>
              
              {/* Letter Info */}
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-gray-800">
                  {isVowel(currentLetter) ? 'Sesli Harf' : 'Sessiz Harf'}
                </p>
                <p className="text-lg text-gray-600">
                  {currentLetterIndex + 1}. harf ({currentLetterIndex + 1}/{TURKISH_ALPHABET.length})
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => navigateToLetter('prev')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
              >
                ← Önceki
              </button>
              
              <button
                onClick={() => pronounceLetter(currentLetter)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                Dinle
              </button>
              
              <button
                onClick={() => navigateToLetter('next')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
              >
                Sonraki →
              </button>
            </div>

            {/* Alphabet Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-4xl mx-auto">
              {TURKISH_ALPHABET.map((letter, index) => (
                <button
                  key={letter}
                  onClick={() => {
                    setCurrentLetterIndex(index);
                    pronounceLetter(letter);
                  }}
                  className={`aspect-square flex items-center justify-center text-lg font-bold rounded-lg transition-all ${
                    index === currentLetterIndex
                      ? 'bg-purple-600 text-white shadow-lg scale-110'
                      : isVowel(letter)
                      ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {getDisplayLetter(letter)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Quiz Mode */
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hangi harfi duyuyorsun?</h2>
              
              {/* Play Sound Button */}
              <button
                onClick={() => pronounceLetter(correctAnswer)}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Volume2 className="w-6 h-6" />
                Tekrar Dinle
              </button>
            </div>

            {/* Quiz Options */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              {quizOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => !showFeedback && handleQuizAnswer(option)}
                  disabled={showFeedback}
                  className={`aspect-square flex items-center justify-center text-4xl font-bold rounded-2xl transition-all ${
                    showFeedback
                      ? option === correctAnswer
                        ? 'bg-green-500 text-white shadow-lg'
                        : option === selectedAnswer
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                      : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`text-lg font-medium ${
                selectedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedAnswer === correctAnswer ? '✓ Doğru!' : '✗ Tekrar dene!'}
              </div>
            )}
          </div>
        )}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
} 