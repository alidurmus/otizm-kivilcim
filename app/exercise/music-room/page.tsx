'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import GameHelpModal from '@/components/GameHelpModal';

interface MusicContent {
  id: string;
  title: string;
  artist: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'calming' | 'educational' | 'classical' | 'nature-sounds' | 'rhythm-games';
  ageGroup: '3-6' | '6-9' | '9-12';
  audioUrl: string;
  volume: number;
}

const musicContents: MusicContent[] = [
  {
    id: 'calming-1',
    title: 'Yağmur Sesi',
    artist: 'Doğa Sesleri',
    description: 'Rahatlatıcı yağmur sesi',
    thumbnail: '🌧️',
    duration: '10:00',
    category: 'nature-sounds',
    ageGroup: '3-6',
    audioUrl: '/audio/rain-sounds.mp3',
    volume: 0.6
  },
  {
    id: 'educational-1',
    title: 'Alfabe Şarkısı',
    artist: 'Çocuk Şarkıları',
    description: 'Harfleri öğrenmek için eğlenceli şarkı',
    thumbnail: '🎵',
    duration: '3:45',
    category: 'educational',
    ageGroup: '3-6',
    audioUrl: '/audio/alphabet-song.mp3',
    volume: 0.8
  },
  {
    id: 'classical-1',
    title: 'Für Elise',
    artist: 'Beethoven',
    description: 'Sakin klasik müzik',
    thumbnail: '🎹',
    duration: '3:25',
    category: 'classical',
    ageGroup: '6-9',
    audioUrl: '/audio/fur-elise.mp3',
    volume: 0.5
  },
  {
    id: 'calming-2',
    title: 'Okyanus Dalgaları',
    artist: 'Doğa Sesleri',
    description: 'Sakinleştirici dalga sesleri',
    thumbnail: '🌊',
    duration: '15:00',
    category: 'nature-sounds',
    ageGroup: '3-6',
    audioUrl: '/audio/ocean-waves.mp3',
    volume: 0.6
  },
  {
    id: 'rhythm-1',
    title: 'Ritim Oyunu',
    artist: 'Eğitim Müzikleri',
    description: 'Ritim duygusunu geliştiren oyun',
    thumbnail: '🥁',
    duration: '4:30',
    category: 'rhythm-games',
    ageGroup: '6-9',
    audioUrl: '/audio/rhythm-game.mp3',
    volume: 0.9
  }
];

const categories = [
  { id: 'all', name: 'Tüm Müzikler', icon: '🎵' },
  { id: 'calming', name: 'Sakinleştirici', icon: '😌' },
  { id: 'educational', name: 'Eğitici Şarkılar', icon: '📚' },
  { id: 'classical', name: 'Klasik Müzik', icon: '🎻' },
  { id: 'nature-sounds', name: 'Doğa Sesleri', icon: '🌿' },
  { id: 'rhythm-games', name: 'Ritim Oyunları', icon: '🥁' }
];

export default function MusicRoomPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentMusic, setCurrentMusic] = useState<MusicContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredMusic = musicContents.filter(music => 
    selectedCategory === 'all' || music.category === selectedCategory
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentMusic]);

  const handleMusicSelect = (music: MusicContent) => {
    if (currentMusic?.id === music.id) {
      handlePlayPause();
    } else {
      setCurrentMusic(music);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentMusic) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
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
            <span className="text-3xl">🎵</span>
            <h1 className="text-2xl font-bold text-gray-800">Müzik Dinleme Odası</h1>
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
        {/* Current Music Player */}
        {currentMusic && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="text-6xl">{currentMusic.thumbnail}</div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{currentMusic.title}</h2>
                <p className="text-gray-600">{currentMusic.artist}</p>
                <p className="text-sm text-gray-500">{currentMusic.description}</p>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleStop}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    ⏹️
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-6"
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={currentMusic.audioUrl}
              preload="metadata"
            />
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
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                } shadow-md transition-all duration-200`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMusic.map((music) => (
            <div
              key={music.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                currentMusic?.id === music.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleMusicSelect(music)}
            >
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2 relative">
                    {music.thumbnail}
                    {currentMusic?.id === music.id && isPlaying && (
                      <div className="absolute -top-1 -right-1 text-green-500 text-lg animate-pulse">
                        🎵
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{music.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">{music.artist}</p>
                  <p className="text-gray-500 text-xs mb-3">{music.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱️ {music.duration}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {music.ageGroup} yaş
                  </span>
                </div>

                <div className="text-center">
                  <Button className={`${
                    currentMusic?.id === music.id && isPlaying
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white w-full`}>
                    {currentMusic?.id === music.id && isPlaying ? '⏸️ Duraklat' : '▶️ Çal'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMusic.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Bu kategoride müzik bulunamadı</h3>
            <p className="text-gray-500">Başka bir kategori seçmeyi deneyin</p>
          </div>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <GameHelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          gameType="music-listening"
          gameName="Müzik Dinleme Odası"
        />
      )}
    </div>
  );
}
