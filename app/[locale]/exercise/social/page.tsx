'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { useElevenLabs } from '@/lib/elevenlabs';

interface SocialExercise {
  id: string;
  type: 'emotion-recognition' | 'social-situation' | 'appropriate-response' | 'empathy';
  scenario?: string;
  question: string;
  instruction: string;
  image?: string;
  options: Array<{
    id: string;
    text: string;
    emoji: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  generalExplanation: string;
}

const socialExercises: SocialExercise[] = [
  {
    id: 'emotion-happy',
    type: 'emotion-recognition',
    question: 'Bu kişi nasıl hissediyor?',
    instruction: 'Doğru duyguyu seçin',
    options: [
      { id: 'happy', text: 'Mutlu', emoji: '😊', isCorrect: true, explanation: 'Gülümsüyor ve mutlu görünüyor!' },
      { id: 'sad', text: 'Üzgün', emoji: '😢', isCorrect: false, explanation: 'Şu an üzgün görünmüyor.' },
      { id: 'angry', text: 'Kızgın', emoji: '😠', isCorrect: false, explanation: 'Kızgın bir ifadeye benzemiyor.' },
      { id: 'scared', text: 'Korkmuş', emoji: '😨', isCorrect: false, explanation: 'Korkmuş gibi durmuyor.' }
    ],
    generalExplanation: 'Yüz ifadelerinden duyguları anlayabiliriz!'
  },
  {
    id: 'situation-greeting',
    type: 'social-situation',
    scenario: 'Okula geldiğinde öğretmenini gördün.',
    question: 'Ne yapmalısın?',
    instruction: 'En uygun davranışı seçin',
    options: [
      { id: 'greet', text: 'Günaydın derim', emoji: '👋', isCorrect: true, explanation: 'Çok güzel! Selamlaşmak harika bir davranıştır.' },
      { id: 'ignore', text: 'Görmezden gelirim', emoji: '🙈', isCorrect: false, explanation: 'Selam vermek daha güzel bir başlangıç olur.' },
      { id: 'run', text: 'Koşarak kaçarım', emoji: '🏃', isCorrect: false, explanation: 'Burada kalıp iletişim kurmak daha iyi olabilir.' },
      { id: 'hide', text: 'Saklanırım', emoji: '🫣', isCorrect: false, explanation: 'Görünür olmak ve merhaba demek güzeldir.' }
    ],
    generalExplanation: 'İnsanlarla karşılaştığımızda kibarca selamlaşırız.'
  },
  {
    id: 'response-sharing',
    type: 'appropriate-response',
    scenario: 'Arkadaşın oyuncağını paylaşmak istiyor.',
    question: 'Ne cevap verirsin?',
    instruction: 'Kibarca cevap ver',
    options: [
      { id: 'thank', text: 'Teşekkür ederim!', emoji: '🙏', isCorrect: true, explanation: 'Mükemmel! Teşekkür etmek çok güzel.' },
      { id: 'grab', text: 'Hemen alırım', emoji: '✊', isCorrect: false, explanation: 'Biraz acele etmiş olabilir misin?' },
      { id: 'refuse', text: 'İstemiyorum!', emoji: '❌', isCorrect: false, explanation: 'Kibarca reddetmek daha iyi olabilir.' },
      { id: 'silent', text: 'Hiçbir şey demem', emoji: '😶', isCorrect: false, explanation: 'Cevap vermek iletişimi güçlendirir.' }
    ],
    generalExplanation: 'Birisi bize bir şey verdiğinde teşekkür ederiz.'
  },
  {
    id: 'empathy-crying',
    type: 'empathy',
    scenario: 'Arkadaşın düştü ve ağlıyor.',
    question: 'Nasıl yardım edersin?',
    instruction: 'En iyi yardımı seç',
    options: [
      { id: 'help', text: 'İyi misin? Yardım edeyim.', emoji: '🤝', isCorrect: true, explanation: 'Harika! Çok yardımcı oldun.' },
      { id: 'laugh', text: 'Gülerim', emoji: '😂', isCorrect: false, explanation: 'Böyle bir durumda destek olmak daha iyidir.' },
      { id: 'walk', text: 'Yürüyüp giderim', emoji: '🚶', isCorrect: false, explanation: 'Arkadaşının sana ihtiyacı olabilir.' },
      { id: 'watch', text: 'Sadece izlerim', emoji: '👀', isCorrect: false, explanation: 'Aktif olarak yardım etmek daha güzeldir.' }
    ],
    generalExplanation: 'Birisi üzgün olduğunda veya yardıma ihtiyacı olduğunda destek oluruz.'
  }
];

export default function SocialPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const { speak } = useElevenLabs();

