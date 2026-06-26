'use client';

import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import KivilcimIcon from '@/components/KivilcimIcon';
import ThemeToggle from '@/components/ThemeToggle';
import { useElevenLabs } from '@/lib/elevenlabs';

// Speech Recognition types
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionClass {
  new(): SpeechRecognition;
}

interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  start: () => void;
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionClass;
    SpeechRecognition?: SpeechRecognitionClass;
    mozSpeechRecognition?: SpeechRecognitionClass;
    msSpeechRecognition?: SpeechRecognitionClass;
  }
}

// --- DATA (Veri yapısı aynı kalıyor) ---
interface SyllableExercise {
  id: number;
  letters: string[];
  correctSyllable: string;
  audioText: string;
}

const exercises: SyllableExercise[] = [
  { id: 1, letters: ['e', 'l'], correctSyllable: 'el', audioText: 'el' },
  { id: 2, letters: ['a', 'l'], correctSyllable: 'al', audioText: 'al' },
  { id: 3, letters: ['o', 'l'], correctSyllable: 'ol', audioText: 'ol' },
  { id: 4, letters: ['u', 'l'], correctSyllable: 'ul', audioText: 'ul' },
  { id: 5, letters: ['i', 'l'], correctSyllable: 'il', audioText: 'il' }
];

// --- useReducer ile State Yönetimi ---

// 1. Bileşenin state'inin şekli
type ExerciseState = {
  currentExerciseIndex: number;
  userSyllable: string;
  isCorrect: boolean | null;
  showFeedback: boolean;
  draggedLetter: string | null;
  isListening: boolean; // Ses tanıma için
  isPlaying: boolean;   // Ses çalma için
  isComplete: boolean;  // Tüm egzersizler bitti mi?
  autoProgressEnabled: boolean; // Otomatik ilerlemek istiyor mu?
  showProceedButton: boolean; // İlerle butonu göster mi?
};

// 2. State'i değiştirebilecek tüm olası eylemler
type Action =
  | { type: 'DRAG_START'; payload: string }
  | { type: 'DROP_LETTER'; payload: { position: 'first' | 'second'; letter: string } }
  | { type: 'SET_USER_SYLLABLE'; payload: string } // Sesli girdi için
  | { type: 'EVALUATE_ANSWER'; payload: { isCorrect: boolean } }
  | { type: 'TRY_AGAIN' }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'COMPLETE_ALL_EXERCISES' }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_IS_LISTENING'; payload: boolean }
  | { type: 'TOGGLE_AUTO_PROGRESS' }
  | { type: 'SHOW_PROCEED_BUTTON'; payload: boolean };

// 3. Bileşen yüklendiğindeki başlangıç state'i
const initialState: ExerciseState = {
  currentExerciseIndex: 0,
  userSyllable: '',
  isCorrect: null,
  showFeedback: false,
  draggedLetter: null,
  isListening: false,
  isPlaying: false,
  isComplete: false,
  autoProgressEnabled: true,
  showProceedButton: false,
};

