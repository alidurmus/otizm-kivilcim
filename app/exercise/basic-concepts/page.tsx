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
  { id: '1', name: 'Kırmızı', color: '#EF4444', emoji: '🍎' },
  { id: '2', name: 'Mavi', color: '#3B82F6', emoji: '💙' },
  { id: '3', name: 'Sarı', color: '#EAB308', emoji: '🌟' },
  { id: '4', name: 'Yeşil', color: '#22C55E', emoji: '🌿' },
  { id: '5', name: 'Turuncu', color: '#F97316', emoji: '🧡' },
  { id: '6', name: 'Mor', color: '#A855F7', emoji: '💜' },
  { id: '7', name: 'Pembe', color: '#EC4899', emoji: '🌸' },
  { id: '8', name: 'Kahverengi', color: '#8B4513', emoji: '🤎' }
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
  const [_gameScore, setGameScore] = useState(0);
  const [_selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpGameType, setHelpGameType] = useState<string>('colors');

  const router = useRouter();
  const { speak } = useElevenLabs();

  const concepts = [
    {
      id: 'colors' as ConceptType,
      title: '🎨 Renkler',
      description: 'Renkleri tanı ve öğren',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'shapes' as ConceptType,
      title: '🔷 Şekiller',
      description: 'Geometrik şekilleri keşfet',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'numbers' as ConceptType,
      title: '🔢 Sayılar',
      description: '1-10 arası sayıları öğren',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'sizes' as ConceptType,
      title: '📏 Boyutlar',
      description: 'Büyük-küçük, uzun-kısa kavramları',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      id: 'directions' as ConceptType,
      title: '🧭 Yönler',
      description: 'Yukarı-aşağı, sağ-sol yönleri',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'opposites' as ConceptType,
      title: '⚡ Zıt Kavramlar',
      description: 'Karşıt anlamlı kelimeler',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      id: 'time' as ConceptType,
      title: '⏰ Zaman',
      description: 'Gündüz-gece, mevsimler',
      color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
      id: 'animals' as ConceptType,
      title: '🐾 Hayvanlar',
      description: 'Hayvanları tanı ve öğren',
      color: 'bg-teal-500 hover:bg-teal-600',
    },
  ];

  const handleBackToMenu = () => {
    setCurrentConcept('menu');
    setSelectedColor(null);
    setSelectedShape(null);
    setSelectedAnimal(null);
    setCurrentNumberIndex(0);
    setCurrentAnimalIndex(0);
    setGameScore(0);
    setSelectedAnswer(null);
  };

  const handleBackToModules = () => {
    router.push('/modules');
  };

  const handleShowHelp = (gameType: string) => {
    setHelpGameType(gameType);
    setShowHelpModal(true);
  };

  const handleColorSelect = async (color: Color) => {
    setSelectedColor(color);
    await speak("Bu renk!", 'sentence');
  };

  const handleShapeSelect = async (shape: Shape) => {
    setSelectedShape(shape);
    await speak("Bu şekil!", 'sentence');
  };

  const handleNumberSelect = async (number: NumberConcept) => {
    setCurrentNumberIndex(numbers.indexOf(number));
    await speak("Bu sayı!", 'sentence');
  };

  const handleAnimalSelect = async (animal: Animal) => {
    setSelectedAnimal(animal);
    await speak("Bu hayvan!", 'sentence');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAnswerSelect = (_answer: string) => {
    // Future implementation for interactive games
  };

  // Colors Activity
  if (currentConcept === 'colors') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎨 Renkler</h1>
            <p className="text-lg text-gray-600">Renkleri tanı ve öğren</p>
          </div>

          {!selectedColor ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center"
                  style={{ borderTop: `8px solid ${color.color}` }}
                >
                  <div className="text-6xl mb-4">{color.emoji}</div>
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <h3 className="text-xl font-bold text-gray-800">{color.name}</h3>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="text-8xl mb-6">{selectedColor.emoji}</div>
                <div
                  className="w-32 h-32 rounded-full mx-auto mb-6"
                  style={{ backgroundColor: selectedColor.color }}
                ></div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{selectedColor.name}</h2>
                
                <div className="space-x-4">
                  <button
                    onClick={() => setSelectedColor(null)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Başka Renk Seç
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Shapes Activity
  if (currentConcept === 'shapes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🔷 Şekiller</h1>
            <p className="text-lg text-gray-600">Geometrik şekilleri keşfet</p>
          </div>

          {!selectedShape ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleShapeSelect(shape)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center"
                >
                  <svg 
                    width="100" 
                    height="100" 
                    viewBox="0 0 100 100"
                    className="mx-auto mb-4 text-blue-600"
                    dangerouslySetInnerHTML={{ __html: shape.svg }}
                  />
                  <h3 className="text-xl font-bold text-gray-800">{shape.name}</h3>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <svg 
                  width="200" 
                  height="200" 
                  viewBox="0 0 100 100"
                  className="mx-auto mb-6 text-blue-600"
                  dangerouslySetInnerHTML={{ __html: selectedShape.svg }}
                />
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{selectedShape.name}</h2>
                <p className="text-xl text-gray-600 mb-6">{selectedShape.description}</p>
                
                <div className="space-x-4">
                  <button
                    onClick={() => setSelectedShape(null)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Başka Şekil Seç
                  </button>
                </div>
              </div>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🔢 Sayılar</h1>
            <p className="text-lg text-gray-600">Sayı {currentNumberIndex + 1} / {numbers.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-6xl font-bold text-green-600 mb-4">{currentNumber.number}</h2>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">{currentNumber.name}</h3>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {currentNumber.objects.map((obj, index) => (
                  <span key={index} className="text-4xl">{obj}</span>
                ))}
              </div>
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={() => setCurrentNumberIndex(Math.max(0, currentNumberIndex - 1))}
                disabled={currentNumberIndex === 0}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Önceki
              </button>
              <button
                onClick={() => handleNumberSelect(currentNumber)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Tekrar Dinle
              </button>
              <button
                onClick={() => setCurrentNumberIndex(Math.min(numbers.length - 1, currentNumberIndex + 1))}
                disabled={currentNumberIndex === numbers.length - 1}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📏 Boyutlar</h1>
            <p className="text-lg text-gray-600">
              {currentSizeConcept.type === 'big-small' ? 'Büyük - Küçük' : 'Uzun - Kısa'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentSizeConcept.items.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <div 
                    className={`mb-4 ${
                      item.size === 'big' ? 'text-8xl' : 
                      item.size === 'small' ? 'text-4xl' :
                      item.size === 'long' ? 'text-6xl transform scale-x-150' :
                      'text-3xl'
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentSizeIndex((currentSizeIndex + 1) % sizeConcepts.length)}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Diğer Boyut Kavramı
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Directions Activity
  if (currentConcept === 'directions') {
    const currentDirection = directionConcepts[currentDirectionIndex];
    
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🧭 Yönler</h1>
            <p className="text-lg text-gray-600">{currentDirection.instruction}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-2 gap-8">
              {currentDirection.items.map((item, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-lg ${
                    item.direction === 'yukarı' || item.direction === 'sağ' ? 'bg-purple-50' : 'bg-indigo-50'
                  }`}
                >
                  <div className="text-6xl mb-4">{item.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.direction.toUpperCase()}</h3>
                  <p className="text-gray-600">{item.position}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentDirectionIndex((currentDirectionIndex + 1) % directionConcepts.length)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Diğer Yön Kavramı
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Opposites Activity
  if (currentConcept === 'opposites') {
    const currentOpposite = oppositePairs[currentOppositeIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">⚡ Zıt Kavramlar</h1>
            <p className="text-lg text-gray-600">{currentOpposite.concept}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {currentOpposite.pairs.map((pair, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-orange-50 rounded-lg">
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-3">{pair.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-800">{pair.word}</h3>
                  </div>
                  
                  <div className="text-4xl font-bold text-orange-600 mx-8">⚡</div>
                  
                  <div className="text-center flex-1">
                    <div className="text-6xl mb-3">{pair.oppositeEmoji}</div>
                    <h3 className="text-2xl font-bold text-gray-800">{pair.opposite}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentOppositeIndex((currentOppositeIndex + 1) % oppositePairs.length)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Diğer Zıt Kavramlar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Time Activity
  if (currentConcept === 'time') {
    const currentTime = timeConcepts[currentTimeIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">⏰ Zaman</h1>
            <p className="text-lg text-gray-600">
              {currentTime.type === 'day-night' ? 'Gün ve Gece' : 'Mevsimler'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentTime.items.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors"
                >
                  <div className="text-6xl mb-4">{item.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item.time}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentTimeIndex((currentTimeIndex + 1) % timeConcepts.length)}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Diğer Zaman Kavramı
              </button>
            </div>
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🐾 Hayvanlar</h1>
            <p className="text-lg text-gray-600">Hayvan türlerini tanı ve öğren</p>
          </div>

          {!selectedAnimal ? (
            <div className="space-y-8">
              {Object.entries(categorizedAnimals).map(([category, categoryAnimals]) => {
                const categoryInfo = {
                  ev: { title: '🏠 Ev Hayvanları', color: 'bg-blue-50', borderColor: 'border-blue-200' },
                  vahsi: { title: '🌳 Vahşi Hayvanlar', color: 'bg-green-50', borderColor: 'border-green-200' },
                  kus: { title: '🦅 Kuşlar', color: 'bg-yellow-50', borderColor: 'border-yellow-200' },
                  deniz: { title: '🌊 Deniz Hayvanları', color: 'bg-cyan-50', borderColor: 'border-cyan-200' },
                };

                return (
                  <div key={category} className={`bg-white rounded-xl shadow-lg p-6 ${categoryInfo[category as keyof typeof categoryInfo].borderColor} border-2`}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                      {categoryInfo[category as keyof typeof categoryInfo].title}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categoryAnimals.map((animal) => (
                        <button
                          key={animal.id}
                          onClick={() => handleAnimalSelect(animal)}
                          className={`${categoryInfo[category as keyof typeof categoryInfo].color} rounded-xl shadow hover:shadow-lg transition-all duration-300 p-4 text-center hover:scale-105`}
                        >
                          <div className="text-6xl mb-3">{animal.emoji}</div>
                          <h3 className="text-lg font-bold text-gray-800">{animal.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{animal.sound}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="text-8xl mb-6">{selectedAnimal.emoji}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{selectedAnimal.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h3 className="text-lg font-bold text-teal-800 mb-2">🏠 Yaşam Alanı</h3>
                    <p className="text-gray-700">{selectedAnimal.habitat}</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h3 className="text-lg font-bold text-teal-800 mb-2">🔊 Ses</h3>
                    <p className="text-gray-700">{selectedAnimal.sound}</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h3 className="text-lg font-bold text-teal-800 mb-2">📝 Özellik</h3>
                    <p className="text-gray-700">{selectedAnimal.description}</p>
                  </div>
                </div>
                
                <div className="space-x-4">
                  <button
                    onClick={() => setSelectedAnimal(null)}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Başka Hayvan Seç
                  </button>
                  <button
                    onClick={() => speak("Hayvan sesi!", 'sentence')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🔊 Sesi Dinle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
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
              onClick={() => handleShowHelp('colors')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition-colors"
            >
              ❓ Yardım
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧩 Temel Kavramlar
          </h1>
          <p className="text-lg text-gray-600">
            Öğrenmenin temel taşlarını keşfet!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {concept.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {concept.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentConcept(concept.id)}
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-semibold transition-colors ${concept.color}`}
                  >
                    Kavramı Öğren
                  </button>
                  <button
                    onClick={() => handleShowHelp(concept.id)}
                    className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Kavram kurallarını görüntüle"
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
              🌟 Temel Kavramlar Neden Önemli?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="p-4 bg-cyan-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Algısal Gelişim</h3>
                <p>Çevreyi tanıma ve anlama</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-1">Bilişsel Temel</h3>
                <p>Daha karmaşık öğrenmeler için</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold mb-1">Dil Gelişimi</h3>
                <p>Kelime dağarcığı artışı</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="font-semibold mb-1">Okul Hazırlığı</h3>
                <p>Akademik becerilerin temeli</p>
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
