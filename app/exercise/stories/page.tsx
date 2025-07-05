'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { GameHelpModal } from '@/components/GameHelpModal';
import { useElevenLabs } from '@/lib/elevenlabs';

interface Story {
  id: string;
  title: string;
  category: string;
  description: string;
  ageGroup: string;
  duration: string;
  pages: StoryPage[];
  coverImage: string;
  isLocked: boolean;
}

interface StoryPage {
  id: number;
  image: string;
  text: string;
  audioText?: string;
}

const stories: Story[] = [
  {
    id: 'minik-sincap',
    title: 'Minik Sincap ve Dostları',
    category: 'Dostluk',
    description: 'Orman dostlarıyla maceraya çıkan minik sincabın hikayesi',
    ageGroup: '3-6 yaş',
    duration: '5 dk',
    coverImage: '/images/stories/minik-sincap-cover.jpg',
    isLocked: false,
    pages: [
      {
        id: 1,
        image: '/images/stories/sincap-1.jpg',
        text: 'Ormanın derinliklerinde, büyük bir meşe ağacında Minik Sincap yaşıyordu.',
        audioText: 'Ormanın derinliklerinde, büyük bir meşe ağacında Minik Sincap yaşıyordu.'
      },
      {
        id: 2,
        image: '/images/stories/sincap-2.jpg',
        text: 'Her sabah erken kalkar, fındık toplamak için ormanda dolaşırdı.',
        audioText: 'Her sabah erken kalkar, fındık toplamak için ormanda dolaşırdı.'
      },
      {
        id: 3,
        image: '/images/stories/sincap-3.jpg',
        text: 'Bir gün, ormanda yeni bir arkadaşla karşılaştı - Küçük Tavşan.',
        audioText: 'Bir gün, ormanda yeni bir arkadaşla karşılaştı - Küçük Tavşan.'
      },
      {
        id: 4,
        image: '/images/stories/sincap-4.jpg',
        text: 'Birlikte oyun oynamaya karar verdiler ve çok eğlendiler.',
        audioText: 'Birlikte oyun oynamaya karar verdiler ve çok eğlendiler.'
      },
      {
        id: 5,
        image: '/images/stories/sincap-5.jpg',
        text: 'O günden sonra, her gün birlikte maceraya çıktılar.',
        audioText: 'O günden sonra, her gün birlikte maceraya çıktılar.'
      }
    ]
  },
  {
    id: 'guzel-cicek',
    title: 'Güzel Çiçek ve Kelebek',
    category: 'Doğa',
    description: 'Bahçedeki güzel çiçeğin kelebek ile dostluğu',
    ageGroup: '2-5 yaş',
    duration: '3 dk',
    coverImage: '/images/stories/cicek-cover.jpg',
    isLocked: false,
    pages: [
      {
        id: 1,
        image: '/images/stories/cicek-1.jpg',
        text: 'Güzel bir bahçede, renkli bir çiçek büyüyordu.',
        audioText: 'Güzel bir bahçede, renkli bir çiçek büyüyordu.'
      },
      {
        id: 2,
        image: '/images/stories/cicek-2.jpg',
        text: 'Her gün güneşe bakıp, mutlulukla büyüyordu.',
        audioText: 'Her gün güneşe bakıp, mutlulukla büyüyordu.'
      },
      {
        id: 3,
        image: '/images/stories/cicek-3.jpg',
        text: 'Bir gün, güzel bir kelebek onun üzerine kondu.',
        audioText: 'Bir gün, güzel bir kelebek onun üzerine kondu.'
      },
      {
        id: 4,
        image: '/images/stories/cicek-4.jpg',
        text: 'Kelebek, "Sen çok güzelsin!" dedi çiçeğe.',
        audioText: 'Kelebek, "Sen çok güzelsin!" dedi çiçeğe.'
      },
      {
        id: 5,
        image: '/images/stories/cicek-5.jpg',
        text: 'Çiçek de kelebeğin güzelliğini takdir etti ve arkadaş oldular.',
        audioText: 'Çiçek de kelebeğin güzelliğini takdir etti ve arkadaş oldular.'
      }
    ]
  }
];

