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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push('/modules')}
            className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
          >
            ← Geri
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📺</span>
            <h1 className="text-2xl font-bold text-gray-800">Video İzleme Odası</h1>
          </div>
        </div>

        <Button
          onClick={() => setShowHelp(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
        >
          ❓ Yardım
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Video Player */}
        {selectedVideo && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedVideo.title}</h2>
              <Button
                onClick={handleCloseVideo}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                ✕ Kapat
              </Button>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-xl mb-4">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>⏱️ {selectedVideo.duration}</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {selectedVideo.ageGroup} yaş
              </span>
            </div>
            
            <p className="text-gray-600 mt-2">{selectedVideo.description}</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Kategoriler</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50'
                } shadow-md transition-all duration-200`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedVideo?.id === video.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{video.thumbnail}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱️ {video.duration}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {video.ageGroup} yaş
                  </span>
                </div>

                <div className="text-center">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white w-full">
                    {selectedVideo?.id === video.id ? '▶️ Oynatılıyor' : '▶️ İzle'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Bu kategoride video bulunamadı</h3>
            <p className="text-gray-500">Başka bir kategori seçmeyi deneyin</p>
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
