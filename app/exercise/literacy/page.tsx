'use client';

import React, { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import KivilcimIcon from '@/components/KivilcimIcon';
import ThemeToggle from '@/components/ThemeToggle';
import { useElevenLabs } from '@/lib/elevenlabs';

// --- DATA (Veri yapısı aynı kalıyor) ---
interface SyllableExercise {
  id: number;
  letters: string[];
  correctSyllable: string;
  audioText: string;
}

const exercises: SyllableExercise[] = [
  { id: 1, letters: ['e', 'l'], correctSyllable: 'el', audioText: 'Bu hece el... el!' },
  { id: 2, letters: ['a', 'l'], correctSyllable: 'al', audioText: 'Bu hece al... al!' },
  { id: 3, letters: ['o', 'l'], correctSyllable: 'ol', audioText: 'Bu hece ol... ol!' },
  { id: 4, letters: ['u', 'l'], correctSyllable: 'ul', audioText: 'Bu hece ul... ul!' },
  { id: 5, letters: ['i', 'l'], correctSyllable: 'il', audioText: 'Bu hece il... il!' }
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
};

// 2. State'i değiştirebilecek tüm olası eylemler
type Action =
  | { type: 'DRAG_START'; payload: string }
  | { type: 'DROP_LETTER'; payload: { position: 'first' | 'second' } }
  | { type: 'SET_USER_SYLLABLE'; payload: string } // Sesli girdi için
  | { type: 'EVALUATE_ANSWER'; payload: { isCorrect: boolean } }
  | { type: 'TRY_AGAIN' }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'COMPLETE_ALL_EXERCISES' }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_IS_LISTENING'; payload: boolean };

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
};

// 4. Reducer fonksiyonu: mevcut state'i ve bir eylemi alır, yeni state'i döndürür.
function exerciseReducer(state: ExerciseState, action: Action): ExerciseState {
  switch (action.type) {
    case 'DRAG_START':
      return { ...state, draggedLetter: action.payload };
    
    case 'DROP_LETTER': {
      if (!state.draggedLetter) return state;
      const newSyllable = action.payload.position === 'first'
        ? state.draggedLetter + (state.userSyllable[1] || '')
        : (state.userSyllable[0] || '') + state.draggedLetter;
      return { ...state, userSyllable: newSyllable, draggedLetter: null };
    }

    case 'SET_USER_SYLLABLE':
      return { ...state, userSyllable: action.payload };

    case 'EVALUATE_ANSWER':
      return { ...state, isCorrect: action.payload.isCorrect, showFeedback: true };

    case 'TRY_AGAIN':
      return {
        ...state,
        userSyllable: '',
        isCorrect: null,
        showFeedback: false,
      };

    case 'NEXT_EXERCISE':
      // Sonraki tura geçerken state'i sıfırla, ama index'i artır
      return {
        ...initialState,
        currentExerciseIndex: state.currentExerciseIndex + 1,
      };

    case 'COMPLETE_ALL_EXERCISES':
      return { ...state, isComplete: true };

    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'SET_IS_LISTENING':
      return { ...state, isListening: action.payload };

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
  } = state;

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
  }, [userSyllable, currentExerciseIndex]); // Yeni egzersizde tekrar tetiklenmesi için index'e de bağlı

  const checkAnswer = async (syllable: string) => {
    const correct = syllable.toLowerCase() === exercise.correctSyllable.toLowerCase();
    dispatch({ type: 'EVALUATE_ANSWER', payload: { isCorrect: correct } });
    
    if (correct) {
      await playCelebration();
      
      setTimeout(() => {
        if (currentExerciseIndex < exercises.length - 1) {
          dispatch({ type: 'NEXT_EXERCISE' });
        } else {
          dispatch({ type: 'COMPLETE_ALL_EXERCISES' });
        }
      }, 3000); // Kutlama için bekle
    }
  };

  const handleDragStart = (letter: string) => {
    dispatch({ type: 'DRAG_START', payload: letter });
  };

  const handleDrop = (position: 'first' | 'second') => {
    dispatch({ type: 'DROP_LETTER', payload: { position } });
  };

  const handleTryAgain = () => {
    dispatch({ type: 'TRY_AGAIN' });
  };

  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert('Bu tarayıcı ses tanıma özelliğini desteklemiyor.');
      return;
    }

    dispatch({ type: 'SET_IS_LISTENING', payload: true });
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
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
    } catch (error) {
      console.error('Ses çalma hatası:', error);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(exercise.audioText);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    } finally {
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
    }
  };

  const playLetterSound = async (letter: string) => {
    if (isPlaying) return;
    try {
      dispatch({ type: 'SET_IS_PLAYING', payload: true });
      await speak(letter, 'letter');
    } catch (error) {
      console.error('Harf ses hatası:', error);
    } finally {
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
    }
  };

  const playCelebration = async () => {
    try {
      const celebrationTexts = [
        'Harikasın! Çok güzel yaptın!',
        'Bravo! Mükemmel bir çalışma!',
        'Süpersin! Devam et böyle!',
        'Çok başarılısın! Harika iş!'
      ];
      const randomText = celebrationTexts[Math.floor(Math.random() * celebrationTexts.length)];
      await speak(randomText, 'celebration');
    } catch (error) {
      console.error('Kutlama ses hatası:', error);
    }
  };

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
                Aşağıdaki harfleri sürükleyerek doğru hece'yi oluştur
              </p>
            </div>

            {/* Exercise Content */}
            <div className="space-y-8">
              {/* Draggable Letters */}
              <div className="flex justify-center space-x-8">
                {exercise.letters.map((letter, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(letter)}
                    onClick={() => playLetterSound(letter)}
                    className="w-16 h-16 bg-encourage-orange rounded-xl flex items-center justify-center text-2xl font-bold text-on-dark cursor-move shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative group"
                    title={`${letter} harfini dinle`}
                  >
                    {letter}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-gray-500 whitespace-nowrap">
                      Dinlemek için tıkla
                    </div>
                  </div>
                ))}
              </div>

              {/* Drop Zones */}
              <div className="flex justify-center space-x-4">
                <div
                  data-testid="drop-zone-1"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop('first')}
                  className="w-16 h-16 border-4 border-dashed border-focus-blue rounded-xl flex items-center justify-center text-2xl font-bold bg-adaptive shadow-inner text-adaptive"
                >
                  {userSyllable[0] || '?'}
                </div>
                <div
                  data-testid="drop-zone-2"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop('second')}
                  className="w-16 h-16 border-4 border-dashed border-focus-blue rounded-xl flex items-center justify-center text-2xl font-bold bg-adaptive shadow-inner text-adaptive"
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
              
              {!isCorrect && (
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleTryAgain}
                >
                  Tekrar Dene
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}