// 4. Reducer fonksiyonu: mevcut state'i ve bir eylemi alır, yeni state'i döndürür.
function exerciseReducer(state: ExerciseState, action: Action): ExerciseState {
  switch (action.type) {
    case 'DRAG_START':
      return { ...state, draggedLetter: action.payload };
    
    case 'DROP_LETTER': {
      const { position, letter } = action.payload;
      const newSyllable = position === 'first'
        ? letter + (state.userSyllable[1] || '')
        : (state.userSyllable[0] || '') + letter;
      console.log('🔧 DEBUG: DROP_LETTER reducer - Position:', position, 'Letter:', letter, 'New syllable:', newSyllable, 'Old syllable:', state.userSyllable);
      return { ...state, userSyllable: newSyllable, draggedLetter: null };
    }

    case 'SET_USER_SYLLABLE':
      return { ...state, userSyllable: action.payload };

    case 'EVALUATE_ANSWER':
      return { 
        ...state, 
        isCorrect: action.payload.isCorrect, 
        showFeedback: true,
        showProceedButton: action.payload.isCorrect && !state.autoProgressEnabled
      };

    case 'TRY_AGAIN':
      return {
        ...state,
        userSyllable: '',
        isCorrect: null,
        showFeedback: false,
        showProceedButton: false,
      };

    case 'NEXT_EXERCISE':
      // Sonraki tura geçerken state'i sıfırla, ama index'i artır
      return {
        ...initialState,
        currentExerciseIndex: state.currentExerciseIndex + 1,
        autoProgressEnabled: state.autoProgressEnabled,
      };

    case 'COMPLETE_ALL_EXERCISES':
      return { ...state, isComplete: true };

    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_IS_LISTENING':
      return { ...state, isListening: action.payload };

    case 'TOGGLE_AUTO_PROGRESS':
      return { ...state, autoProgressEnabled: !state.autoProgressEnabled };

    case 'SHOW_PROCEED_BUTTON':
      return { ...state, showProceedButton: action.payload };

    default:
      return state;
  }
}

