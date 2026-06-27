'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useElevenLabs } from '@/lib/elevenlabs';
import GameHelpModal from '@/components/GameHelpModal';

type ActivityType = 'menu' | 'letter-tracing' | 'word-building' | 'sentence-making' | 'story-writing' | 'expression';

interface Letter {
  letter: string;
  paths: string[];
  instructions: string;
}

interface WordTemplate {
  id: string;
  word: string;
  letters: string[];
  image: string;
  hint: string;
}

interface SentenceTemplate {
  id: string;
  words: string[];
  template: string;
  image: string;
  meaning: string;
}

interface StoryPrompt {
  id: string;
  title: string;
  prompt: string;
  keywords: string[];
  emoji: string;
}

interface ExpressionPrompt {
  id: string;
  emotion: string;
  scenario: string;
  examples: string[];
  emoji: string;
}

const letters: Letter[] = [
  {
    letter: 'A',
    paths: ['M 50 20 L 20 80', 'M 50 20 L 80 80', 'M 35 50 L 65 50'],
    instructions: 'Yukarıdan başla, aşağı çiz. Sonra diğer çizgiyi ekle.'
  },
  {
    letter: 'B',
    paths: ['M 20 20 L 20 80', 'M 20 20 L 60 20 Q 70 30 60 40 L 20 40', 'M 20 40 L 60 40 Q 70 50 60 60 L 20 80'],
    instructions: 'Soldan başla, dikey çizgi çiz. Sonra üst ve alt yarım daireler.'
  },
  {
    letter: 'C',
    paths: ['M 70 30 Q 60 20 50 20 Q 30 20 20 40 Q 20 60 30 80 Q 40 80 50 80 Q 60 80 70 70'],
    instructions: 'Sağ üstten başla, yarım daire şeklinde çiz.'
  }
];

const wordTemplates: WordTemplate[] = [
  {
    id: '1',
    word: 'KEDI',
    letters: ['K', 'E', 'D', 'İ'],
    image: '🐱',
    hint: 'Miyavlayan sevimli hayvan'
  },
  {
    id: '2',
    word: 'ELMA',
    letters: ['E', 'L', 'M', 'A'],
    image: '🍎',
    hint: 'Kırmızı lezzetli meyve'
  },
  {
    id: '3',
    word: 'GÜNEŞ',
    letters: ['G', 'Ü', 'N', 'E', 'Ş'],
    image: '☀️',
    hint: 'Gökyüzünde parlayan'
  }
];

const sentenceTemplates: SentenceTemplate[] = [
  {
    id: '1',
    words: ['Ben', 'mutluyum'],
    template: '_ _',
    image: '😊',
    meaning: 'Kendi duygunu ifade et'
  },
  {
    id: '2',
    words: ['Kedi', 'yemek', 'yiyor'],
    template: '_ _ _',
    image: '🐱🍽️',
    meaning: 'Hayvanların ne yaptığını anlat'
  },
  {
    id: '3',
    words: ['Bugün', 'hava', 'güzel'],
    template: '_ _ _',
    image: '🌤️',
    meaning: 'Havayı tarif et'
  }
];

const storyPrompts: StoryPrompt[] = [
  {
    id: '1',
    title: 'Arkadaşım',
    prompt: 'En iyi arkadaşın kimdir? Onunla neler yaparsınız?',
    keywords: ['arkadaş', 'oynamak', 'eğlenmek'],
    emoji: '👫'
  },
  {
    id: '2',
    title: 'Hayallerim',
    prompt: 'Büyüyünce ne olmak istiyorsun? Neden?',
    keywords: ['gelecek', 'meslek', 'hayal'],
    emoji: '🌟'
  },
  {
    id: '3',
    title: 'Tatil Anım',
    prompt: 'En güzel tatil anını anlat. Nerede gittin? Ne yaptın?',
    keywords: ['tatil', 'gezme', 'eğlence'],
    emoji: '🏖️'
  }
];

