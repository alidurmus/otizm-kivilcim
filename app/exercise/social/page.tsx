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
      { id: 'sad', text: 'Üzgün', emoji: '😢', isCorrect: false, explanation: 'Hayır, üzgün değil.' },
      { id: 'angry', text: 'Kızgın', emoji: '😠', isCorrect: false, explanation: 'Hayır, kızgın değil.' },
      { id: 'scared', text: 'Korkmuş', emoji: '😨', isCorrect: false, explanation: 'Hayır, korkmuş değil.' }
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
      { id: 'greet', text: 'Günaydın derim', emoji: '👋', isCorrect: true, explanation: 'Çok güzel! Selamlaşmak kibarlıktır.' },
      { id: 'ignore', text: 'Görmezden gelirim', emoji: '🙈', isCorrect: false, explanation: 'Bu kibar değil.' },
      { id: 'run', text: 'Koşarak kaçarım', emoji: '🏃', isCorrect: false, explanation: 'Bu uygun bir davranış değil.' },
      { id: 'hide', text: 'Saklanırım', emoji: '🫣', isCorrect: false, explanation: 'Saklanmak çözüm değil.' }
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
      { id: 'thank', text: 'Teşekkür ederim!', emoji: '🙏', isCorrect: true, explanation: 'Mükemmel! Teşekkür etmek çok kibar.' },
      { id: 'grab', text: 'Hemen alırım', emoji: '✊', isCorrect: false, explanation: 'Bu çok acele bir davranış.' },
      { id: 'refuse', text: 'İstemiyorum!', emoji: '❌', isCorrect: false, explanation: 'Bu kaba bir cevap.' },
      { id: 'silent', text: 'Hiçbir şey demem', emoji: '😶', isCorrect: false, explanation: 'Cevap vermemek kibar değil.' }
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
      { id: 'help', text: 'İyi misin? Yardım edeyim.', emoji: '🤝', isCorrect: true, explanation: 'Harika! Empati gösteriyorsun.' },
      { id: 'laugh', text: 'Gülerim', emoji: '😂', isCorrect: false, explanation: 'Bu çok kaba olur.' },
      { id: 'walk', text: 'Yürüyüp giderim', emoji: '🚶', isCorrect: false, explanation: 'Yardıma ihtiyacı var.' },
      { id: 'watch', text: 'Sadece izlerim', emoji: '👀', isCorrect: false, explanation: 'Aktif yardım etmek daha iyi.' }
    ],
    generalExplanation: 'Birisi üzgün olduğunda yardım etmeye çalışırız.'
  }
];

export default function SocialPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { playTextToSpeech, isLoading } = useElevenLabs();

  const exercise = socialExercises[currentExercise];

  useEffect(() => {
    // Read scenario and question when exercise loads
    if (exercise) {
      const textToRead = exercise.scenario 
        ? `${exercise.scenario} ${exercise.question}` 
        : exercise.question;
      playTextToSpeech(textToRead, 'sentence');
    }
  }, [currentExercise, exercise, playTextToSpeech]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    const selectedOption = exercise.options.find(opt => opt.id === answerId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playTextToSpeech('Mükemmel! ' + selectedOption.explanation, 'celebration');
      setShowCelebration(true);
      
      setTimeout(() => {
        handleNext();
      }, 4000);
    } else {
      playTextToSpeech(selectedOption?.explanation + ' Tekrar deneyelim!', 'sentence');
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 3000);
    }
  };

  const handleNext = () => {
    if (currentExercise < socialExercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowCelebration(false);
      setAttempts(0);
    } else {
      // Exercise completed
      playTextToSpeech(`Harika! Tüm sosyal beceri egzersizlerini tamamladın! ${score} doğru cevap verdin!`, 'celebration');
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowCelebration(false);
      setAttempts(0);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowCelebration(false);
    setAttempts(0);
    
    const textToRead = exercise.scenario 
      ? `${exercise.scenario} ${exercise.question}` 
      : exercise.question;
    playTextToSpeech(textToRead, 'sentence');
  };

  const repeatQuestion = () => {
    const textToRead = exercise.scenario 
      ? `${exercise.scenario} ${exercise.question}` 
      : exercise.question;
    playTextToSpeech(textToRead, 'sentence');
  };

  if (currentExercise >= socialExercises.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Süpersin!</h2>
          <p className="text-gray-700 mb-4">
            Tüm sosyal beceri egzersizlerini tamamladınız!
          </p>
          <p className="text-lg font-semibold text-blue-600 mb-6">
            Skorunuz: {score}/{socialExercises.length}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Artık sosyal durumlarda daha iyi davranabilirsiniz!
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="primary"
            size="large"
          >
            🏠 Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-800">
              🤝 Sosyal Beceriler
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {currentExercise + 1} / {socialExercises.length}
              </div>
              <div className="text-sm text-purple-600 font-semibold">
                Skor: {score}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / socialExercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Exercise Area */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          {/* Exercise Type Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {exercise.type === 'emotion-recognition' && '😊 Duygu Tanıma'}
              {exercise.type === 'social-situation' && '👥 Sosyal Durum'}
              {exercise.type === 'appropriate-response' && '💬 Uygun Cevap'}
              {exercise.type === 'empathy' && '❤️ Empati'}
            </div>
          </div>

          {/* Scenario */}
          {exercise.scenario && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Durum:</h3>
              <p className="text-blue-700">{exercise.scenario}</p>
            </div>
          )}

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {exercise.question}
            </h2>
            <Button
              onClick={repeatQuestion}
              variant="secondary"
              size="small"
              disabled={isLoading}
              className="mb-6"
            >
              🔊 Tekrar Dinle
            </Button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {exercise.options.map((option) => (
              <button
                key={option.id}
                onClick={() => !showFeedback && handleAnswerSelect(option.id)}
                disabled={showFeedback}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-200 text-left
                  ${selectedAnswer === option.id
                    ? option.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }
                  ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-102'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{option.emoji}</div>
                  <div>
                    <p className="font-medium text-gray-800">{option.text}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && selectedAnswer && (
            <div className="text-center mt-8">
              {exercise.options.find(opt => opt.id === selectedAnswer)?.isCorrect ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">🎉</div>
                  <p className="text-green-800 font-semibold mb-2">
                    {exercise.options.find(opt => opt.id === selectedAnswer)?.explanation}
                  </p>
                  <p className="text-green-700 text-sm">
                    {exercise.generalExplanation}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="text-3xl mb-3">💭</div>
                  <p className="text-yellow-800 font-medium mb-2">
                    {exercise.options.find(opt => opt.id === selectedAnswer)?.explanation}
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Deneme: {attempts}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="text-8xl animate-bounce">
                🌟
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
            💡 İpucu
          </h3>
          <p className="text-purple-700 text-sm">
            {exercise.type === 'emotion-recognition' && 'Yüz ifadelerine dikkat edin. Gözler, ağız ve kaşlar duyguları gösterir.'}
            {exercise.type === 'social-situation' && 'Sosyal durumlarda kibar ve saygılı olmak önemlidir.'}
            {exercise.type === 'appropriate-response' && 'Cevap vermeden önce düşünün. En kibar seçenek hangisi?'}
            {exercise.type === 'empathy' && 'Başkalarının hislerini anlayın ve yardım etmeye çalışın.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={handleRetry}
            variant="secondary"
            size="medium"
            disabled={showFeedback}
          >
            🔄 Tekrar Dene
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={currentExercise === 0}
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
            disabled={currentExercise === socialExercises.length - 1 && !showCelebration}
          >
            Sonraki →
          </Button>
        </div>
      </div>
    </div>
  );
} 