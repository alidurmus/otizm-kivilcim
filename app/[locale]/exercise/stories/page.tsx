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
      <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToStories}
              variant="secondary"
              size="small"
              className="text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 font-bold"
            >
              ← Hikayeler
            </Button>
            <h1 className="text-3xl font-extrabold text-focus-blue">{selectedStory.title}</h1>
          </div>
        </div>

        {/* Story Reader */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 mb-6">
            {/* Story Image Placeholder */}
            <div className="relative bg-gray-50 dark:bg-dark-border rounded-2xl p-8 mb-6 aspect-video flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-8xl mb-4">📖</div>
                <p className="text-gray-500 font-bold">Hikaye görseli</p>
              </div>
            </div>

            {/* Story Text */}
            <div className="text-center mb-8">
              <p className="text-2xl text-text-color dark:text-dark-text leading-relaxed font-extrabold">
                {currentPageData.text}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 0 || isPlaying}
                variant="secondary"
                size="large"
                className="font-bold border-2 border-gray-200 hover:border-gray-300 dark:border-dark-border dark:hover:border-gray-600"
              >
                ⬅️ Önceki
              </Button>
              
              <Button
                onClick={handlePlayAudio}
                disabled={isPlaying}
                variant="primary"
                size="large"
                className="font-extrabold bg-focus-blue text-white px-8 py-4"
              >
                {isPlaying ? '🔊 Oku...' : '🔊 Oku'}
              </Button>
              
              <Button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === selectedStory.pages.length - 1 || isPlaying}
                variant="secondary"
                size="large"
                className="font-bold border-2 border-gray-200 hover:border-gray-300 dark:border-dark-border dark:hover:border-gray-600"
              >
                Sonraki ➡️
              </Button>
            </div>

            {/* Auto Play */}
            <div className="flex justify-center mb-6 border-t-2 border-gray-100 dark:border-dark-border pt-6">
              <Button
                onClick={handleAutoPlay}
                disabled={isPlaying}
                variant="secondary"
                size="medium"
                className="text-focus-blue font-bold border-2 border-focus-blue/30 hover:bg-focus-blue/10"
              >
                {isPlaying ? '⏸️ Oynatılıyor...' : '▶️ Tümünü Oku'}
              </Button>
            </div>

            {/* Progress */}
            <div className="text-center">
              <div className="flex justify-center gap-3 mb-3">
                {selectedStory.pages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentPage 
                        ? 'w-10 bg-focus-blue' 
                        : 'w-3 bg-gray-200 dark:bg-dark-border'
                    }`}
                  />
                ))}
              </div>
              <p className="text-base font-bold text-gray-500 dark:text-gray-400">
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
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBackToModules}
            variant="secondary"
            size="small"
            className="text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 font-bold"
          >
            ← Modüller
          </Button>
          <h1 className="text-3xl font-extrabold text-focus-blue">📚 Hikaye Dinleme</h1>
        </div>
        <Button
          onClick={() => setShowHelp(true)}
          variant="secondary"
          size="small"
          className="text-text-color dark:text-dark-text bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 font-bold"
        >
          ❓ Yardım
        </Button>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 border-2 border-gray-200 dark:border-dark-border">
          <p className="text-gray-600 dark:text-dark-text-secondary text-center text-lg font-bold">
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
              className={`font-bold border-2 ${
                selectedCategory === category.id
                  ? 'bg-focus-blue text-white border-transparent'
                  : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text border-gray-200 dark:border-dark-border hover:border-focus-blue'
              }`}
            >
              <span className="mr-2">{category.icon}</span> {category.name}
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
              className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-gray-200 dark:border-dark-border overflow-hidden hover:border-focus-blue transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            >
              {/* Story Cover */}
              <div className="relative h-48 bg-gray-50 dark:bg-dark-border flex items-center justify-center border-b-2 border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-6xl mb-2">📖</div>
                </div>
              </div>

              {/* Story Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold bg-focus-blue/10 text-focus-blue border border-focus-blue/20 px-3 py-1 rounded-lg">
                    {story.category}
                  </span>
                  <span className="text-sm font-bold text-gray-500">{story.ageGroup}</span>
                </div>
                
                <h3 className="text-xl font-extrabold text-text-color dark:text-dark-text mb-2">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 dark:text-dark-text-secondary text-base font-medium mb-4 line-clamp-2">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between border-t-2 border-gray-100 dark:border-dark-border pt-4">
                  <span className="text-sm font-bold text-gray-500">⏱️ {story.duration}</span>
                  <span className="text-sm font-bold text-gray-500">
                    📄 {story.pages.length} sayfa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredStories.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border mt-8">
            <div className="text-7xl mb-6 opacity-50">📚</div>
            <h3 className="text-2xl font-extrabold text-gray-600 dark:text-dark-text-secondary mb-2">Bu kategoride hikaye bulunamadı</h3>
            <p className="font-bold text-gray-500 dark:text-gray-400">Başka bir kategori seçmeyi deneyin</p>
          </div>
        )}
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
