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
            <span className="text-4xl">🎵</span>
            <h1 className="text-3xl font-extrabold text-focus-blue">Müzik Dinleme Odası</h1>
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
        {/* Current Music Player */}
        {currentMusic && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="text-8xl">{currentMusic.thumbnail}</div>
            
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-text-color dark:text-dark-text mb-2">{currentMusic.title}</h2>
              <p className="text-xl font-bold text-gray-600 dark:text-dark-text-secondary mb-1">{currentMusic.artist}</p>
              <p className="text-base font-medium text-gray-500 dark:text-gray-400 mb-6">{currentMusic.description}</p>
              
              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-focus-blue h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleStop}
                  className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-dark-border dark:hover:bg-gray-700 transition-colors"
                  aria-label="Durdur"
                >
                  <span className="text-2xl">⏹️</span>
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center bg-focus-blue text-white hover:bg-blue-600 transition-colors"
                  aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
                >
                  <span className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</span>
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-border p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-xl">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-24 accent-focus-blue"
                />
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

        {/* Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMusic.map((music) => (
            <div
              key={music.id}
              className={`bg-white dark:bg-dark-surface rounded-2xl border-4 transition-all duration-300 cursor-pointer p-6 hover:scale-[1.02] ${
                currentMusic?.id === music.id 
                  ? 'border-focus-blue bg-focus-blue/5' 
                  : 'border-gray-200 dark:border-dark-border hover:border-focus-blue/50'
              }`}
              onClick={() => handleMusicSelect(music)}
            >
              <div className="text-center mb-6 relative">
                <div className="text-6xl mb-4 bg-gray-50 dark:bg-dark-border w-24 h-24 mx-auto rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
                  {music.thumbnail}
                </div>
                {currentMusic?.id === music.id && isPlaying && (
                  <div className="absolute top-0 right-1/4 text-success-green text-3xl animate-bounce">
                    🎵
                  </div>
                )}
                <h3 className="font-extrabold text-xl text-text-color dark:text-dark-text mb-1">{music.title}</h3>
                <p className="font-bold text-gray-600 dark:text-dark-text-secondary text-base">{music.artist}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">⏱️ {music.duration}</span>
                  <span className="bg-focus-blue/10 text-focus-blue border border-focus-blue/20 px-3 py-1 rounded-lg">
                    {music.ageGroup} yaş
                  </span>
                </div>

                <button 
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
                    currentMusic?.id === music.id && isPlaying
                      ? 'bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-300'
                      : 'bg-focus-blue text-white hover:bg-blue-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMusicSelect(music);
                  }}
                >
                  {currentMusic?.id === music.id && isPlaying ? '⏸️ Duraklat' : '▶️ Çal'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMusic.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-200 dark:border-dark-border">
            <div className="text-7xl mb-6 opacity-50">🎵</div>
            <h3 className="text-2xl font-extrabold text-gray-600 dark:text-dark-text-secondary mb-2">Bu kategoride müzik bulunamadı</h3>
            <p className="font-bold text-gray-500 dark:text-gray-400">Başka bir kategori seçmeyi deneyin</p>
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
