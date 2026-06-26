'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useElevenLabs } from '@/lib/elevenlabs';
import GameHelpModal from '@/components/GameHelpModal';

type ActivityType = 'menu' | 'emotion-recognition' | 'social-stories' | 'daily-activities' | 'communication-skills';

interface Emotion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

interface SocialStory {
  id: string;
  title: string;
  scenario: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface DailyActivity {
  id: string;
  activity: string;
  steps: string[];
  emoji: string;
}

interface CommunicationSkill {
  id: string;
  skill: string;
  phrase: string;
  situation: string;
}

const emotions: Emotion[] = [
  { id: '1', name: 'Mutlu', emoji: '😊', description: 'Neşeli ve keyifli hissetmek', color: 'bg-success-green/20 border-success-green text-green-800 dark:text-green-300' },
  { id: '2', name: 'Üzgün', emoji: '😢', description: 'Kederli ve mutsuz hissetmek', color: 'bg-neutral-gray/20 border-gray-400 text-gray-700 dark:text-gray-300' },
  { id: '3', name: 'Kızgın', emoji: '😠', description: 'Öfkeli ve sinirli hissetmek', color: 'bg-encourage-orange/20 border-encourage-orange text-orange-800 dark:text-orange-300' },
  { id: '4', name: 'Şaşkın', emoji: '😮', description: 'Hayret etmek ve şaşırmak', color: 'bg-focus-blue/20 border-focus-blue text-blue-800 dark:text-blue-300' },
  { id: '5', name: 'Korkmuş', emoji: '😨', description: 'Endişeli ve korkulu hissetmek', color: 'bg-neutral-gray/30 border-gray-500 text-gray-800 dark:text-gray-300' },
  { id: '6', name: 'Heyecanlı', emoji: '🤩', description: 'Coşkulu ve heyecanlı hissetmek', color: 'bg-success-green/30 border-green-500 text-green-900 dark:text-green-300' },
];

const socialStories: SocialStory[] = [
  {
    id: '1',
    title: 'Arkadaşla Karşılaşma',
    scenario: 'Okulda arkadaşınla karşılaştın. Ne yapmalısın?',
    options: ['Merhaba demek', 'Görmemiş gibi yapmak', 'Başka yöne gitmek'],
    correctAnswer: 0,
    explanation: 'Arkadaşlarımızla karşılaştığımızda merhaba demek çok güzel bir davranıştır.'
  },
  {
    id: '2',
    title: 'Oyuncak Paylaşma',
    scenario: 'Arkadaşın senin oyuncağınla oynamak istiyor. Ne yaparsın?',
    options: ['Oyuncağı saklamak', 'Birlikte oynamayı teklif etmek', 'Hayır diyerek uzaklaşmak'],
    correctAnswer: 1,
    explanation: 'Paylaşmak ve birlikte oynamak arkadaşlığın güzel yanlarından biridir.'
  },
  {
    id: '3',
    title: 'Yardım İsteme',
    scenario: 'Bir şeyi yapamıyorsun ve yardıma ihtiyacın var. Ne yaparsın?',
    options: ['Vazgeçmek', 'Büyüğünden yardım istemek', 'Üzülmek'],
    correctAnswer: 1,
    explanation: 'Yardım istemek çok doğal ve doğru bir davranıştır.'
  }
];

const dailyActivities: DailyActivity[] = [
  {
    id: '1',
    activity: 'Sabah Rutini',
    emoji: '🌅',
    steps: ['Uyanmak', 'Yüzünü yıkamak', 'Dişlerini fırçalamak', 'Kahvaltı yapmak', 'Okula hazırlanmak']
  },
  {
    id: '2',
    activity: 'Arkadaşla Oyun',
    emoji: '🎮',
    steps: ['Arkadaşını davet etmek', 'Oyun seçmek', 'Kuralları konuşmak', 'Beraber oynamak', 'Eğlenmek']
  },
  {
    id: '3',
    activity: 'Market Alışverişi',
    emoji: '🛒',
    steps: ['Liste yapmak', 'Markete gitmek', 'Ürünleri bulmak', 'Kasaya gitmek', 'Ödeme yapmak']
  }
];

const communicationSkills = [
  { id: '1', skill: 'Merhaba Demek', phrase: 'Merhaba! Nasılsın?', situation: 'Birisiyle karşılaştığında' },
  { id: '2', skill: 'Teşekkür Etmek', phrase: 'Teşekkür ederim!', situation: 'Biri sana yardım ettiğinde' },
  { id: '3', skill: 'Özür Dilemek', phrase: 'Özür dilerim!', situation: 'Bir hata yaptığında' },
  { id: '4', skill: 'Yardım İstemek', phrase: 'Bana yardım eder misin?', situation: 'Bir şeye ihtiyacın olduğunda' },
  { id: '5', skill: 'Veda Etmek', phrase: 'Görüşürüz! Hoşça kal!', situation: 'Birinden ayrılırken' }
];

export default function SocialCommunicationModulePage() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('menu');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyScore, setStoryScore] = useState(0);
  const [selectedActivityStep, setSelectedActivityStep] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('emotion-recognition');
  const [isAnswering, setIsAnswering] = useState(false);
  
  const router = useRouter();
  const { speak } = useElevenLabs();

  const activities = [
    {
      id: 'emotion-recognition' as ActivityType,
      title: '😊 Duygu Tanıma',
      description: 'Farklı duyguları tanı ve anla',
      color: 'bg-encourage-orange text-white hover:opacity-90',
    },
    {
      id: 'social-stories' as ActivityType,
      title: '📚 Sosyal Öyküler',
      description: 'Sosyal durumları öğren ve doğru davranışları keşfet',
      color: 'bg-focus-blue text-white hover:opacity-90',
    },
    {
      id: 'daily-activities' as ActivityType,
      title: '🌟 Günlük Aktiviteler',
      description: 'Günlük rutinleri ve aktiviteleri öğren',
      color: 'bg-success-green text-white hover:opacity-90',
    },
    {
      id: 'communication-skills' as ActivityType,
      title: '💬 İletişim Becerileri',
      description: 'Temel iletişim ifadelerini öğren',
      color: 'bg-gray-700 text-white hover:opacity-90',
    },
  ];

  const handleBackToMenu = () => {
    setCurrentActivity('menu');
    setSelectedEmotion(null);
    setCurrentStoryIndex(0);
    setStoryScore(0);
    setSelectedActivity(null);
    setSelectedActivityStep(0);
    setIsAnswering(false);
  };

  const handleBackToModules = () => {
    router.push('/modules');
  };

  const handleShowHelp = (gameType: string) => {
    setHelpGameType(gameType);
    setShowHelpModal(true);
  };

  const handleEmotionClick = async (emotion: Emotion) => {
    setSelectedEmotion(emotion.id);
    const emotionDescription = `${emotion.name}: ${emotion.description}`;
    await speak(emotionDescription, 'sentence');
  };

  const handleStoryAnswer = async (answerIndex: number) => {
    if (isAnswering) return;
    setIsAnswering(true);
    
    const story = socialStories[currentStoryIndex];
    const isCorrect = answerIndex === story.correctAnswer;
    
    if (isCorrect) {
      setStoryScore(prev => prev + 1);
      await speak("Harika! " + story.explanation, 'celebration');
      setTimeout(() => {
        setCurrentStoryIndex(prev => prev + 1);
        setIsAnswering(false);
      }, 1500);
    } else {
      await speak("Bir daha deneyelim.", 'sentence');
      setTimeout(() => {
        setIsAnswering(false);
      }, 500);
    }
  };

  const handleActivitySelect = (activity: DailyActivity) => {
    setSelectedActivity(activity);
    setSelectedActivityStep(0);
  };

  const handleNextStep = async () => {
    if (selectedActivity && selectedActivityStep < selectedActivity.steps.length - 1) {
      setSelectedActivityStep(prev => prev + 1);
      await speak("Sonraki adım!", 'sentence');
    }
  };

  const handleCommunicationClick = async (skill: CommunicationSkill) => {
    await speak(`${skill.skill}: ${skill.phrase}`, 'sentence');
  };

  // Emotion Recognition Activity
  if (currentActivity === 'emotion-recognition') {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 flex justify-between items-center bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-extrabold text-focus-blue mb-2">😊 Duygu Tanıma</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">Duyguları tanı ve anla</p>
            </div>
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionClick(emotion)}
                className={`p-6 rounded-2xl border-4 transition-all duration-300 ${
                  selectedEmotion === emotion.id 
                    ? `${emotion.color} scale-105` 
                    : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border hover:border-focus-blue hover:scale-105'
                }`}
              >
                <div className="text-6xl mb-4">{emotion.emoji}</div>
                <h3 className={`text-2xl font-extrabold mb-2 ${selectedEmotion === emotion.id ? '' : 'text-text-color dark:text-dark-text'}`}>{emotion.name}</h3>
                <p className={`font-bold ${selectedEmotion === emotion.id ? '' : 'text-gray-600 dark:text-dark-text-secondary'}`}>{emotion.description}</p>
              </button>
            ))}
          </div>

          {selectedEmotion && (
            <div className="mt-8 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 text-center">
              <h2 className="text-3xl font-extrabold text-success-green mb-4 animate-gentle-bounce">Harika Seçim! 🎉</h2>
              <p className="text-xl font-bold text-text-color dark:text-dark-text">
                Bu duyguyu başka nerede hissedebileceğini düşün. Farklı duygularımızı tanımak çok önemli!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Social Stories Activity
  if (currentActivity === 'social-stories') {
    const currentStory = socialStories[currentStoryIndex];
    const isCompleted = currentStoryIndex >= socialStories.length;

    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 flex justify-between items-center bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-extrabold text-focus-blue mb-2">📚 Sosyal Öyküler</h1>
              <p className="text-lg font-bold text-success-green">Puan: {storyScore} / {socialStories.length}</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          {!isCompleted ? (
            <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10">
              <h2 className="text-3xl font-extrabold text-focus-blue mb-6 text-center">{currentStory.title}</h2>
              <div className="text-6xl text-center mb-6 animate-calm-pulse">🤔</div>
              <p className="text-2xl font-bold text-text-color dark:text-dark-text mb-10 text-center">{currentStory.scenario}</p>
              
              <div className="space-y-4">
                {currentStory.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleStoryAnswer(index)}
                    disabled={isAnswering}
                    className={`w-full p-6 text-left rounded-2xl border-4 transition-all duration-200 text-xl font-bold
                      ${isAnswering ? 'cursor-default opacity-80' : 'cursor-pointer hover:border-focus-blue hover:scale-[1.02]'}
                      bg-gray-50 dark:bg-dark-border border-gray-200 dark:border-gray-700 text-text-color dark:text-dark-text
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-12 text-center">
              <div className="text-8xl mb-6 animate-gentle-bounce">🎉</div>
              <h2 className="text-4xl font-extrabold text-success-green mb-6">Tebrikler!</h2>
              <p className="text-2xl font-bold text-text-color dark:text-dark-text mb-10">
                Tüm sosyal öyküleri tamamladın! {storyScore} / {socialStories.length} doğru cevap verdin.
              </p>
              <button
                onClick={() => {
                  setCurrentStoryIndex(0);
                  setStoryScore(0);
                }}
                className="px-8 py-4 font-bold text-xl bg-focus-blue text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                🔄 Tekrar Oyna
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Daily Activities Activity
  if (currentActivity === 'daily-activities') {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 flex justify-between items-center bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-extrabold text-focus-blue mb-2">🌟 Günlük Aktiviteler</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">Günlük rutinleri öğren</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          {!selectedActivity ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dailyActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border transition-all duration-300 p-8 text-center hover:border-focus-blue hover:scale-105"
                >
                  <div className="text-7xl mb-6">{activity.emoji}</div>
                  <h3 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-3">{activity.activity}</h3>
                  <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">{activity.steps.length} adım</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10">
              <div className="text-center mb-10">
                <div className="text-8xl mb-6">{selectedActivity.emoji}</div>
                <h2 className="text-4xl font-extrabold text-focus-blue mb-4">{selectedActivity.activity}</h2>
                <p className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary">Adım <span className="text-success-green">{selectedActivityStep + 1}</span> / {selectedActivity.steps.length}</p>
              </div>

              <div className="mb-10">
                <div className="bg-gray-200 dark:bg-dark-border rounded-full h-4 mb-8 overflow-hidden">
                  <div 
                    className="bg-success-green h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((selectedActivityStep + 1) / selectedActivity.steps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center p-8 bg-focus-blue/10 rounded-2xl border-2 border-focus-blue/20">
                  <div className="text-6xl mb-6 animate-calm-pulse">👆</div>
                  <h3 className="text-4xl font-extrabold text-text-color dark:text-dark-text mb-4">
                    {selectedActivity.steps[selectedActivityStep]}
                  </h3>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {selectedActivityStep < selectedActivity.steps.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-4 font-bold text-xl bg-success-green text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    Sonraki Adım →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      setSelectedActivityStep(0);
                    }}
                    className="px-8 py-4 font-bold text-xl bg-focus-blue text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    🔄 Başka Aktivite Seç
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedActivity(null);
                    setSelectedActivityStep(0);
                  }}
                  className="px-8 py-4 font-bold text-xl bg-neutral-gray dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Geri Dön
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Communication Skills Activity
  if (currentActivity === 'communication-skills') {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 flex justify-between items-center bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-extrabold text-focus-blue mb-2">💬 İletişim Becerileri</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">Temel iletişim ifadelerini öğren</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communicationSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleCommunicationClick(skill)}
                className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-gray-200 dark:border-dark-border transition-all duration-300 p-8 text-left hover:border-focus-blue hover:scale-105"
              >
                <h3 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-4">{skill.skill}</h3>
                <div className="text-3xl font-extrabold text-focus-blue mb-4">"{skill.phrase}"</div>
                <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">📍 {skill.situation}</p>
              </button>
            ))}
          </div>

          <div className="mt-10 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-dark-border p-8 text-center">
            <h2 className="text-3xl font-extrabold text-focus-blue mb-4 flex justify-center items-center gap-3">💡 İpucu</h2>
            <p className="text-xl font-bold text-text-color dark:text-dark-text-secondary">
              Her bir beceriyi dinlemek için kartlara tıkla! Bu ifadeleri günlük hayatta kullanarak iletişim becerilerini geliştirebilirsin.
            </p>
          </div>
        </div>

        {/* Help Modal */}
        <GameHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          gameType={helpGameType}
          gameName=""
        />
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 bg-white dark:bg-dark-surface p-6 rounded-3xl border-2 border-gray-200 dark:border-dark-border">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToModules}
              className="inline-flex items-center px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 dark:bg-dark-border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← Modüllere Dön
            </button>
            <button
              onClick={() => handleShowHelp('emotion-recognition')}
              className="inline-flex items-center px-6 py-3 font-bold text-focus-blue bg-focus-blue/10 rounded-xl border border-focus-blue/20 hover:bg-focus-blue/20 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-5xl font-extrabold text-focus-blue mb-4">
            🤝 Sosyal İletişim
          </h1>
          <p className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary">
            Sosyal becerilerini geliştir ve iletişim kur!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border transition-all duration-300 overflow-hidden flex flex-col hover:border-focus-blue"
            >
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-4">
                  {activity.title}
                </h3>
                <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mb-8 flex-1">
                  {activity.description}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentActivity(activity.id)}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-xl transition-colors ${activity.color}`}
                  >
                    Aktiviteyi Başlat
                  </button>
                  <button
                    onClick={() => handleShowHelp(activity.id)}
                    className="px-6 py-4 bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-text-secondary rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xl font-bold"
                    title="Aktivite kurallarını görüntüle"
                  >
                    ❓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-focus-blue mb-8">
              🌟 Sosyal Becerileri Geliştir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-base text-gray-600 dark:text-dark-text-secondary">
              <div className="p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">😊</div>
                <h3 className="font-extrabold text-lg mb-2 text-text-color dark:text-dark-text">Duygular</h3>
                <p className="font-bold">Duyguları tanı ve anla</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-extrabold text-lg mb-2 text-text-color dark:text-dark-text">Öyküler</h3>
                <p className="font-bold">Sosyal durumları öğren</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="font-extrabold text-lg mb-2 text-text-color dark:text-dark-text">Rutinler</h3>
                <p className="font-bold">Günlük aktiviteleri keşfet</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-dark-border rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-extrabold text-lg mb-2 text-text-color dark:text-dark-text">İletişim</h3>
                <p className="font-bold">Temel ifadeleri öğren</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
