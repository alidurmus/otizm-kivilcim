'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import KivilcimIcon from '@/components/KivilcimIcon';
import { useElevenLabs } from '@/lib/elevenlabs';

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

export default function LiteracyExercisePage() {
  const router = useRouter();
  const { speak } = useElevenLabs();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userSyllable, setUserSyllable] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const exercise = exercises[currentExercise];
  const progress = currentExercise;
  const total = exercises.length;

  useEffect(() => {
    // Web Speech API desteğini kontrol et
    if (typeof window !== 'undefined') {
      setSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
  }, []);

  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
  };

  const handleDrop = (position: 'first' | 'second') => {
    if (!draggedLetter) return;
    
    const newSyllable = position === 'first' 
      ? draggedLetter + (userSyllable[1] || '')
      : (userSyllable[0] || '') + draggedLetter;
    
    setUserSyllable(newSyllable);
    setDraggedLetter(null);
    
    // Eğer hece tamamlandıysa kontrol et
    if (newSyllable.length === 2) {
      checkAnswer(newSyllable);
    }
  };

  const checkAnswer = async (syllable: string) => {
    const correct = syllable.toLowerCase() === exercise.correctSyllable.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      // Kutlama sesini çal
      await playCelebration();
      
      // Başarı animasyonu göster
      setTimeout(() => {
        if (currentExercise < exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          resetExercise();
        } else {
          // Tüm egzersizler tamamlandı
          handleCompleteExercises();
        }
      }, 3000); // Kutlama sesi için daha uzun süre
    }
  };

  const resetExercise = () => {
    setUserSyllable('');
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleCompleteExercises = () => {
    // Tebrikler sayfasına yönlendir veya modül seçimine geri dön
    router.push('/modules?completed=literacy');
  };

  const handleTryAgain = () => {
    resetExercise();
  };

  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert('Bu tarayıcı ses tanıma özelliğini desteklemiyor.');
      return;
    }

    setIsListening(true);
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setIsListening(false);
      
      // Basit ses tanıma kontrolü
      if (transcript.includes(exercise.correctSyllable)) {
        setIsCorrect(true);
        setShowFeedback(true);
        setTimeout(() => {
          if (currentExercise < exercises.length - 1) {
            setCurrentExercise(currentExercise + 1);
            resetExercise();
          } else {
            handleCompleteExercises();
          }
        }, 2000);
      } else {
        setIsCorrect(false);
        setShowFeedback(true);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Ses tanıma sırasında hata oluştu. Lütfen tekrar deneyin.');
    };

    recognition.start();
  };

  const playAudioFeedback = async () => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      await speak(exercise.audioText, 'word');
    } catch (error) {
      console.error('Ses çalma hatası:', error);
      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(exercise.audioText);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    } finally {
      setIsPlaying(false);
    }
  };

  const playLetterSound = async (letter: string) => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      await speak(letter, 'letter');
    } catch (error) {
      console.error('Harf ses hatası:', error);
    } finally {
      setIsPlaying(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue via-blue-100 to-white">
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
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            
            {/* Task Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-color mb-4">
                Harfleri Birleştirerek Hece Oluştur
              </h2>
              <p className="text-gray-600">
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
                    className="w-16 h-16 bg-encourage-orange rounded-xl flex items-center justify-center text-2xl font-bold text-text-color cursor-move shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative group"
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
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop('first')}
                  className="w-16 h-16 border-4 border-dashed border-focus-blue rounded-xl flex items-center justify-center text-2xl font-bold bg-white shadow-inner"
                >
                  {userSyllable[0] || '?'}
                </div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop('second')}
                  className="w-16 h-16 border-4 border-dashed border-focus-blue rounded-xl flex items-center justify-center text-2xl font-bold bg-white shadow-inner"
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
                  {isPlaying ? '🔊 Oynatılıyor...' : '🔊 Heceyi Dinle'}
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
            <div className={`mt-6 p-6 rounded-xl text-center ${
              isCorrect ? 'bg-success-green bg-opacity-30' : 'bg-encourage-orange bg-opacity-30'
            }`}>
              <div className="text-4xl mb-3">
                {isCorrect ? '🎉' : '🤔'}
              </div>
              <h3 className="text-xl font-bold text-text-color mb-3">
                {isCorrect ? 'Harikasın!' : 'Haydi tekrar deneyelim!'}
              </h3>
              <p className="text-gray-600 mb-4">
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

          {/* Completion Celebration */}
          {currentExercise >= exercises.length && (
            <div className="mt-6 p-8 bg-success-green bg-opacity-30 rounded-xl text-center">
              <KivilcimIcon size={120} animate={true} className="mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-text-color mb-4">
                🏆 Tebrikler!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
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
          )}
        </div>
      </div>
    </div>
  );
} 