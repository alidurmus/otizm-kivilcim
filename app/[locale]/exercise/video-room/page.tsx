'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import GameHelpModal from '@/components/GameHelpModal';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'educational' | 'social-stories' | 'calming' | 'music-videos';
  ageGroup: '3-6' | '6-9' | '9-12';
  url: string;
}

const videoContents: VideoContent[] = [
  {
    id: 'social-story-1',
    title: 'Arkadaşlarla Oyun Oynama',
    description: 'Arkadaşlarla nasıl oyun oynayacağımızı öğrenelim',
    thumbnail: '🎭',
    duration: '3:45',
    category: 'social-stories',
    ageGroup: '3-6',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'educational-1',
    title: 'Renkler ve Şekiller',
    description: 'Temel renkler ve şekilleri tanıyalım',
    thumbnail: '🌈',
    duration: '5:20',
    category: 'educational',
    ageGroup: '3-6',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'calming-1',
    title: 'Sakinleştirici Doğa Görüntüleri',
    description: 'Rahatlama için sakin doğa manzaraları',
    thumbnail: '🌿',
    duration: '10:00',
    category: 'calming',
    ageGroup: '3-6',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'educational-2',
    title: 'Sayıları Öğrenelim',
    description: '1den 10a kadar sayıları öğrenelim',
    thumbnail: '🔢',
    duration: '4:30',
    category: 'educational',
    ageGroup: '3-6',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'social-story-2',
    title: 'Merhaba Demek',
    description: 'İnsanlarla nasıl karşılaşacağımızı öğrenelim',
    thumbnail: '👋',
    duration: '2:45',
    category: 'social-stories',
    ageGroup: '3-6',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'music-video-1',
    title: 'Alfabe Şarkısı',
    description: 'Harfleri müzikle öğrenelim',
    thumbnail: '🎵',
    duration: '3:15',
    category: 'music-videos',
    ageGroup: '3-6',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'calming-2',
    title: 'Nefes Alma Egzersizi',
    description: 'Sakin nefes alma teknikleri',
    thumbnail: '🫁',
    duration: '5:00',
    category: 'calming',
    ageGroup: '6-9',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'educational-3',
    title: 'Günlük Rutinler',
    description: 'Günlük hayat becerilerini öğrenelim',
    thumbnail: '🌅',
    duration: '6:20',
    category: 'educational',
    ageGroup: '6-9',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const categories = [
  { id: 'all', name: 'Tüm Videolar', icon: '📺' },
  { id: 'educational', name: 'Eğitici', icon: '📚' },
  { id: 'social-stories', name: 'Sosyal Öyküler', icon: '👥' },
  { id: 'calming', name: 'Sakinleştirici', icon: '😌' },
  { id: 'music-videos', name: 'Müzik Videoları', icon: '🎵' }
];

export default function VideoRoomPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const filteredVideos = videoContents.filter(video => 
    selectedCategory === 'all' || video.category === selectedCategory
  );

  const handleVideoSelect = (video: VideoContent) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-calm-blue dark:bg-dark-bg p-4 transition-colors duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-surface p-4 rounded-2xl border-2 border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/modules')}
            variant="secondary"
          >
            ← Geri
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">📺</span>
            <h1 className="text-3xl font-extrabold text-focus-blue">Video İzleme Odası</h1>
          </div>
        </div>

        <Button
          onClick={() => setShowHelp(true)}
          variant="secondary"
        >
          ❓ Yardım
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Video Player */}
        {selectedVideo && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text">{selectedVideo.title}</h2>
              <button
                onClick={handleCloseVideo}
                className="px-6 py-3 bg-neutral-gray dark:bg-dark-border text-text-color dark:text-dark-text rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-600"
              >
                ✕ Kapat
              </button>
            </div>
            
            <div className="aspect-video bg-gray-100 dark:bg-black rounded-2xl mb-6 border-4 border-gray-200 dark:border-dark-border overflow-hidden">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center gap-4 text-base font-bold text-gray-600 dark:text-dark-text-secondary mb-4">
              <span>⏱️ {selectedVideo.duration}</span>
              <span className="bg-focus-blue/10 text-focus-blue border border-focus-blue/20 px-3 py-1 rounded-lg">
                {selectedVideo.ageGroup} yaş
              </span>
            </div>
            
            <p className="text-lg font-bold text-gray-600 dark:text-dark-text-secondary">{selectedVideo.description}</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-focus-blue mb-4">Kategoriler</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'border-focus-blue bg-focus-blue/10 text-focus-blue'
                    : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:border-focus-blue'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className={`bg-white dark:bg-dark-surface rounded-2xl border-4 transition-all duration-300 cursor-pointer p-6 hover:scale-[1.02] ${
                selectedVideo?.id === video.id ? 'border-focus-blue bg-focus-blue/5' : 'border-gray-200 dark:border-dark-border hover:border-focus-blue/50'
              }`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 bg-gray-50 dark:bg-dark-border w-24 h-24 mx-auto rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
                  {video.thumbnail}
                </div>
                <h3 className="font-extrabold text-xl text-text-color dark:text-dark-text mb-2">{video.title}</h3>
                <p className="font-bold text-gray-600 dark:text-dark-text-secondary text-sm">{video.description}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">⏱️ {video.duration}</span>
                  <span className="bg-focus-blue/10 text-focus-blue border border-focus-blue/20 px-3 py-1 rounded-lg">
                    {video.ageGroup} yaş
                  </span>
                </div>

                <button 
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
                    selectedVideo?.id === video.id
                      ? 'bg-success-green text-white hover:opacity-90'
                      : 'bg-focus-blue text-white hover:bg-blue-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoSelect(video);
                  }}
                >
                  {selectedVideo?.id === video.id ? '▶️ İzleniyor' : '▶️ İzle'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border">
            <div className="text-7xl mb-6 opacity-50">📺</div>
            <h3 className="text-2xl font-extrabold text-gray-600 dark:text-dark-text-secondary mb-2">Bu kategoride video bulunamadı</h3>
            <p className="font-bold text-gray-500 dark:text-gray-400">Başka bir kategori seçmeyi deneyin</p>
          </div>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <GameHelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          gameType="video-watching"
          gameName="Video İzleme Odası"
        />
      )}
    </div>
  );
}