const expressionPrompts: ExpressionPrompt[] = [
  {
    id: '1',
    emotion: 'Mutluluk',
    scenario: 'Çok mutlu olduğun bir anı düşün. Ne olmuştu?',
    examples: ['Doğum günümde...', 'Arkadaşımla oynarken...', 'Başarı elde ettiğimde...'],
    emoji: '😊'
  },
  {
    id: '2',
    emotion: 'Üzüntü',
    scenario: 'Üzgün hissettiğin bir zamanı hatırla. Nasıl hissetmiştin?',
    examples: ['Oyuncağım kırıldığında...', 'Arkadaşım üzdüğünde...', 'Bir şey kaybettiğimde...'],
    emoji: '😢'
  },
  {
    id: '3',
    emotion: 'Kızgınlık',
    scenario: 'Kızgın olduğun bir durumu anlat. Ne yapmıştın?',
    examples: ['Haksızlığa uğradığımda...', 'Bir şey olmadığında...', 'Engellenmişken...'],
    emoji: '😠'
  }
];

export default function WritingExpressionModulePage() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('menu');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [userStory, setUserStory] = useState('');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentExpressionIndex, setCurrentExpressionIndex] = useState(0);
  const [userExpression, setUserExpression] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('letter-tracing');
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { speak } = useElevenLabs();

  const activities = [
    {
      id: 'letter-tracing' as ActivityType,
      title: '✏️ Harf Yazma',
      description: 'Harfleri takip ederek yazma öğren',
      color: 'bg-blue-50 dark:bg-blue-900/30 dark:text-blue-2000 hover:bg-blue-600',
    },
    {
      id: 'word-building' as ActivityType,
      title: '🔤 Kelime Oluşturma',
      description: 'Harfleri birleştirip kelime yap',
      color: 'bg-green-50 dark:bg-green-900/30 dark:text-green-2000 hover:bg-green-600',
    },
    {
      id: 'sentence-making' as ActivityType,
      title: '📝 Cümle Kurma',
      description: 'Kelimelerden anlamlı cümleler oluştur',
      color: 'bg-purple-50 dark:bg-purple-900/30 dark:text-purple-2000 hover:bg-purple-600',
    },
    {
      id: 'story-writing' as ActivityType,
      title: '📚 Hikaye Yazma',
      description: 'Kendi hikayeni yaz ve paylaş',
      color: 'bg-orange-50 dark:bg-orange-900/30 dark:text-orange-2000 hover:bg-orange-600',
    },
    {
      id: 'expression' as ActivityType,
      title: '💭 İfade Etme',
      description: 'Duygu ve düşüncelerini ifade et',
      color: 'bg-pink-50 dark:bg-pink-900/30 dark:text-pink-2000 hover:bg-pink-600',
    },
  ];

  const handleBackToMenu = () => {
    setCurrentActivity('menu');
    setSelectedLetter(null);
    setCurrentWordIndex(0);
    setBuiltWord([]);
    setCurrentSentenceIndex(0);
    setSentenceWords([]);
    setUserStory('');
    setCurrentStoryIndex(0);
    setCurrentExpressionIndex(0);
    setUserExpression('');
  };

  const handleBackToModules = () => {
    router.push('/modules');
  };

  const handleShowHelp = (gameType: string) => {
    setHelpGameType(gameType);
    setShowHelpModal(true);
  };

  const handleLetterSelect = async (letter: Letter) => {
    setSelectedLetter(letter);
    await speak(`${letter.letter} harfini yazalım. ${letter.instructions}`, 'sentence');
  };

  const handleLetterComplete = async () => {
    await speak('Harika! Harfi çok güzel yazdın!', 'celebration');
    setSelectedLetter(null);
  };

  const handleAddLetter = async (letter: string) => {
    const currentWord = wordTemplates[currentWordIndex];
    if (builtWord.length < currentWord.letters.length) {
      const newBuiltWord = [...builtWord, letter];
      setBuiltWord(newBuiltWord);
      
      if (newBuiltWord.length === currentWord.letters.length) {
        const completeWord = newBuiltWord.join('');
        if (completeWord === currentWord.word) {
          await speak(`Tebrikler! "${currentWord.word}" kelimesini tamamladın!`, 'celebration');
        } else {
          await speak('Tekrar dene. Harflerin sırasına dikkat et.', 'sentence');
          setBuiltWord([]);
        }
      } else {
        await speak(letter, 'letter');
      }
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < wordTemplates.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setBuiltWord([]);
    } else {
      speak('Tüm kelimeleri tamamladın! Harikasın!', 'celebration');
    }
  };

  const handleAddSentenceWord = async (word: string) => {
    const currentSentence = sentenceTemplates[currentSentenceIndex];
    if (sentenceWords.length < currentSentence.words.length) {
      const newSentenceWords = [...sentenceWords, word];
      setSentenceWords(newSentenceWords);
      
      if (newSentenceWords.length === currentSentence.words.length) {
        const completeSentence = newSentenceWords.join(' ');
        await speak(`Harika cümle: "${completeSentence}"`, 'celebration');
      } else {
        await speak(word, 'word');
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentenceTemplates.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setSentenceWords([]);
    } else {
      speak('Tüm cümleleri tamamladın! Muhteşemsin!', 'celebration');
    }
  };

  const handleStorySubmit = async () => {
    if (userStory.trim()) {
      await speak('Harika bir hikaye yazdın! Çok yaratıcısın!', 'celebration');
      setUserStory('');
      if (currentStoryIndex < storyPrompts.length - 1) {
        setCurrentStoryIndex(prev => prev + 1);
      }
    }
  };

  const handleExpressionSubmit = async () => {
    if (userExpression.trim()) {
      await speak('Duygularını çok güzel ifade ettin! Bu çok önemli!', 'celebration');
      setUserExpression('');
      if (currentExpressionIndex < expressionPrompts.length - 1) {
        setCurrentExpressionIndex(prev => prev + 1);
      }
    }
  };

  // Letter Tracing Activity
  if (currentActivity === 'letter-tracing') {
    return (
      <div className="min-h-screen soft-gradient-bg transition-colors duration-1000 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-adaptive-secondary glass-panel rounded-xl shadow-md hover:bg-gray-50 dark:bg-slate-800 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-adaptive mb-2">✏️ Harf Yazma</h1>
            <p className="text-lg text-adaptive-secondary">Harfleri takip ederek yazmayı öğren</p>
          </div>

          {!selectedLetter ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {letters.map((letter) => (
                <button
                  key={letter.letter}
                  onClick={() => handleLetterSelect(letter)}
                  className="glass-panel rounded-[2rem] premium-shadow hover:shadow-xl transition-all duration-300 p-8 text-center"
                >
                  <div className="text-6xl font-bold text-blue-600 mb-2">{letter.letter}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-[2rem] premium-shadow p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-adaptive mb-2">{selectedLetter.letter} Harfi</h2>
                <p className="text-adaptive-secondary">{selectedLetter.instructions}</p>
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <svg width="200" height="120" className="border-2 border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800">
                    {selectedLetter.paths.map((path, index) => (
                      <path
                        key={index}
                        d={path}
                        stroke="#3B82F6"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              <div className="text-center space-x-4">
                <button
                  onClick={handleLetterComplete}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Harfi Tamamladım
                </button>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Başka Harf Seç
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Word Building Activity
  if (currentActivity === 'word-building') {
    const currentWord = wordTemplates[currentWordIndex];
    
    return (
      <div className="min-h-screen soft-gradient-bg transition-colors duration-1000 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-adaptive-secondary glass-panel rounded-xl shadow-md hover:bg-gray-50 dark:bg-slate-800 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-adaptive mb-2">🔤 Kelime Oluşturma</h1>
            <p className="text-lg text-adaptive-secondary">Kelime {currentWordIndex + 1} / {wordTemplates.length}</p>
          </div>

          <div className="glass-panel rounded-[2rem] premium-shadow p-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{currentWord.image}</div>
              <h2 className="text-2xl font-bold text-adaptive mb-2">{currentWord.hint}</h2>
              <p className="text-adaptive-secondary">Harfleri sırayla tıklayarak kelimeyi oluştur</p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {currentWord.letters.map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 border-2 border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-2xl font-bold"
                  >
                    {builtWord[index] || ''}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-8">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'Ü', 'V', 'Y', 'Z', 'Ç', 'Ğ', 'İ', 'Ö', 'Ş'].map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleAddLetter(letter)}
                  className="p-3 bg-green-100 hover:bg-green-200 rounded-lg text-lg font-bold transition-colors"
                >
                  {letter}
                </button>
              ))}
            </div>

            {builtWord.length === currentWord.letters.length && builtWord.join('') === currentWord.word && (
              <div className="text-center">
                <button
                  onClick={handleNextWord}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sonraki Kelime
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sentence Making Activity
  if (currentActivity === 'sentence-making') {
    const currentSentence = sentenceTemplates[currentSentenceIndex];
    
    return (
      <div className="min-h-screen soft-gradient-bg transition-colors duration-1000 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-adaptive-secondary glass-panel rounded-xl shadow-md hover:bg-gray-50 dark:bg-slate-800 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-adaptive mb-2">📝 Cümle Kurma</h1>
            <p className="text-lg text-adaptive-secondary">Cümle {currentSentenceIndex + 1} / {sentenceTemplates.length}</p>
          </div>

          <div className="glass-panel rounded-[2rem] premium-shadow p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentSentence.image}</div>
              <h2 className="text-2xl font-bold text-adaptive mb-2">{currentSentence.meaning}</h2>
              <p className="text-adaptive-secondary">Kelimeleri sırayla tıklayarak cümle oluştur</p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg min-h-16 min-w-64 border-2 border-dashed border-gray-300 dark:border-slate-600">
                <p className="text-lg text-center">
                  {sentenceWords.join(' ') || 'Cümleniz burada görünecek...'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {currentSentence.words.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleAddSentenceWord(word)}
                  disabled={sentenceWords.includes(word)}
                  className={`p-4 rounded-lg text-lg font-semibold transition-colors ${
                    sentenceWords.includes(word)
                      ? 'bg-gray-200 dark:bg-slate-700 text-adaptive-secondary opacity-80 cursor-not-allowed'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            {sentenceWords.length === currentSentence.words.length && (
              <div className="text-center space-x-4">
                <button
                  onClick={handleNextSentence}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sonraki Cümle
                </button>
                <button
                  onClick={() => setSentenceWords([])}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Story Writing Activity
  if (currentActivity === 'story-writing') {
    const currentStory = storyPrompts[currentStoryIndex];
    
    return (
      <div className="min-h-screen soft-gradient-bg transition-colors duration-1000 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-adaptive-secondary glass-panel rounded-xl shadow-md hover:bg-gray-50 dark:bg-slate-800 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-adaptive mb-2">📚 Hikaye Yazma</h1>
            <p className="text-lg text-adaptive-secondary">Hikaye {currentStoryIndex + 1} / {storyPrompts.length}</p>
          </div>

          <div className="glass-panel rounded-[2rem] premium-shadow p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentStory.emoji}</div>
              <h2 className="text-2xl font-bold text-adaptive mb-4">{currentStory.title}</h2>
              <p className="text-lg text-adaptive-secondary mb-6">{currentStory.prompt}</p>
              
              <div className="flex justify-center space-x-2 mb-6">
                <span className="text-sm text-adaptive-secondary opacity-80">Anahtar kelimeler:</span>
                {currentStory.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <textarea
                value={userStory}
                onChange={(e) => setUserStory(e.target.value)}
                placeholder="Hikayeni buraya yaz..."
                className="w-full h-64 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg text-lg resize-none focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={handleStorySubmit}
                disabled={!userStory.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userStory.trim()
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-300 dark:bg-slate-600 text-adaptive-secondary opacity-80 cursor-not-allowed'
                }`}
              >
                Hikayemi Tamamla
              </button>
              <button
                onClick={() => setUserStory('')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expression Activity
  if (currentActivity === 'expression') {
    const currentExpression = expressionPrompts[currentExpressionIndex];
    
    return (
      <div className="min-h-screen soft-gradient-bg transition-colors duration-1000 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-adaptive-secondary glass-panel rounded-xl shadow-md hover:bg-gray-50 dark:bg-slate-800 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-adaptive mb-2">💭 İfade Etme</h1>
            <p className="text-lg text-adaptive-secondary">Duygu {currentExpressionIndex + 1} / {expressionPrompts.length}</p>
          </div>

          <div className="glass-panel rounded-[2rem] premium-shadow p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentExpression.emoji}</div>
              <h2 className="text-2xl font-bold text-adaptive mb-4">{currentExpression.emotion}</h2>
              <p className="text-lg text-adaptive-secondary mb-6">{currentExpression.scenario}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-adaptive-secondary mb-3">Örnek başlangıçlar:</h3>
                <div className="space-y-2">
                  {currentExpression.examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-200 text-pink-800 rounded-lg text-left"
                    >
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <textarea
                value={userExpression}
                onChange={(e) => setUserExpression(e.target.value)}
                placeholder="Duygularını ve düşüncelerini buraya yaz..."
                className="w-full h-48 p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg text-lg resize-none focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={handleExpressionSubmit}
                disabled={!userExpression.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userExpression.trim()
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-300 dark:bg-slate-600 text-adaptive-secondary opacity-80 cursor-not-allowed'
                }`}
              >
                İfademi Paylaş
              </button>
              <button
                onClick={() => setUserExpression('')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen soft-gradient-bg transition-colors duration-1000 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToModules}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-adaptive-secondary glass-panel rounded-xl shadow-md hover:bg-gray-50 dark:bg-slate-800 transition-colors"
            >
              ← Modüllere Dön
            </button>
            <button
              onClick={() => handleShowHelp('letter-tracing')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-200 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-adaptive mb-2">
            ✍️ Yazma ve İfade Etme
      </h1>
          <p className="text-lg text-adaptive-secondary">
            Yazma becerilerini geliştir ve kendini ifade et!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="glass-panel rounded-[2rem] premium-shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-adaptive mb-3">
                  {activity.title}
                </h3>
                <p className="text-adaptive-secondary mb-4">
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
                    className="px-3 py-3 bg-gray-100 dark:bg-slate-700/50 text-adaptive-secondary rounded-lg hover:bg-gray-200 dark:bg-slate-700 transition-colors"
                    title="Aktivite kurallarını görüntüle"
                  >
                    ❓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-panel rounded-[2rem] premium-shadow p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-adaptive mb-4">
              🌟 Yazma Becerilerini Geliştir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-adaptive-secondary">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-200 rounded-lg">
                <div className="text-2xl mb-2">✏️</div>
                <h3 className="font-semibold mb-1">Harf Yazma</h3>
                <p>Motor becerileri geliştir</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 dark:text-green-200 rounded-lg">
                <div className="text-2xl mb-2">🔤</div>
                <h3 className="font-semibold mb-1">Kelime Yapma</h3>
                <p>Harfleri birleştir</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-200 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-semibold mb-1">Cümle Kurma</h3>
                <p>Anlamlı cümleler oluştur</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-200 rounded-lg">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold mb-1">Hikaye</h3>
                <p>Yaratıcılığını geliştir</p>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-200 rounded-lg">
                <div className="text-2xl mb-2">💭</div>
                <h3 className="font-semibold mb-1">İfade</h3>
                <p>Duygularını paylaş</p>
              </div>
            </div>
          </div>
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