  const exercise = socialExercises[currentExercise];

  useEffect(() => {
    // Read scenario and question when exercise loads
    if (exercise) {
      const textToRead = exercise.scenario 
        ? `${exercise.scenario} ${exercise.question}` 
        : exercise.question;
      speak(textToRead, 'sentence');
    }
  }, [currentExercise, exercise, speak]);

  const handleAnswerSelect = async (answerId: string) => {
    if (isAnswering || showFeedback) return;
    
    setIsAnswering(true);
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    const selectedOption = exercise.options.find(opt => opt.id === answerId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      await speak('Mükemmel! ' + (selectedOption?.explanation || ''), 'celebration');
      setShowCelebration(true);
      
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      await speak('Bir daha deneyelim.', 'sentence');
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        setIsAnswering(false);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentExercise < socialExercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowCelebration(false);
      setIsAnswering(false);
      setAttempts(0);
    } else {
      // Exercise completed
      speak(`Harika! Tüm sosyal beceri egzersizlerini tamamladın! ${score} doğru cevap verdin!`, 'celebration');
      setCurrentExercise(socialExercises.length); // complete view
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowCelebration(false);
      setIsAnswering(false);
      setAttempts(0);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowCelebration(false);
    setIsAnswering(false);
    setAttempts(0);
    
    const textToRead = exercise.scenario 
      ? `${exercise.scenario} ${exercise.question}` 
      : exercise.question;
    speak(textToRead, 'sentence');
  };

  const repeatQuestion = () => {
    const textToRead = exercise.scenario 
      ? `${exercise.scenario} ${exercise.question}` 
      : exercise.question;
    speak(textToRead, 'sentence');
  };

  if (currentExercise >= socialExercises.length) {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg flex items-center justify-center p-4 transition-colors duration-500">
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🤝</div>
          <h2 className="text-3xl font-extrabold text-success-green mb-4">Süpersin!</h2>
          <p className="text-text-color dark:text-dark-text-secondary font-bold mb-6 text-lg">
            Tüm sosyal beceri egzersizlerini başarıyla tamamladın!
          </p>
          <div className="bg-focus-blue/10 dark:bg-focus-blue/20 rounded-2xl p-6 mb-8 border-2 border-focus-blue">
            <p className="text-xl font-extrabold text-focus-blue mb-2">
              Skorunuz:
            </p>
            <p className="text-4xl font-extrabold text-focus-blue">
              {score}/{socialExercises.length}
            </p>
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="primary"
            size="large"
            className="w-full"
          >
            🏠 Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold text-focus-blue">
              🤝 Sosyal Beceriler
            </h1>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-dark-border px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-gray-700">
              <div className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">
                <span className="text-focus-blue">{currentExercise + 1}</span> / {socialExercises.length}
              </div>
              <div className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                Skor: <span className="text-success-green">{score}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-3 overflow-hidden">
            <div 
              className="bg-focus-blue h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentExercise) / socialExercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Exercise Area */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 mb-6">
          {/* Exercise Type Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold bg-focus-blue/10 border border-focus-blue text-focus-blue">
              {exercise.type === 'emotion-recognition' && '😊 Duygu Tanıma'}
              {exercise.type === 'social-situation' && '👥 Sosyal Durum'}
              {exercise.type === 'appropriate-response' && '💬 Uygun Cevap'}
              {exercise.type === 'empathy' && '💙 Empati'}
            </div>
          </div>

          {/* Scenario */}
          {exercise.scenario && (
            <div className="bg-focus-blue/10 border-2 border-focus-blue/20 dark:border-focus-blue/40 rounded-2xl p-6 mb-8 text-center">
              <h3 className="text-xl font-bold text-focus-blue mb-3">Durum:</h3>
              <p className="text-lg font-bold text-text-color dark:text-dark-text">{exercise.scenario}</p>
            </div>
          )}

          {/* Question */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-6">
              {exercise.question}
            </h2>
            <Button
              onClick={repeatQuestion}
              variant="secondary"
              size="small"
              disabled={false}
              className="mb-2"
            >
              🔊 Soruyu Dinle
            </Button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {exercise.options.map((option) => (
              <button
                key={option.id}
                onClick={() => !showFeedback && handleAnswerSelect(option.id)}
                disabled={showFeedback || isAnswering}
                className={`
                  p-6 rounded-2xl border-4 transition-all duration-200 text-left
                  ${selectedAnswer === option.id
                    ? option.isCorrect
                      ? 'border-success-green bg-success-green/20'
                      : 'border-encourage-orange bg-encourage-orange/20'
                    : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:border-focus-blue'
                  }
                  ${(showFeedback || isAnswering) ? 'cursor-default opacity-80' : 'cursor-pointer hover:scale-[1.02]'}
                `}
              >
                <div className="flex items-center gap-6">
                  <div className="text-4xl">{option.emoji}</div>
                  <div>
                    <p className={`font-bold text-xl ${
                      selectedAnswer === option.id 
                        ? option.isCorrect 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-orange-700 dark:text-orange-400'
                        : 'text-text-color dark:text-dark-text'
                    }`}>{option.text}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && selectedAnswer && (
            <div className="text-center mt-10">
              {exercise.options.find(opt => opt.id === selectedAnswer)?.isCorrect ? (
                <div className="bg-success-green/10 border-2 border-success-green rounded-2xl p-6">
                  <div className="text-4xl mb-3 animate-gentle-bounce">🎉</div>
                  <p className="text-green-700 dark:text-green-400 font-extrabold text-xl mb-3">
                    {exercise.options.find(opt => opt.id === selectedAnswer)?.explanation}
                  </p>
                  <p className="text-green-800 dark:text-green-500 font-bold">
                    {exercise.generalExplanation}
                  </p>
                </div>
              ) : (
                <div className="bg-encourage-orange/10 border-2 border-encourage-orange rounded-2xl p-6">
                  <div className="text-4xl mb-3">💡</div>
                  <p className="text-orange-700 dark:text-orange-400 font-extrabold text-xl mb-3">
                    {exercise.options.find(opt => opt.id === selectedAnswer)?.explanation}
                  </p>
                  <p className="text-orange-800 dark:text-orange-500 font-bold">
                    Deneme: {attempts}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-2xl p-6 mb-8 text-center">
          <h3 className="text-xl font-bold text-focus-blue mb-3 flex items-center justify-center gap-2">
            💡 İpucu
          </h3>
          <p className="text-text-color dark:text-dark-text-secondary font-bold">
            {exercise.type === 'emotion-recognition' && 'Yüz ifadelerine dikkat et. Gözler ve ağız nasıl görünüyor?'}
            {exercise.type === 'social-situation' && 'İnsanlarla karşılaştığımızda neler söyleyebileceğimizi hatırla.'}
            {exercise.type === 'appropriate-response' && 'Bize güzel bir şey yapıldığında ne derdik?'}
            {exercise.type === 'empathy' && 'Arkadaşımıza nasıl destek olabileceğimizi düşün.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleRetry}
            variant="secondary"
            size="medium"
            disabled={showFeedback || isAnswering}
          >
            🔄 Tekrar Dene
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={currentExercise === 0 || isAnswering}
          >
            ← Önceki
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
          >
            🏠 Ana Sayfa
          </Button>
          
          <Button
            onClick={handleNext}
            variant="primary"
            disabled={!showCelebration && currentExercise !== socialExercises.length - 1} // Only allow next if correctly answered (or logic handled internally)
          >
            Sonraki →
          </Button>
        </div>
      </div>
    </div>
  );
}