export default function LiteracyExercisePage() {
  const router = useRouter();
  const { speak } = useElevenLabs();
  const [state, dispatch] = useReducer(exerciseReducer, initialState);
  const [speechSupported, setSpeechSupported] = useState(true);

  const {
    currentExerciseIndex,
    userSyllable,
    isCorrect,
    showFeedback,
    isListening,
    isPlaying,
    isComplete,
    autoProgressEnabled,
    showProceedButton,
  } = state;

  // Click-to-place interaction state
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Debug: Track selectedLetter state changes
  useEffect(() => {
    console.log('🔧 DEBUG: selectedLetter changed to:', selectedLetter);
  }, [selectedLetter]);

  // Debug: Track userSyllable state changes  
  useEffect(() => {
    console.log('🔧 DEBUG: userSyllable changed to:', userSyllable);
  }, [userSyllable]);

  const exercise = exercises[currentExerciseIndex];
  const { progress, total } = useMemo(() => ({
    progress: currentExerciseIndex + 1,
    total: exercises.length
  }), [currentExerciseIndex]);

  // Initialize speech recognition support
  useEffect(() => {
    // Always try to enable speech support in modern browsers
    if (typeof window !== 'undefined') {
      const hasSpeech = !!(
        window.SpeechRecognition || 
        window.webkitSpeechRecognition || 
        window.mozSpeechRecognition || 
        window.msSpeechRecognition
      );
      setSpeechSupported(hasSpeech);
    }
  }, []);

  const checkAnswer = useCallback(async (syllable: string) => {
    console.log('🔧 DEBUG: checkAnswer called - User syllable:', syllable, 'Correct syllable:', exercise.correctSyllable);
    const correct = syllable.toLowerCase() === exercise.correctSyllable.toLowerCase();
    console.log('🔧 DEBUG: Answer is', correct ? 'CORRECT' : 'INCORRECT');
    dispatch({ type: 'EVALUATE_ANSWER', payload: { isCorrect: correct } });
    
    if (correct) {
      await playCelebration();
      
      if (autoProgressEnabled) {
        setTimeout(() => {
          if (currentExerciseIndex < exercises.length - 1) {
            dispatch({ type: 'NEXT_EXERCISE' });
          } else {
            dispatch({ type: 'COMPLETE_ALL_EXERCISES' });
          }
        }, 1500); // Kutlama için bekle
      }
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.correctSyllable, currentExerciseIndex, exercises.length, autoProgressEnabled]);

  // Hece tamamlandığında cevabı otomatik kontrol eden effect
  useEffect(() => {
    if (userSyllable.length === 2) {
      console.log('🔧 DEBUG: Complete syllable detected, checking answer:', userSyllable);
      checkAnswer(userSyllable);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userSyllable, currentExerciseIndex]); // Yeni egzersizde tekrar tetiklenmesi için index'e de bağlı

  const handleLetterClick = (letter: string) => {
    if (isListening) return;
    console.log('🔧 DEBUG: Letter clicked:', letter, 'Current selection:', selectedLetter);
    if (selectedLetter === letter) {
      console.log('🔧 DEBUG: Deselecting letter:', letter);
      setSelectedLetter(null); // Deselect if clicking the same letter
    } else {
      console.log('🔧 DEBUG: Selecting letter:', letter);
      setSelectedLetter(letter);
      playLetterSound(letter); // Play sound when selecting
    }
    
    // Force immediate visual update for test compatibility
    setTimeout(() => {
      console.log('🔧 DEBUG: selectedLetter after timeout:', selectedLetter);
    }, 0);
  };

  const handleDropZoneClick = (position: 'first' | 'second') => {
    if (isListening) return;
    console.log('🔧 DEBUG: Zone clicked:', position, 'Selected letter:', selectedLetter);
    if (selectedLetter) {
      console.log('🔧 DEBUG: Placing letter:', selectedLetter, 'in position:', position);
      dispatch({ 
        type: 'DROP_LETTER', 
        payload: { position, letter: selectedLetter } 
      });
      setSelectedLetter(null); // Clear selection after placement
      console.log('🔧 DEBUG: Letter placed, selection cleared');
    } else {
      console.log('🔧 DEBUG: No letter selected, zone click ignored');
    }
  };

  const handleTryAgain = () => {
    dispatch({ type: 'TRY_AGAIN' });
    setSelectedLetter(null); // Clear selection when trying again
  };

  const handleProceed = () => {
    setSelectedLetter(null); // Clear selection when proceeding
    if (currentExerciseIndex < exercises.length - 1) {
      dispatch({ type: 'NEXT_EXERCISE' });
    } else {
      dispatch({ type: 'COMPLETE_ALL_EXERCISES' });
    }
  };

  const toggleAutoProgress = () => {
    dispatch({ type: 'TOGGLE_AUTO_PROGRESS' });
  };

  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert('Bu tarayıcı ses tanıma özelliğini desteklemiyor.');
      return;
    }

    dispatch({ type: 'SET_IS_LISTENING', payload: true });
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Bu tarayıcı ses tanıma özelliğini desteklemiyor.');
      dispatch({ type: 'SET_IS_LISTENING', payload: false });
      return;
    }
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      dispatch({ type: 'SET_IS_LISTENING', payload: false });
      
      if (transcript.includes(exercise.correctSyllable)) {
        // Heceyi ayarlayarak görsel güncellemeyi ve checkAnswer effect'ini tetikle
        dispatch({ type: 'SET_USER_SYLLABLE', payload: exercise.correctSyllable });
      } else {
        // Doğrudan başarısızlık geri bildirimini tetikle
        dispatch({ type: 'EVALUATE_ANSWER', payload: { isCorrect: false } });
      }
    };

    recognition.onerror = () => {
      dispatch({ type: 'SET_IS_LISTENING', payload: false });
      alert('Ses tanıma sırasında hata oluştu. Lütfen tekrar deneyin.');
    };

    recognition.start();
  };

  // --- Ses Fonksiyonları ---
  const playAudioFeedback = async () => {
    if (isPlaying || isListening) return;
    try {
      dispatch({ type: 'SET_IS_PLAYING', payload: true });
      await speak(exercise.audioText, 'word');
    } catch (_audioError) {
      // Audio playback failed, continuing silently
    } finally {
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
    }
  };

  const playLetterSound = async (letter: string) => {
    if (isPlaying || isListening) return;
    try {
      dispatch({ type: 'SET_IS_PLAYING', payload: true });
      await speak(letter, 'letter');
    } catch (_audioError) {
      // Letter audio failed, continuing silently
    } finally {
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
    }
  };

  const playCelebration = useCallback(async () => {
    try {
      // Mevcut kutlama ses dosyalarından birini seç
      const celebrationFiles = [
        'harikasin-cok-guzel.mp3',
        'bravo.mp3',
        'mukemmel.mp3',
        'cok-basarilisin.mp3',
        'supersin.mp3',
        'tebrikler.mp3',
        'aferin-sana.mp3',
        'cok-guzel-yaptin.mp3'
      ];
      
      const randomFile = celebrationFiles[Math.floor(Math.random() * celebrationFiles.length)];
      const audio = new Audio(`/audio/celebrations/${randomFile}`);
      
      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = () => {
          // Fallback to ElevenLabs if static file fails
          speak('Harikasın! Çok güzel!', 'celebration').then(resolve).catch(reject);
        };
        audio.play().catch(() => {
          // Fallback to ElevenLabs if play fails
          speak('Harikasın! Çok güzel!', 'celebration').then(resolve).catch(reject);
        });
      });
    } catch (_audioError) {
      // Final fallback - continue silently
    }
  }, [speak]);

  // --- RENDER --- 

  // Tüm egzersizler tamamlandığında gösterilecek ekran
  if (isComplete) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg flex items-center justify-center p-4 transition-colors duration-500">
        <div className="text-center bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-12 max-w-md w-full">
          <KivilcimIcon size={120} animate={true} className="mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold text-success-green mb-4">
            🏆 Tebrikler!
          </h2>
          <p className="text-xl font-bold text-text-color dark:text-dark-text-secondary mb-8">
            Tüm hece oluşturma egzersizlerini tamamladın! Harika bir iş çıkardın.
          </p>
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={() => router.push('/modules')}
          >
            Modüllere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg transition-colors duration-500 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => router.push('/modules')}
          >
            ← Modüllere Dön
          </Button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-focus-blue hidden sm:block">Hece Oluşturma</h1>
            <KivilcimIcon size={60} animate={showFeedback && isCorrect === true} />
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6 mb-8">
          <ProgressBar 
            current={progress} 
            total={total} 
            label="İlerlemen"
          />
        </div>

        {/* Main Exercise Area */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10 text-center">
            
          {/* Task Instructions */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-4">
              Harfleri Birleştirerek Hece Oluştur
            </h2>
            <p className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary">
              Aşağıdaki harflere tıklayarak seç, sonra doğru pozisyona yerleştir
            </p>
          </div>

          {/* Exercise Content */}
          <div className="space-y-12">
            {/* Clickable Letters */}
            <div className="flex justify-center space-x-6">
              {exercise.letters.map((letter, index) => (
                <button
                  key={index}
                  data-testid={`letter-${letter}`}
                  data-letter={letter}
                  onClick={() => handleLetterClick(letter)}
                  disabled={isListening}
                  className={[
                    'w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-extrabold border-4',
                    'transition-all duration-300 relative group',
                    (isListening) ? 'opacity-80 cursor-default' : 'cursor-pointer hover:scale-[1.05]',
                    selectedLetter === letter 
                      ? 'bg-success-green/20 border-success-green text-green-700 dark:text-green-400 scale-[1.05]' 
                      : 'bg-focus-blue/10 border-focus-blue text-focus-blue hover:bg-focus-blue/20'
                  ].join(' ')}
                  title={`${letter} harfini seç`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Click Zones */}
            <div className="flex justify-center space-x-6">
              <button
                data-testid="drop-zone-1"
                onClick={() => handleDropZoneClick('first')}
                disabled={isListening}
                className={`w-28 h-28 border-4 border-dashed rounded-3xl flex items-center justify-center text-6xl font-extrabold transition-all duration-200
                  ${(isListening) ? 'opacity-80 cursor-default' : 'cursor-pointer'}
                  ${selectedLetter && !(isListening) 
                    ? 'border-focus-blue bg-focus-blue/5 hover:bg-focus-blue/10 hover:border-solid hover:scale-[1.05]' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-border text-text-color dark:text-dark-text'}
                `}
                title={selectedLetter ? `${selectedLetter} harfini buraya yerleştir` : 'Önce bir harf seç'}
              >
                {userSyllable[0] || '?'}
              </button>
              <button
                data-testid="drop-zone-2"
                onClick={() => handleDropZoneClick('second')}
                disabled={isListening}
                className={`w-28 h-28 border-4 border-dashed rounded-3xl flex items-center justify-center text-6xl font-extrabold transition-all duration-200
                  ${(isListening) ? 'opacity-80 cursor-default' : 'cursor-pointer'}
                  ${selectedLetter && !(isListening)
                    ? 'border-focus-blue bg-focus-blue/5 hover:bg-focus-blue/10 hover:border-solid hover:scale-[1.05]' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-border text-text-color dark:text-dark-text'}
                `}
                title={selectedLetter ? `${selectedLetter} harfini buraya yerleştir` : 'Önce bir harf seç'}
              >
                {userSyllable[1] || '?'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                size="large"
                onClick={playAudioFeedback}
                disabled={isPlaying || isListening}
              >
                {isPlaying ? '🔊 Oynatılıyor...' : '🔊 Dinle'}
              </Button>
              
              {speechSupported && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleVoiceInput}
                  disabled={isListening || isPlaying}
                >
                  {isListening ? '🎙️ Dinleniyor...' : '🎙️ Söyle'}
                </Button>
              )}
            </div>

            {/* AI Voice Info */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100 dark:border-dark-border text-center">
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary flex items-center justify-center gap-2">
                💡 İpucu: Harflere tıklayarak seslerini dinleyebilirsin
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div 
            data-testid={isCorrect ? "success-message" : "error-message"}
            className={`mt-6 p-8 rounded-3xl text-center border-4 ${
              isCorrect 
                ? 'bg-success-green/10 border-success-green' 
                : 'bg-encourage-orange/10 border-encourage-orange'
            }`}
          >
            <div className={`text-6xl mb-4 ${isCorrect ? 'animate-gentle-bounce' : ''}`}>
              {isCorrect ? '🎉' : '💡'}
            </div>
            <h3 className={`text-3xl font-extrabold mb-4 ${
              isCorrect ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'
            }`}>
              {isCorrect ? 'Harikasın!' : 'Haydi birlikte tekrar düşünelim.'}
            </h3>
            <p className="text-xl font-bold text-text-color dark:text-dark-text mb-6">
              {isCorrect 
                ? `Doğru! Bu hece "${exercise.correctSyllable}" oluyor.`
                : `Doğru hece "${exercise.correctSyllable}" olmalı. Tekrar deneyebilirsin!`
              }
            </p>
            
            <div className="flex justify-center gap-4">
              {!isCorrect && (
                <Button
                  variant="secondary"
                  size="large"
                  onClick={handleTryAgain}
                  disabled={isListening}
                >
                  🔄 Tekrar Dene
                </Button>
              )}
              
              {showProceedButton && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleProceed}
                  data-testid="proceed-button"
                  disabled={isListening}
                >
                  {currentExerciseIndex < exercises.length - 1 ? 'Sonraki →' : 'Tamamla! 🏆'}
                </Button>
              )}
            </div>
            
            {isCorrect && !autoProgressEnabled && (
              <p className="text-base font-bold text-gray-500 dark:text-gray-400 mt-4">
                🔵 Manuel kontrol açık - İlerlemek için butona tıklayın
              </p>
            )}
          </div>
        )}

        {/* Settings Panel */}
        <div className="mt-8 p-6 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-2xl text-center">
          <div className="flex justify-center items-center gap-4">
            <label className="flex items-center gap-3 text-lg font-bold text-text-color dark:text-dark-text cursor-pointer group">
              <input
                type="checkbox"
                checked={autoProgressEnabled}
                onChange={toggleAutoProgress}
                className="w-6 h-6 text-focus-blue bg-gray-100 border-gray-300 rounded-md focus:ring-focus-blue focus:ring-2 cursor-pointer"
              />
              <span className="group-hover:text-focus-blue transition-colors">Otomatik İlerleme</span>
            </label>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {autoProgressEnabled 
                ? 'Doğru cevapta 3 saniye sonra otomatik geçiş' 
                : 'Manuel olarak "İlerle" butonuna tıklayın'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}