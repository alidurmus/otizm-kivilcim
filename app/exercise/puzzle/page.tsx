'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useElevenLabs } from '@/lib/elevenlabs';

interface PuzzlePiece {
  id: number;
  originalPosition: number;
  currentPosition: number | null;
  imageUrl: string;
  isPlaced: boolean;
}

interface PuzzleData {
  id: string;
  name: string;
  category: string;
  difficulty: number; // 4, 9, or 16 pieces
  imageUrl: string;
  pieces: PuzzlePiece[];
  description: string;
}

type PuzzleCategory = 'animals' | 'fruits' | 'vehicles' | 'shapes';
type PuzzleDifficulty = 4 | 9 | 16;

export default function PuzzlePage() {
  const [selectedCategory, setSelectedCategory] = useState<PuzzleCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PuzzleDifficulty | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleData | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [completedPieces, setCompletedPieces] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { speak } = useElevenLabs();

  const categories = [
    {
      id: 'animals' as PuzzleCategory,
      name: 'Hayvanlar',
      emoji: '🐾',
      description: 'Sevimli hayvan resimleri',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'fruits' as PuzzleCategory,
      name: 'Meyveler',
      emoji: '🍎',
      description: 'Taze ve renkli meyveler',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'vehicles' as PuzzleCategory,
      name: 'Araçlar',
      emoji: '🚗',
      description: 'Farklı taşıt türleri',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'shapes' as PuzzleCategory,
      name: 'Şekiller',
      emoji: '🔷',
      description: 'Renkli geometrik şekiller',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const difficulties = [
    {
      level: 4 as PuzzleDifficulty,
      name: 'Kolay',
      description: '2x2 = 4 parça',
      gridClass: 'grid-cols-2',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      level: 9 as PuzzleDifficulty,
      name: 'Orta',
      description: '3x3 = 9 parça',
      gridClass: 'grid-cols-3',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      level: 16 as PuzzleDifficulty,
      name: 'Zor',
      description: '4x4 = 16 parça',
      gridClass: 'grid-cols-4',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  // Sample puzzle data
  const puzzleData: Record<PuzzleCategory, Record<PuzzleDifficulty, PuzzleData[]>> = {
    animals: {
      4: [
        {
          id: 'cat-4',
          name: 'Sevimli Kedi',
          category: 'animals',
          difficulty: 4,
          imageUrl: '🐱',
          pieces: [],
          description: 'Şirin bir kedi resmi yapboz'
        },
        {
          id: 'dog-4',
          name: 'Dostane Köpek',
          category: 'animals',
          difficulty: 4,
          imageUrl: '🐶',
          pieces: [],
          description: 'Neşeli bir köpek resmi yapboz'
        }
      ],
      9: [
        {
          id: 'elephant-9',
          name: 'Büyük Fil',
          category: 'animals',
          difficulty: 9,
          imageUrl: '🐘',
          pieces: [],
          description: 'Güçlü bir fil resmi yapboz'
        }
      ],
      16: [
        {
          id: 'lion-16',
          name: 'Aslan Kralı',
          category: 'animals',
          difficulty: 16,
          imageUrl: '🦁',
          pieces: [],
          description: 'Güçlü aslan resmi yapboz'
        }
      ]
    },
    fruits: {
      4: [
        {
          id: 'apple-4',
          name: 'Kırmızı Elma',
          category: 'fruits',
          difficulty: 4,
          imageUrl: '🍎',
          pieces: [],
          description: 'Taze ve lezzetli elma'
        }
      ],
      9: [
        {
          id: 'orange-9',
          name: 'Portakal',
          category: 'fruits',
          difficulty: 9,
          imageUrl: '🍊',
          pieces: [],
          description: 'Vitamin dolu portakal'
        }
      ],
      16: [
        {
          id: 'watermelon-16',
          name: 'Karpuz',
          category: 'fruits',
          difficulty: 16,
          imageUrl: '🍉',
          pieces: [],
          description: 'Serinletici karpuz'
        }
      ]
    },
    vehicles: {
      4: [
        {
          id: 'car-4',
          name: 'Araba',
          category: 'vehicles',
          difficulty: 4,
          imageUrl: '🚗',
          pieces: [],
          description: 'Hızlı araba'
        }
      ],
      9: [
        {
          id: 'plane-9',
          name: 'Uçak',
          category: 'vehicles',
          difficulty: 9,
          imageUrl: '✈️',
          pieces: [],
          description: 'Gökyüzünde uçan uçak'
        }
      ],
      16: [
        {
          id: 'ship-16',
          name: 'Gemi',
          category: 'vehicles',
          difficulty: 16,
          imageUrl: '🚢',
          pieces: [],
          description: 'Okyanus da yüzen gemi'
        }
      ]
    },
    shapes: {
      4: [
        {
          id: 'circle-4',
          name: 'Renkli Daire',
          category: 'shapes',
          difficulty: 4,
          imageUrl: '🔴',
          pieces: [],
          description: 'Güzel renkli daire'
        }
      ],
      9: [
        {
          id: 'square-9',
          name: 'Mavi Kare',
          category: 'shapes',
          difficulty: 9,
          imageUrl: '🟦',
          pieces: [],
          description: 'Düzenli mavi kare'
        }
      ],
      16: [
        {
          id: 'star-16',
          name: 'Altın Yıldız',
          category: 'shapes',
          difficulty: 16,
          imageUrl: '⭐',
          pieces: [],
          description: 'Parlayan altın yıldız'
        }
      ]
    }
  };

  const createPuzzlePieces = (puzzle: PuzzleData): PuzzlePiece[] => {
    const pieces: PuzzlePiece[] = [];
    for (let i = 0; i < puzzle.difficulty; i++) {
      pieces.push({
        id: i,
        originalPosition: i,
        currentPosition: null,
        imageUrl: puzzle.imageUrl,
        isPlaced: false
      });
    }
    // Shuffle pieces
    return pieces.sort(() => Math.random() - 0.5);
  };

  const handleCategorySelect = async (category: PuzzleCategory) => {
    setSelectedCategory(category);
    const categoryData = categories.find(c => c.id === category);
    if (categoryData) {
      await speak(`${categoryData.name} kategorisini seçtin. Şimdi zorluk seviyesini seç.`, 'sentence');
    }
  };

  const handleDifficultySelect = async (difficulty: PuzzleDifficulty) => {
    setSelectedDifficulty(difficulty);
    if (selectedCategory) {
      const puzzles = puzzleData[selectedCategory][difficulty];
      const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      selectedPuzzle.pieces = createPuzzlePieces(selectedPuzzle);
      setCurrentPuzzle(selectedPuzzle);
      setCompletedPieces(0);
      setIsCompleted(false);
      setShowSuccess(false);
      
      const difficultyName = difficulties.find(d => d.level === difficulty)?.name;
      await speak(`${difficultyName} seviye seçtin. ${selectedPuzzle.name} yapbozunu başlayalım!`, 'sentence');
    }
  };

  const handleDragStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    
    if (draggedPiece === null || !currentPuzzle) return;

    const piece = currentPuzzle.pieces.find(p => p.id === draggedPiece);
    if (!piece) return;

    // Check if the piece is dropped in the correct position
    if (piece.originalPosition === targetPosition) {
      // Correct placement
      const updatedPieces = currentPuzzle.pieces.map(p => 
        p.id === draggedPiece 
          ? { ...p, currentPosition: targetPosition, isPlaced: true }
          : p
      );

      setCurrentPuzzle({ ...currentPuzzle, pieces: updatedPieces });
      setCompletedPieces(prev => prev + 1);
      
      await speak('Harika! Doğru yere koydin!', 'celebration');

      // Check if puzzle is completed
      if (completedPieces + 1 === currentPuzzle.difficulty) {
        setIsCompleted(true);
        setShowSuccess(true);
        setTimeout(async () => {
          await speak('Tebrikler! Yapbozu tamamladın! Çok başarılısın!', 'celebration');
        }, 500);
      }
    } else {
      // Incorrect placement - gentle feedback
      await speak('Başka bir yere dene. Sen yapabilirsin!', 'sentence');
    }

    setDraggedPiece(null);
  };

  const resetPuzzle = () => {
    if (currentPuzzle) {
      const resetPieces = createPuzzlePieces(currentPuzzle);
      setCurrentPuzzle({ ...currentPuzzle, pieces: resetPieces });
      setCompletedPieces(0);
      setIsCompleted(false);
      setShowSuccess(false);
    }
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setCurrentPuzzle(null);
    setCompletedPieces(0);
    setIsCompleted(false);
    setShowSuccess(false);
  };

  const goBackToModules = () => {
    router.push('/modules');
  };

  const getGridClass = () => {
    if (!selectedDifficulty) return '';
    return difficulties.find(d => d.level === selectedDifficulty)?.gridClass || '';
  };

  // Category Selection Screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={goBackToModules}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Modüllere Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🧩 Puzzle Oyunu</h1>
            <p className="text-lg text-gray-600">Hangi kategoride puzzle yapmak istiyorsun?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`${category.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center transform hover:scale-105`}
              >
                <div className="text-6xl mb-4">{category.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-lg opacity-90">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Difficulty Selection Screen
  if (!selectedDifficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={goBackToCategories}
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              ← Kategorilere Dön
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {categories.find(c => c.id === selectedCategory)?.emoji} {categories.find(c => c.id === selectedCategory)?.name}
            </h1>
            <p className="text-lg text-gray-600">Zorluk seviyesini seç</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.level}
                onClick={() => handleDifficultySelect(difficulty.level)}
                className={`${difficulty.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center transform hover:scale-105`}
              >
                <div className="text-4xl font-bold mb-4">{difficulty.level}</div>
                <h3 className="text-2xl font-bold mb-2">{difficulty.name}</h3>
                <p className="text-lg opacity-90">{difficulty.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Puzzle Game Screen
  if (!currentPuzzle) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={goBackToCategories}
            className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            ← Yeni Puzzle Seç
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {currentPuzzle.imageUrl} {currentPuzzle.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{currentPuzzle.description}</p>
          
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">İlerleme</span>
              <span className="text-sm font-medium text-gray-700">
                {completedPieces}/{currentPuzzle.difficulty}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedPieces / currentPuzzle.difficulty) * 100}%` }}
              ></div>
            </div>
          </div>

          {isCompleted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              🎉 Tebrikler! Puzzle'ı başarıyla tamamladın!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Puzzle Board */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Yapboz Tahtası</h3>
            <div className={`grid ${getGridClass()} gap-2 aspect-square max-w-sm mx-auto`}>
              {Array.from({ length: currentPuzzle.difficulty }, (_, index) => {
                const placedPiece = currentPuzzle.pieces.find(p => p.currentPosition === index && p.isPlaced);
                return (
                  <div
                    key={index}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {placedPiece ? (
                      <div className="text-4xl lg:text-6xl">
                        {placedPiece.imageUrl}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs text-center">
                        {index + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Puzzle Pieces */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Parçalar</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentPuzzle.pieces
                .filter(piece => !piece.isPlaced)
                .map((piece) => (
                  <div
                    key={piece.id}
                    draggable
                    onDragStart={() => handleDragStart(piece.id)}
                    className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center cursor-move hover:shadow-lg transition-all duration-200 border-2 border-blue-300"
                  >
                    <div className="text-3xl lg:text-5xl select-none">
                      {piece.imageUrl}
                    </div>
                  </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={resetPuzzle}
                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                🔄 Yeniden Başla
              </button>
              
              {isCompleted && (
                <button
                  onClick={goBackToCategories}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  🎯 Yeni Puzzle
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Harika!</h2>
              <p className="text-gray-600 mb-4">Puzzle'ı başarıyla tamamladın!</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 