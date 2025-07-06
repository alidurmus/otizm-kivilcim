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
  { id: '1', name: 'Mutlu', emoji: '😊', description: 'Neşeli ve keyifli hissetmek', color: 'bg-yellow-100 border-yellow-300' },
  { id: '2', name: 'Üzgün', emoji: '😢', description: 'Kederli ve mutsuz hissetmek', color: 'bg-blue-100 border-blue-300' },
  { id: '3', name: 'Kızgın', emoji: '😠', description: 'Öfkeli ve sinirli hissetmek', color: 'bg-red-100 border-red-300' },
  { id: '4', name: 'Şaşkın', emoji: '😮', description: 'Hayret etmek ve şaşırmak', color: 'bg-purple-100 border-purple-300' },
  { id: '5', name: 'Korkmuş', emoji: '😨', description: 'Endişeli ve korkulu hissetmek', color: 'bg-gray-100 border-gray-300' },
  { id: '6', name: 'Heyecanlı', emoji: '🤩', description: 'Coşkulu ve heyecanlı hissetmek', color: 'bg-green-100 border-green-300' },
];

const socialStories: SocialStory[] = [
  {
    id: '1',
    title: 'Arkadaşla Karşılaşma',
    scenario: 'Okulda arkadaşınla karşılaştın. Ne yapmalısın?',
    options: ['Merhaba demek', 'Hiçbir şey yapmamak', 'Kaçmak'],
    correctAnswer: 0,
    explanation: 'Arkadaşlarımızla karşılaştığımızda merhaba demek kibarlıktır.'
  },
  {
    id: '2',
    title: 'Oyuncak Paylaşma',
    scenario: 'Arkadaşın senin oyuncağınla oynamak istiyor. Ne yaparsın?',
    options: ['Oyuncağı saklarsın', 'Paylaşırsın', 'Ağlarsın'],
    correctAnswer: 1,
    explanation: 'Paylaşmak arkadaşlığın güzel yanlarından biridir.'
  },
  {
    id: '3',
    title: 'Yardım İsteme',
    scenario: 'Bir şeyi yapamıyorsun ve yardıma ihtiyacın var. Ne yaparsın?',
    options: ['Pes edersen', 'Yardım istersin', 'Ağlarsın'],
    correctAnswer: 1,
    explanation: 'Yardım istemek normal ve doğru bir davranıştır.'
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
  
  const router = useRouter();
  const { speak } = useElevenLabs();

  const activities = [
    {
      id: 'emotion-recognition' as ActivityType,
      title: '😊 Duygu Tanıma',
      description: 'Farklı duyguları tanı ve anla',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      id: 'social-stories' as ActivityType,
      title: '📚 Sosyal Öyküler',
      description: 'Sosyal durumları öğren ve doğru davranışları keşfet',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'daily-activities' as ActivityType,
      title: '🌟 Günlük Aktiviteler',
      description: 'Günlük rutinleri ve aktiviteleri öğren',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'communication-skills' as ActivityType,
      title: '💬 İletişim Becerileri',
      description: 'Temel iletişim ifadelerini öğren',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const handleBackToMenu = () => {
    setCurrentActivity('menu');
    setSelectedEmotion(null);
    setCurrentStoryIndex(0);
    setStoryScore(0);
    setSelectedActivity(null);
    setSelectedActivityStep(0);
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
    // Duygu adı ve açıklamasını seslendır
    const emotionDescription = `${emotion.name}: ${emotion.description}`;
    await speak(emotionDescription, 'sentence');
  };

  const handleStoryAnswer = async (answerIndex: number) => {
    const story = socialStories[currentStoryIndex];
    const isCorrect = answerIndex === story.correctAnswer;
    
    if (isCorrect) {
      setStoryScore(prev => prev + 1);
      await speak("Doğru!", 'celebration');
    } else {
      await speak("Yanlış!", 'sentence');
    }
    
    setTimeout(() => {
      setCurrentStoryIndex(prev => prev + 1);
    }, 2000);
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

  const handleCommunicationClick = async (_skill: CommunicationSkill) => {
    await speak("İletişim becerisi!", 'sentence');
  };

  // Emotion Recognition Activity
  if (currentActivity === 'emotion-recognition') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">😊 Duygu Tanıma</h1>
            <p className="text-lg text-gray-600">Duyguları tanı ve anla</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionClick(emotion)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${emotion.color} ${
                  selectedEmotion === emotion.id ? 'scale-105 shadow-lg' : 'hover:scale-102'
                }`}
              >
                <div className="text-6xl mb-3">{emotion.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{emotion.name}</h3>
                <p className="text-sm text-gray-600">{emotion.description}</p>
              </button>
            ))}
          </div>

          {selectedEmotion && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Harika Seçim! 🎉</h2>
              <p className="text-gray-600">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Sosyal Öyküler</h1>
            <p className="text-lg text-gray-600">Puan: {storyScore} / {socialStories.length}</p>
          </div>

          {!isCompleted ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentStory.title}</h2>
              <div className="text-6xl text-center mb-6">🤔</div>
              <p className="text-lg text-gray-700 mb-8 text-center">{currentStory.scenario}</p>
              
              <div className="space-y-3">
                {currentStory.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleStoryAnswer(index)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Tebrikler!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Tüm sosyal öyküleri tamamladın! {storyScore} / {socialStories.length} doğru cevap verdin.
              </p>
              <button
                onClick={() => {
                  setCurrentStoryIndex(0);
                  setStoryScore(0);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tekrar Oyna
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🌟 Günlük Aktiviteler</h1>
            <p className="text-lg text-gray-600">Günlük rutinleri öğren</p>
          </div>

          {!selectedActivity ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dailyActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivitySelect(activity)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center"
                >
                  <div className="text-6xl mb-4">{activity.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.activity}</h3>
                  <p className="text-gray-600">{activity.steps.length} adım</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{selectedActivity.emoji}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedActivity.activity}</h2>
                <p className="text-gray-600">Adım {selectedActivityStep + 1} / {selectedActivity.steps.length}</p>
              </div>

              <div className="mb-8">
                <div className="bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${((selectedActivityStep + 1) / selectedActivity.steps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">👆</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedActivity.steps[selectedActivityStep]}
                  </h3>
                </div>
              </div>

              <div className="text-center space-x-4">
                {selectedActivityStep < selectedActivity.steps.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Sonraki Adım
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      setSelectedActivityStep(0);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Başka Aktivite Seç
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedActivity(null);
                    setSelectedActivityStep(0);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">💬 İletişim Becerileri</h1>
            <p className="text-lg text-gray-600">Temel iletişim ifadelerini öğren</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communicationSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleCommunicationClick(skill)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{skill.skill}</h3>
                <div className="text-2xl font-semibold text-purple-600 mb-3">"{skill.phrase}"</div>
                <p className="text-gray-600">📍 {skill.situation}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">💡 İpucu</h2>
            <p className="text-gray-600 text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToModules}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Modüllere Dön
            </button>
            <button
              onClick={() => handleShowHelp('emotion-recognition')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤝 Sosyal İletişim
      </h1>
          <p className="text-lg text-gray-600">
            Sosyal becerilerini geliştir ve iletişim kur!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {activity.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activity.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentActivity(activity.id)}
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition-colors ${activity.color}`}
                  >
                    Aktiviteyi Başlat
                  </button>
                  <button
                    onClick={() => handleShowHelp(activity.id)}
                    className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Aktivite kurallarını görüntüle"
                  >
                    ❓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🌟 Sosyal Becerileri Geliştir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl mb-2">😊</div>
                <h3 className="font-semibold mb-1">Duygular</h3>
                <p>Duyguları tanı ve anla</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold mb-1">Öyküler</h3>
                <p>Sosyal durumları öğren</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="font-semibold mb-1">Rutinler</h3>
                <p>Günlük aktiviteleri keşfet</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold mb-1">İletişim</h3>
                <p>Temel ifadeleri öğren</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
