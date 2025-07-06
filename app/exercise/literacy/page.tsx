'use client';

import React, { useState, useEffect, useReducer, useCallback } from 'react';
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
  const [speechSupported, setSpeechSupported] = useState(false);

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

  const exercise = exercises[currentExerciseIndex];
  const progress = currentExerciseIndex;
  const total = exercises.length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
  }, []);

  // Hece tamamlandığında cevabı otomatik kontrol eden effect
  useEffect(() => {
    if (userSyllable.length === 2) {
      checkAnswer(userSyllable);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userSyllable, currentExerciseIndex]); // Yeni egzersizde tekrar tetiklenmesi için index'e de bağlı

  const checkAnswer = useCallback(async (syllable: string) => {
    const correct = syllable.toLowerCase() === exercise.correctSyllable.toLowerCase();
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
        }, 3000); // Kutlama için bekle
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.correctSyllable, currentExerciseIndex, exercises.length, autoProgressEnabled]);

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null); // Deselect if clicking the same letter
    } else {
      setSelectedLetter(letter);
      playLetterSound(letter); // Play sound when selecting
    }
  };

  const handleDropZoneClick = (position: 'first' | 'second') => {
    if (selectedLetter) {
      dispatch({ 
        type: 'DROP_LETTER', 
        payload: { position, letter: selectedLetter } 
      });
      setSelectedLetter(null); // Clear selection after placement
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
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
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
    if (isPlaying) return;
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
    if (isPlaying) return;
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
      <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border flex items-center justify-center p-4">
        <div className="text-center bg-adaptive rounded-2xl shadow-lg p-8">
          <KivilcimIcon size={120} animate={true} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-adaptive mb-4">
            🏆 Tebrikler!
          </h2>
          <p className="text-lg text-adaptive-secondary mb-6">
            Tüm hece oluşturma egzersizlerini tamamladın! Harika bir iş çıkardın.
          </p>
          <Button
            variant="primary"
            size="large"
            onClick={() => router.push('/modules')}
          >
            Modüllere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-border transition-colors duration-500">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" showLabel={false} />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => router.push('/modules')}
          >
            ← Modüllere Dön
          </Button>
          
          <KivilcimIcon size={60} animate={showFeedback && isCorrect === true} />
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <ProgressBar 
            current={progress} 
            total={total} 
            label="Hece Oluşturma İlerlemen"
          />
        </div>

        {/* Main Exercise Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-adaptive rounded-2xl shadow-lg dark:shadow-xl p-8 text-center">
            
            {/* Task Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-adaptive mb-4">
                Harfleri Birleştirerek Hece Oluştur
              </h2>
              <p className="text-adaptive-secondary">
                Aşağıdaki harflere tıklayarak seç, sonra doğru pozisyona yerleştir
              </p>
            </div>

            {/* Exercise Content */}
            <div className="space-y-8">
              {/* Clickable Letters */}
              <div className="flex justify-center space-x-8">
                {exercise.letters.map((letter, index) => (
                  <div
                    key={index}
                    onClick={() => handleLetterClick(letter)}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative group ${
                      selectedLetter === letter 
                        ? 'bg-success-green text-on-dark ring-4 ring-focus-blue' 
                        : 'bg-encourage-orange text-on-dark'
                    }`}
                    title={selectedLetter === letter ? `${letter} seçili - yerleştirmek için alan tıkla` : `${letter} harfini seç`}
                  >
                    {letter}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-gray-500 whitespace-nowrap">
                      {selectedLetter === letter ? 'Seçili' : 'Seçmek için tıkla'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Click Zones */}
              <div className="flex justify-center space-x-4">
                <div
                  data-testid="drop-zone-1"
                  onClick={() => handleDropZoneClick('first')}
                  className={`w-16 h-16 border-4 border-dashed rounded-xl flex items-center justify-center text-2xl font-bold bg-adaptive shadow-inner text-adaptive cursor-pointer hover:bg-opacity-80 transition-all duration-200 ${
                    selectedLetter ? 'border-success-green hover:border-focus-blue' : 'border-focus-blue'
                  }`}
                  title={selectedLetter ? `${selectedLetter} harfini buraya yerleştir` : 'Önce bir harf seç'}
                >
                  {userSyllable[0] || '?'}
                </div>
                <div
                  data-testid="drop-zone-2"
                  onClick={() => handleDropZoneClick('second')}
                  className={`w-16 h-16 border-4 border-dashed rounded-xl flex items-center justify-center text-2xl font-bold bg-adaptive shadow-inner text-adaptive cursor-pointer hover:bg-opacity-80 transition-all duration-200 ${
                    selectedLetter ? 'border-success-green hover:border-focus-blue' : 'border-focus-blue'
                  }`}
                  title={selectedLetter ? `${selectedLetter} harfini buraya yerleştir` : 'Önce bir harf seç'}
                >
                  {userSyllable[1] || '?'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={playAudioFeedback}
                  disabled={isPlaying}
                >
                  {isPlaying ? '🔊 Oynatılıyor...' : '🔊 Dinle'}
                </Button>
                
                {speechSupported && (
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={handleVoiceInput}
                    disabled={isListening || isPlaying}
                  >
                    {isListening ? '🎙️ Dinleniyor...' : '🎙️ Söyle'}
                  </Button>
                )}
              </div>

              {/* AI Voice Info */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  💡 İpucu: Harflere tıklayarak seslerini dinleyebilirsin
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Powered by ElevenLabs AI - Türkçe doğal ses teknolojisi
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div 
              data-testid={isCorrect ? "success-message" : "error-message"}
              className={`mt-6 p-6 rounded-xl text-center ${
                isCorrect ? 'bg-success-green bg-opacity-30' : 'bg-encourage-orange bg-opacity-30'
              }`}
            >
              <div className="text-4xl mb-3">
                {isCorrect ? '🎉' : '🤔'}
              </div>
              <h3 className="text-xl font-bold text-adaptive mb-3">
                {isCorrect ? 'Harikasın!' : 'Haydi tekrar deneyelim!'}
              </h3>
              <p className="text-adaptive-secondary mb-4">
                {isCorrect 
                  ? `Doğru! Bu hece "${exercise.correctSyllable}" oluyor.`
                  : `Doğru hece "${exercise.correctSyllable}" olmalı. Tekrar deneyebilirsin!`
                }
              </p>
              
              <div className="flex justify-center space-x-4">
                {!isCorrect && (
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={handleTryAgain}
                  >
                    Tekrar Dene
                  </Button>
                )}
                
                {showProceedButton && (
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={handleProceed}
                    data-testid="proceed-button"
                  >
                    {currentExerciseIndex < exercises.length - 1 ? 'İlerle →' : 'Tamamla! 🏆'}
                  </Button>
                )}
              </div>
              
              {isCorrect && !autoProgressEnabled && (
                <p className="text-sm text-adaptive-secondary mt-3">
                  🔵 Manuel kontrol açık - İlerlemek için butona tıklayın
                </p>
              )}
            </div>
          )}

          {/* Settings Panel */}
          <div className="mt-6 p-4 bg-adaptive bg-opacity-50 rounded-xl text-center">
            <div className="flex justify-center items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-adaptive">
                <input
                  type="checkbox"
                  checked={autoProgressEnabled}
                  onChange={toggleAutoProgress}
                  className="w-4 h-4 text-focus-blue bg-adaptive border-adaptive-border rounded focus:ring-focus-blue focus:ring-2"
                />
                <span>Otomatik İlerleme</span>
              </label>
              <div className="text-xs text-adaptive-secondary">
                {autoProgressEnabled 
                  ? 'Doğru cevapta 3 saniye sonra otomatik geçiş' 
                  : 'Manuel olarak "İlerle" butonuna tıklayın'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}