export default function StoriesPage() {
  const router = useRouter();
  const { speak } = useElevenLabs();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const categories = [
    { id: 'all', name: 'Tüm Hikayeler', icon: '📚' },
    { id: 'dostluk', name: 'Dostluk', icon: '👫' },
    { id: 'doğa', name: 'Doğa', icon: '🌱' },
    { id: 'oyun', name: 'Oyun', icon: '🎮' }
  ];

  const filteredStories = stories.filter(story => 
    selectedCategory === 'all' || story.category.toLowerCase() === selectedCategory
  );

  const handleStorySelect = (story: Story) => {
    if (story.isLocked) {
      speak('Bu hikaye henüz hazırlanıyor. Lütfen daha sonra tekrar deneyin.', 'sentence');
      return;
    }
    setSelectedStory(story);
    setCurrentPage(0);
    setIsPlaying(false);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (!selectedStory) return;
    
    if (direction === 'next' && currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    setIsPlaying(false);
  };

  const handlePlayAudio = async () => {
    if (!selectedStory) return;
    
    const currentPageData = selectedStory.pages[currentPage];
    setIsPlaying(true);
    
    try {
      await speak(currentPageData.audioText || currentPageData.text, 'sentence');
    } catch (error) {
      console.error('Ses oynatma hatası:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleAutoPlay = async () => {
    if (!selectedStory) return;
    
    setIsPlaying(true);
    
    for (let i = 0; i < selectedStory.pages.length; i++) {
      setCurrentPage(i);
      const pageData = selectedStory.pages[i];
      
      try {
        await speak(pageData.audioText || pageData.text, 'sentence');
        if (i < selectedStory.pages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Ses oynatma hatası:', error);
        break;
      }
    }
    
    setIsPlaying(false);
  };

  const handleBackToStories = () => {
    setSelectedStory(null);
    setCurrentPage(0);
    setIsPlaying(false);
  };

  const handleBackToModules = () => {
    router.push('/modules');
  };

  if (selectedStory) {
    const currentPageData = selectedStory.pages[currentPage];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToStories}
              variant="secondary"
              size="small"
              className="text-gray-600 hover:text-gray-800"
            >
              ← Hikayeler
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">{selectedStory.title}</h1>
          </div>
        </div>

        {/* Story Reader */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Story Image */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-gray-600 text-sm">Hikaye görseli</p>
              </div>
            </div>

            {/* Story Text */}
            <div className="text-center mb-6">
              <p className="text-xl text-gray-800 leading-relaxed font-medium">
                {currentPageData.text}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 0}
                variant="secondary"
                size="small"
              >
                ⬅️ Önceki
              </Button>
              
              <Button
                onClick={handlePlayAudio}
                disabled={isPlaying}
                variant="primary"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3"
              >
                {isPlaying ? '🔊 Oynatılıyor...' : '🔊 Oku'}
              </Button>
              
              <Button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === selectedStory.pages.length - 1}
                variant="secondary"
                size="small"
              >
                Sonraki ➡️
              </Button>
            </div>

            {/* Auto Play */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleAutoPlay}
                disabled={isPlaying}
                variant="secondary"
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                {isPlaying ? '⏸️ Oynatılıyor...' : '▶️ Hikayeyi Otomatik Oku'}
              </Button>
            </div>

            {/* Progress */}
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-2">
                {selectedStory.pages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentPage ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {currentPage + 1} / {selectedStory.pages.length}
              </p>
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <GameHelpModal 
            isOpen={showHelp} 
            onClose={() => setShowHelp(false)}
            gameType="stories"
            gameName="Hikaye Dinleme"
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBackToModules}
            variant="secondary"
            size="small"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Modüller
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">📚 Hikaye Dinleme</h1>
        </div>
        <Button
          onClick={() => setShowHelp(true)}
          variant="secondary"
          size="small"
          className="text-gray-600 hover:text-gray-800"
        >
          ❓ Yardım
        </Button>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 text-center text-lg">
            🎭 Çocuğunuzla birlikte güzel hikayeleri dinleyin ve eğlenceli vakit geçirin. 
            Her hikaye hem görsel hem de işitsel olarak hazırlanmıştır.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'primary' : 'secondary'}
              className={`${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-600 border-purple-300 hover:bg-purple-50'
              }`}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              onClick={() => handleStorySelect(story)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              {/* Story Cover */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📖</div>
                  <p className="text-gray-600 text-sm">Hikaye kapağı</p>
                </div>
              </div>

              {/* Story Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {story.category}
                  </span>
                  <span className="text-xs text-gray-500">{story.ageGroup}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">⏱️ {story.duration}</span>
                  <span className="text-xs text-gray-500">
                    📄 {story.pages.length} sayfa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <GameHelpModal 
          isOpen={showHelp} 
          onClose={() => setShowHelp(false)}
          gameType="stories"
          gameName="Hikaye Dinleme"
        />
      )}
    </div>
  );
}
