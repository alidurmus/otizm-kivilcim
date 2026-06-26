'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useElevenLabs } from '@/lib/elevenlabs';
import GameHelpModal from '@/components/GameHelpModal';

type ConceptType = 'menu' | 'colors' | 'shapes' | 'numbers' | 'sizes' | 'directions' | 'opposites' | 'time' | 'animals';

interface Color {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

interface Shape {
  id: string;
  name: string;
  svg: string;
  description: string;
}

interface NumberConcept {
  id: string;
  number: number;
  name: string;
  objects: string[];
}

interface SizeConcept {
  id: string;
  type: 'big-small' | 'long-short' | 'tall-short';
  items: Array<{
    name: string;
    emoji: string;
    size: 'big' | 'small' | 'long' | 'short' | 'tall';
  }>;
}

interface DirectionConcept {
  id: string;
  type: 'up-down' | 'left-right' | 'in-out' | 'front-back';
  instruction: string;
  items: Array<{
    emoji: string;
    direction: string;
    position: string;
  }>;
}

interface OppositePair {
  id: string;
  concept: string;
  pairs: Array<{
    word: string;
    emoji: string;
    opposite: string;
    oppositeEmoji: string;
  }>;
}

interface TimeConcept {
  id: string;
  type: 'day-night' | 'seasons' | 'week-days' | 'activities';
  items: Array<{
    name: string;
    emoji: string;
    time: string;
    description: string;
  }>;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  category: 'ev' | 'vahsi' | 'deniz' | 'kus';
  habitat: string;
  sound: string;
  description: string;
}

const colors: Color[] = [
  { id: '1', name: 'Mavi', color: '#3B82F6', emoji: '💙' },
  { id: '2', name: 'Yeşil', color: '#22C55E', emoji: '🌿' },
  { id: '3', name: 'Mor', color: '#A855F7', emoji: '💜' },
  { id: '4', name: 'Pembe', color: '#EC4899', emoji: '🌸' },
  { id: '5', name: 'Kahverengi', color: '#8B4513', emoji: '🤎' },
  { id: '6', name: 'Turuncu', color: '#F97316', emoji: '🧡' },
  { id: '7', name: 'Siyah', color: '#000000', emoji: '🖤' },
  { id: '8', name: 'Beyaz', color: '#FFFFFF', emoji: '🤍' }
];

const shapes: Shape[] = [
  {
    id: '1',
    name: 'Daire',
    svg: '<circle cx="50" cy="50" r="40" fill="currentColor" />',
    description: 'Yuvarlak şekil'
  },
  {
    id: '2',
    name: 'Kare',
    svg: '<rect x="20" y="20" width="60" height="60" fill="currentColor" />',
    description: 'Dört eşit kenarı olan şekil'
  },
  {
    id: '3',
    name: 'Üçgen',
    svg: '<polygon points="50,15 20,80 80,80" fill="currentColor" />',
    description: 'Üç kenarı olan şekil'
  },
  {
    id: '4',
    name: 'Dikdörtgen',
    svg: '<rect x="15" y="30" width="70" height="40" fill="currentColor" />',
    description: 'Uzun dörtgen şekil'
  },
  {
    id: '5',
    name: 'Yıldız',
    svg: '<polygon points="50,5 61,35 91,35 68,57 79,91 50,70 21,91 32,57 9,35 39,35" fill="currentColor" />',
    description: 'Beş köşeli parlayan şekil'
  },
  {
    id: '6',
    name: 'Kalp',
    svg: '<path d="M50,85 C20,60 5,35 25,15 C35,5 45,10 50,20 C55,10 65,5 75,15 C95,35 80,60 50,85 Z" fill="currentColor" />',
    description: 'Sevgi şekli'
  }
];

const numbers: NumberConcept[] = [
  { id: '1', number: 1, name: 'Bir', objects: ['🍎'] },
  { id: '2', number: 2, name: 'İki', objects: ['🍎', '🍎'] },
  { id: '3', number: 3, name: 'Üç', objects: ['🍎', '🍎', '🍎'] },
  { id: '4', number: 4, name: 'Dört', objects: ['🍎', '🍎', '🍎', '🍎'] },
  { id: '5', number: 5, name: 'Beş', objects: ['🍎', '🍎', '🍎', '🍎', '🍎'] },
  { id: '6', number: 6, name: 'Altı', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
  { id: '7', number: 7, name: 'Yedi', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
  { id: '8', number: 8, name: 'Sekiz', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
  { id: '9', number: 9, name: 'Dokuz', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
  { id: '10', number: 10, name: 'On', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] }
];

const sizeConcepts: SizeConcept[] = [
  {
    id: '1',
    type: 'big-small',
    items: [
      { name: 'Büyük Fil', emoji: '🐘', size: 'big' },
      { name: 'Küçük Fare', emoji: '🐭', size: 'small' },
      { name: 'Büyük Ev', emoji: '🏠', size: 'big' },
      { name: 'Küçük Ev', emoji: '🏘️', size: 'small' }
    ]
  },
  {
    id: '2',
    type: 'long-short',
    items: [
      { name: 'Uzun Yılan', emoji: '🐍', size: 'long' },
      { name: 'Kısa Solucan', emoji: '🪱', size: 'short' },
      { name: 'Uzun Kalem', emoji: '✏️', size: 'long' },
      { name: 'Kısa Kalem', emoji: '✂️', size: 'short' }
    ]
  }
];

const directionConcepts: DirectionConcept[] = [
  {
    id: '1',
    type: 'up-down',
    instruction: 'Yukarı ve aşağı yönlerini öğren',
    items: [
      { emoji: '☁️', direction: 'yukarı', position: 'üstte' },
      { emoji: '🌱', direction: 'aşağı', position: 'altta' },
      { emoji: '🦅', direction: 'yukarı', position: 'gökyüzünde' },
      { emoji: '🐾', direction: 'aşağı', position: 'yerde' }
    ]
  },
  {
    id: '2',
    type: 'left-right',
    instruction: 'Sol ve sağ yönlerini öğren',
    items: [
      { emoji: '👈', direction: 'sol', position: 'solda' },
      { emoji: '👉', direction: 'sağ', position: 'sağda' },
      { emoji: '🚗', direction: 'sağ', position: 'sağa gidiyor' },
      { emoji: '🏃‍♂️', direction: 'sol', position: 'sola koşuyor' }
    ]
  }
];

const oppositePairs: OppositePair[] = [
  {
    id: '1',
    concept: 'Sıcaklık',
    pairs: [
      { word: 'Sıcak', emoji: '🔥', opposite: 'Soğuk', oppositeEmoji: '❄️' },
      { word: 'Güneş', emoji: '☀️', opposite: 'Kar', oppositeEmoji: '⛄' }
    ]
  },
  {
    id: '2',
    concept: 'Hız',
    pairs: [
      { word: 'Hızlı', emoji: '🏃‍♂️', opposite: 'Yavaş', oppositeEmoji: '🐌' },
      { word: 'Uçak', emoji: '✈️', opposite: 'Kaplumbağa', oppositeEmoji: '🐢' }
    ]
  },
  {
    id: '3',
    concept: 'Duygular',
    pairs: [
      { word: 'Mutlu', emoji: '😊', opposite: 'Üzgün', oppositeEmoji: '😢' },
      { word: 'Gülümseme', emoji: '😄', opposite: 'Ağlama', oppositeEmoji: '😭' }
    ]
  }
];

const timeConcepts: TimeConcept[] = [
  {
    id: '1',
    type: 'day-night',
    items: [
      { name: 'Gündüz', emoji: '☀️', time: 'sabah', description: 'Güneş parlıyor' },
      { name: 'Gece', emoji: '🌙', time: 'akşam', description: 'Ay ve yıldızlar görünüyor' },
      { name: 'Sabah', emoji: '🌅', time: 'erkenden', description: 'Güneş doğuyor' },
      { name: 'Akşam', emoji: '🌆', time: 'geç', description: 'Güneş batıyor' }
    ]
  },
  {
    id: '2',
    type: 'seasons',
    items: [
      { name: 'İlkbahar', emoji: '🌸', time: 'mart-mayıs', description: 'Çiçekler açıyor' },
      { name: 'Yaz', emoji: '☀️', time: 'haziran-ağustos', description: 'Hava sıcak' },
      { name: 'Sonbahar', emoji: '🍂', time: 'eylül-kasım', description: 'Yapraklar dökülüyor' },
      { name: 'Kış', emoji: '❄️', time: 'aralık-şubat', description: 'Kar yağıyor' }
    ]
  }
];

const animals: Animal[] = [
  // Ev Hayvanları
  { id: '1', name: 'Kedi', emoji: '🐱', category: 'ev', habitat: 'Evde yaşar', sound: 'Miyav', description: 'Sevimli ve oyuncu' },
  { id: '2', name: 'Köpek', emoji: '🐶', category: 'ev', habitat: 'Evde yaşar', sound: 'Hav', description: 'Sadık arkadaş' },
  { id: '3', name: 'Tavşan', emoji: '🐰', category: 'ev', habitat: 'Evde yaşar', sound: 'Sessiz', description: 'Yumuşak ve hızlı' },
  { id: '4', name: 'Hamster', emoji: '🐹', category: 'ev', habitat: 'Kafeste yaşar', sound: 'Cırlama', description: 'Minik ve sevimli' },
  
  // Vahşi Hayvanlar
  { id: '5', name: 'Aslan', emoji: '🦁', category: 'vahsi', habitat: 'Afrikada yaşar', sound: 'Kükreme', description: 'Hayvanların kralı' },
  { id: '6', name: 'Fil', emoji: '🐘', category: 'vahsi', habitat: 'Afrikada yaşar', sound: 'Boru sesi', description: 'Çok büyük ve güçlü' },
  { id: '7', name: 'Kaplan', emoji: '🐅', category: 'vahsi', habitat: 'Asyada yaşar', sound: 'Kükreme', description: 'Çizgili ve hızlı' },
  { id: '8', name: 'Maymun', emoji: '🐵', category: 'vahsi', habitat: 'Ormanda yaşar', sound: 'Cıvıldama', description: 'Zeki ve çevik' },
  
  // Kuşlar
  { id: '9', name: 'Kuş', emoji: '🐦', category: 'kus', habitat: 'Gökyüzünde uçar', sound: 'Cıvıldama', description: 'Şarkı söyler' },
  { id: '10', name: 'Kartal', emoji: '🦅', category: 'kus', habitat: 'Dağlarda yaşar', sound: 'Çığlık', description: 'Güçlü ve hızlı' },
  { id: '11', name: 'Penguen', emoji: '🐧', category: 'kus', habitat: 'Kutuplarda yaşar', sound: 'Gayık', description: 'Yüzmeyi sever' },
  { id: '12', name: 'Tavuk', emoji: '🐔', category: 'ev', habitat: 'Çiftlikte yaşar', sound: 'Gıdak', description: 'Yumurta verir' },
  
  // Deniz Hayvanları
  { id: '13', name: 'Balık', emoji: '🐟', category: 'deniz', habitat: 'Denizde yaşar', sound: 'Sessiz', description: 'Suda yüzer' },
  { id: '14', name: 'Yunus', emoji: '🐬', category: 'deniz', habitat: 'Denizde yaşar', sound: 'Islık', description: 'Çok zeki ve arkadaş canlısı' },
  { id: '15', name: 'Balina', emoji: '🐋', category: 'deniz', habitat: 'Okyanusta yaşar', sound: 'Şarkı', description: 'Dünyanın en büyük hayvanı' },
  { id: '16', name: 'Kaplumbağa', emoji: '🐢', category: 'deniz', habitat: 'Deniz ve karada yaşar', sound: 'Sessiz', description: 'Kabuğu olan yavaş hayvan' }
];

export default function BasicConceptsModulePage() {
  const [currentConcept, setCurrentConcept] = useState<ConceptType>('menu');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [currentSizeIndex, setCurrentSizeIndex] = useState(0);
  const [currentDirectionIndex, setCurrentDirectionIndex] = useState(0);
  const [currentOppositeIndex, setCurrentOppositeIndex] = useState(0);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [_currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('colors');
  const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();
  const { speak } = useElevenLabs();

  const concepts = [
    {
      id: 'colors' as ConceptType,
      title: '🎨 Renkler',
      description: 'Renkleri tanı ve öğren',
      color: 'bg-focus-blue text-white',
    },
    {
      id: 'shapes' as ConceptType,
      title: '🔷 Şekiller',
      description: 'Geometrik şekilleri keşfet',
      color: 'bg-success-green text-white',
    },
    {
      id: 'numbers' as ConceptType,
      title: '🔢 Sayılar',
      description: '1-10 arası sayıları öğren',
      color: 'bg-encourage-orange text-white',
    },
    {
      id: 'sizes' as ConceptType,
      title: '📏 Boyutlar',
      description: 'Büyük-küçük, uzun-kısa kavramları',
      color: 'bg-focus-blue text-white',
    },
    {
      id: 'directions' as ConceptType,
      title: '🧭 Yönler',
      description: 'Yukarı-aşağı, sağ-sol yönleri',
      color: 'bg-success-green text-white',
    },
    {
      id: 'opposites' as ConceptType,
      title: '⚡ Zıt Kavramlar',
      description: 'Karşıt anlamlı kelimeler',
      color: 'bg-encourage-orange text-white',
    },
    {
      id: 'time' as ConceptType,
      title: '⏰ Zaman',
      description: 'Gündüz-gece, mevsimler',
      color: 'bg-focus-blue text-white',
    },
    {
      id: 'animals' as ConceptType,
      title: '🐾 Hayvanlar',
      description: 'Hayvanları tanı ve öğren',
      color: 'bg-success-green text-white',
    },
  ];

  const handleBackToMenu = () => {
    setCurrentConcept('menu');
    setSelectedColor(null);
    setSelectedShape(null);
    setSelectedAnimal(null);
    setCurrentNumberIndex(0);
    setCurrentAnimalIndex(0);
  };

  const handleBackToModules = () => {
    router.push('/modules');
  };

  const handleShowHelp = (gameType: string) => {
    setHelpGameType(gameType);
    setShowHelpModal(true);
  };

  const playSpeech = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await speak(text, 'sentence');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleColorSelect = async (color: Color) => {
    setSelectedColor(color);
    await playSpeech(`Bu renk ${color.name}`);
  };

  const handleShapeSelect = async (shape: Shape) => {
    setSelectedShape(shape);
    await playSpeech(`Bu şekil ${shape.name}`);
  };

  const handleNumberSelect = async (number: NumberConcept) => {
    setCurrentNumberIndex(numbers.indexOf(number));
    await playSpeech(`Sayı ${number.name}`);
  };

  const handleAnimalSelect = async (animal: Animal) => {
    setSelectedAnimal(animal);
    await playSpeech(`Bu hayvan ${animal.name}`);
  };

  // Colors Activity
  if (currentConcept === 'colors') {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">🎨 Renkler</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">Renkleri tanı ve öğren</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          {!selectedColor ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className="bg-white dark:bg-dark-surface rounded-2xl border-4 transition-all duration-300 p-6 text-center transform hover:scale-[1.02]"
                  style={{ borderColor: color.color }}
                >
                  <div className="text-6xl mb-4">{color.emoji}</div>
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-200 dark:border-dark-border"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <h3 className="text-xl font-extrabold text-text-color dark:text-dark-text">{color.name}</h3>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 text-center animate-gentle-bounce">
              <div className="text-8xl mb-6">{selectedColor.emoji}</div>
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-200 dark:border-dark-border"
                style={{ backgroundColor: selectedColor.color }}
              ></div>
              <h2 className="text-4xl font-extrabold text-text-color dark:text-dark-text mb-8">{selectedColor.name}</h2>
              
              <button
                onClick={() => setSelectedColor(null)}
                className="px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Başka Renk Seç
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Shapes Activity
  if (currentConcept === 'shapes') {
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">🔷 Şekiller</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">Geometrik şekilleri keşfet</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          {!selectedShape ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleShapeSelect(shape)}
                  className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-gray-200 dark:border-dark-border hover:border-focus-blue transition-all duration-300 p-8 text-center transform hover:scale-[1.02]"
                >
                  <svg 
                    width="100" 
                    height="100" 
                    viewBox="0 0 100 100"
                    className="mx-auto mb-4 text-focus-blue"
                    dangerouslySetInnerHTML={{ __html: shape.svg }}
                  />
                  <h3 className="text-xl font-extrabold text-text-color dark:text-dark-text">{shape.name}</h3>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 text-center animate-gentle-bounce">
              <svg 
                width="200" 
                height="200" 
                viewBox="0 0 100 100"
                className="mx-auto mb-6 text-focus-blue"
                dangerouslySetInnerHTML={{ __html: selectedShape.svg }}
              />
              <h2 className="text-4xl font-extrabold text-text-color dark:text-dark-text mb-4">{selectedShape.name}</h2>
              <p className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary mb-8">{selectedShape.description}</p>
              
              <button
                onClick={() => setSelectedShape(null)}
                className="px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Başka Şekil Seç
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Numbers Activity
  if (currentConcept === 'numbers') {
    const currentNumber = numbers[currentNumberIndex];
    
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">🔢 Sayılar</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">Sayı {currentNumberIndex + 1} / {numbers.length}</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10 text-center animate-gentle-bounce">
            <div className="mb-10">
              <h2 className="text-8xl font-extrabold text-focus-blue mb-4">{currentNumber.number}</h2>
              <h3 className="text-4xl font-extrabold text-text-color dark:text-dark-text mb-8">{currentNumber.name}</h3>
              
              <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
                {currentNumber.objects.map((obj, index) => (
                  <span key={index} className="text-5xl">{obj}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentNumberIndex(Math.max(0, currentNumberIndex - 1))}
                disabled={currentNumberIndex === 0 || isPlaying}
                className="px-8 py-4 bg-gray-200 dark:bg-dark-border text-text-color dark:text-dark-text font-extrabold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Önceki
              </button>
              <button
                onClick={() => playSpeech(currentNumber.name)}
                disabled={isPlaying}
                className="px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:opacity-90 transition-colors disabled:opacity-50"
              >
                🔊 Dinle
              </button>
              <button
                onClick={() => setCurrentNumberIndex(Math.min(numbers.length - 1, currentNumberIndex + 1))}
                disabled={currentNumberIndex === numbers.length - 1 || isPlaying}
                className="px-8 py-4 bg-gray-200 dark:bg-dark-border text-text-color dark:text-dark-text font-extrabold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sizes Activity
  if (currentConcept === 'sizes') {
    const currentSizeConcept = sizeConcepts[currentSizeIndex];
    
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">📏 Boyutlar</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">
                {currentSizeConcept.type === 'big-small' ? 'Büyük - Küçük' : 'Uzun - Kısa'}
              </p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 text-center animate-gentle-bounce">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentSizeConcept.items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600"
                >
                  <div 
                    className={`mb-6 flex justify-center items-end h-32 ${
                      item.size === 'big' ? 'text-8xl' : 
                      item.size === 'small' ? 'text-4xl' :
                      item.size === 'long' ? 'text-7xl transform scale-y-150' :
                      'text-4xl'
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <h3 className="text-xl font-extrabold text-text-color dark:text-dark-text">{item.name}</h3>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentSizeIndex((currentSizeIndex + 1) % sizeConcepts.length)}
              className="mt-10 px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:opacity-90 transition-colors"
            >
              Diğer Boyut Kavramı
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Directions Activity
  if (currentConcept === 'directions') {
    const currentDirection = directionConcepts[currentDirectionIndex];
    
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">🧭 Yönler</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">{currentDirection.instruction}</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 text-center animate-gentle-bounce">
            <div className="grid grid-cols-2 gap-8">
              {currentDirection.items.map((item, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center"
                >
                  <div className="text-7xl mb-4">{item.emoji}</div>
                  <h3 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-2">{item.direction.toUpperCase()}</h3>
                  <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">{item.position}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentDirectionIndex((currentDirectionIndex + 1) % directionConcepts.length)}
              className="mt-10 px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:opacity-90 transition-colors"
            >
              Diğer Yön Kavramı
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Opposites Activity
  if (currentConcept === 'opposites') {
    const currentOpposite = oppositePairs[currentOppositeIndex];
    
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">⚡ Zıt Kavramlar</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">{currentOpposite.concept}</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 text-center animate-gentle-bounce">
            <div className="space-y-8">
              {currentOpposite.pairs.map((pair, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
                  <div className="text-center flex-1">
                    <div className="text-7xl mb-4">{pair.emoji}</div>
                    <h3 className="text-3xl font-extrabold text-text-color dark:text-dark-text">{pair.word}</h3>
                  </div>
                  
                  <div className="text-5xl font-extrabold text-focus-blue mx-8 my-4 md:my-0">⚡</div>
                  
                  <div className="text-center flex-1">
                    <div className="text-7xl mb-4">{pair.oppositeEmoji}</div>
                    <h3 className="text-3xl font-extrabold text-text-color dark:text-dark-text">{pair.opposite}</h3>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentOppositeIndex((currentOppositeIndex + 1) % oppositePairs.length)}
              className="mt-10 px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:opacity-90 transition-colors"
            >
              Diğer Zıt Kavramlar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Time Activity
  if (currentConcept === 'time') {
    const currentTime = timeConcepts[currentTimeIndex];
    
    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">⏰ Zaman</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">
                {currentTime.type === 'day-night' ? 'Gün ve Gece' : 'Mevsimler'}
              </p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 text-center animate-gentle-bounce">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentTime.items.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center"
                >
                  <div className="text-7xl mb-6">{item.emoji}</div>
                  <h3 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-2">{item.name}</h3>
                  <p className="text-sm font-bold text-focus-blue bg-focus-blue/10 px-3 py-1 rounded-lg mb-2">{item.time}</p>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentTimeIndex((currentTimeIndex + 1) % timeConcepts.length)}
              className="mt-10 px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:opacity-90 transition-colors"
            >
              Diğer Zaman Kavramı
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Animals Activity
  if (currentConcept === 'animals') {
    const categorizedAnimals = {
      ev: animals.filter(animal => animal.category === 'ev'),
      vahsi: animals.filter(animal => animal.category === 'vahsi'),
      kus: animals.filter(animal => animal.category === 'kus'),
      deniz: animals.filter(animal => animal.category === 'deniz'),
    };

    return (
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ← Geri Dön
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-focus-blue">🐾 Hayvanlar</h1>
              <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">Hayvan türlerini tanı ve öğren</p>
            </div>
            <div className="w-[120px]"></div>
          </div>

          {!selectedAnimal ? (
            <div className="space-y-12">
              {Object.entries(categorizedAnimals).map(([category, categoryAnimals]) => {
                const categoryInfo = {
                  ev: { title: '🏠 Ev Hayvanları' },
                  vahsi: { title: '🌳 Vahşi Hayvanlar' },
                  kus: { title: '🦅 Kuşlar' },
                  deniz: { title: '🌊 Deniz Hayvanları' },
                };

                return (
                  <div key={category} className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8">
                    <h2 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-6 text-center border-b-2 border-gray-100 dark:border-gray-700 pb-4">
                      {categoryInfo[category as keyof typeof categoryInfo].title}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {categoryAnimals.map((animal) => (
                        <button
                          key={animal.id}
                          onClick={() => handleAnimalSelect(animal)}
                          className="bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-focus-blue transition-all duration-300 p-6 text-center transform hover:scale-[1.05]"
                        >
                          <div className="text-6xl mb-4">{animal.emoji}</div>
                          <h3 className="text-xl font-extrabold text-text-color dark:text-dark-text">{animal.name}</h3>
                          <p className="text-sm font-bold text-gray-500 mt-2">{animal.sound}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-10 text-center animate-gentle-bounce">
              <div className="text-9xl mb-8">{selectedAnimal.emoji}</div>
              <h2 className="text-5xl font-extrabold text-text-color dark:text-dark-text mb-8">{selectedAnimal.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col justify-center">
                  <h3 className="text-lg font-extrabold text-focus-blue mb-2">🏠 Yaşam Alanı</h3>
                  <p className="text-base font-bold text-text-color dark:text-dark-text">{selectedAnimal.habitat}</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col justify-center">
                  <h3 className="text-lg font-extrabold text-focus-blue mb-2">🔊 Ses</h3>
                  <p className="text-base font-bold text-text-color dark:text-dark-text">{selectedAnimal.sound}</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col justify-center">
                  <h3 className="text-lg font-extrabold text-focus-blue mb-2">📝 Özellik</h3>
                  <p className="text-base font-bold text-text-color dark:text-dark-text">{selectedAnimal.description}</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSelectedAnimal(null)}
                  disabled={isPlaying}
                  className="px-8 py-4 bg-gray-200 dark:bg-dark-border text-text-color dark:text-dark-text font-extrabold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Başka Hayvan Seç
                </button>
                <button
                  onClick={() => playSpeech(`${selectedAnimal.name} sesi, ${selectedAnimal.sound}`)}
                  disabled={isPlaying}
                  className="px-8 py-4 bg-focus-blue text-white font-extrabold rounded-xl hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  🔊 Sesi Dinle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border flex items-center justify-between">
          <button
            onClick={handleBackToModules}
            className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            ← Modüllere Dön
          </button>
          
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-extrabold text-focus-blue">
              🧩 Temel Kavramlar
            </h1>
            <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary mt-1">
              Öğrenmenin temel taşlarını keşfet!
            </p>
          </div>
          
          <button
            onClick={() => handleShowHelp('colors')}
            className="px-6 py-3 font-bold text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            ❓ Yardım
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-gray-200 dark:border-dark-border hover:border-focus-blue transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="p-6">
                <h3 className="text-2xl font-extrabold text-text-color dark:text-dark-text mb-2">
                  {concept.title}
                </h3>
                <p className="text-base font-bold text-gray-600 dark:text-dark-text-secondary mb-6">
                  {concept.description}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentConcept(concept.id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-extrabold transition-opacity hover:opacity-90 ${concept.color}`}
                  >
                    Kavramı Öğren
                  </button>
                  <button
                    onClick={() => handleShowHelp(concept.id)}
                    className="px-4 py-3 bg-gray-100 dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    title="Kavram kurallarını görüntüle"
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
            <h2 className="text-2xl font-extrabold text-focus-blue mb-8">
              🌟 Temel Kavramlar Neden Önemli?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-extrabold text-text-color dark:text-dark-text mb-2">Algısal Gelişim</h3>
                <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Çevreyi tanıma ve anlama</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-extrabold text-text-color dark:text-dark-text mb-2">Bilişsel Temel</h3>
                <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Daha karmaşık öğrenmeler için</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-extrabold text-text-color dark:text-dark-text mb-2">Dil Gelişimi</h3>
                <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Kelime dağarcığı artışı</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-dark-border border-2 border-gray-200 dark:border-gray-600 rounded-2xl">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-lg font-extrabold text-text-color dark:text-dark-text mb-2">Okul Hazırlığı</h3>
                <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">Akademik becerilerin temeli</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <GameHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          gameType={helpGameType}
          gameName="Temel Kavramlar"
        />
      )}
    </div>
  );
}
