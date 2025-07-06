'use client';

import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useElevenLabs } from '@/lib/elevenlabs';

// Türk alfabesi harfleri - 29 harf
const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

// Sesli harfler - farklı renk için
const VOWELS = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];

interface SingleLetterPlayerProps {
  /** Başlangıçta seçili harf (opsiyonel) */
  initialLetter?: string;
  /** Harf büyüklüğü */
  size?: 'small' | 'medium' | 'large';
  /** Otomatik oynatma aktif mi */
  autoPlay?: boolean;
  /** Callback: Harf değiştiğinde */
  onLetterChange?: (letter: string) => void;
  /** Callback: Sesli harf seçildiğinde */
  onVowelSelected?: (letter: string) => void;
}

export default function SingleLetterPlayer({
  initialLetter = 'A',
  size = 'medium',
  autoPlay = false,
  onLetterChange,
  onVowelSelected
}: SingleLetterPlayerProps) {
  const { speak, stopCurrentAudio } = useElevenLabs();
  
  const [selectedLetter, setSelectedLetter] = useState(initialLetter);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastPlayedLetter, setLastPlayedLetter] = useState<string | null>(null);

  // Harf oynatma fonksiyonu
  const playLetter = useCallback(async (letter: string) => {
    try {
      setIsPlaying(true);
      setLastPlayedLetter(letter);
      
      // Önceki sesi durdur
      stopCurrentAudio();
      
      // Harfi seslendir (küçük harfle çünkü ses dosyaları küçük harf)
      await speak(letter.toLowerCase(), 'letter');
      
    } catch (error) {
      console.warn(`Harf seslendirme hatası: ${letter}`, error);
    } finally {
      setIsPlaying(false);
    }
  }, [speak, stopCurrentAudio]);

  // Harf seçimi ve oynatma
  const handleLetterSelect = useCallback(async (letter: string) => {
    setSelectedLetter(letter);
    
    // Callback'leri çağır
    onLetterChange?.(letter);
    if (VOWELS.includes(letter)) {
      onVowelSelected?.(letter);
    }
    
    // Otomatik oynat veya manuel tetikleme
    if (autoPlay) {
      await playLetter(letter);
    }
  }, [autoPlay, playLetter, onLetterChange, onVowelSelected]);

  // Manuel oynatma butonu
  const handlePlayClick = useCallback(async () => {
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
    } else {
      await playLetter(selectedLetter);
    }
  }, [selectedLetter, isPlaying, playLetter, stopCurrentAudio]);

  // Stil boyutları
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          grid: 'grid-cols-6 gap-2',
          button: 'w-10 h-10 text-sm',
          playButton: 'w-8 h-8',
          icon: 'w-4 h-4'
        };
      case 'large':
        return {
          grid: 'grid-cols-5 gap-4',
          button: 'w-16 h-16 text-2xl',
          playButton: 'w-12 h-12',
          icon: 'w-6 h-6'
        };
      default: // medium
        return {
          grid: 'grid-cols-6 gap-3',
          button: 'w-12 h-12 text-lg',
          playButton: 'w-10 h-10',
          icon: 'w-5 h-5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            Tek Harf Oynatıcı
          </h2>
          {selectedLetter && (
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-lg">
              <span className="text-lg font-bold text-purple-800">
                {selectedLetter}
              </span>
              {VOWELS.includes(selectedLetter) && (
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded">
                  Sesli
                </span>
              )}
            </div>
          )}
        </div>

        {/* Oynatma kontrolü */}
        <button
          onClick={handlePlayClick}
          disabled={!selectedLetter}
          className={`
            ${sizeClasses.playButton} 
            flex items-center justify-center rounded-full
            transition-all duration-200 shadow-md
            ${isPlaying 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
            }
            ${!selectedLetter ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          aria-label={isPlaying ? `${selectedLetter} harfini durdur` : `${selectedLetter} harfini oynat`}
        >
          {isPlaying ? (
            <Loader2 className={`${sizeClasses.icon} animate-spin`} />
          ) : (
            <Volume2 className={sizeClasses.icon} />
          )}
        </button>
      </div>

      {/* Alfabe Grid */}
      <div className={`grid ${sizeClasses.grid}`}>
        {TURKISH_ALPHABET.map((letter) => {
          const isVowel = VOWELS.includes(letter);
          const isSelected = selectedLetter === letter;
          const wasLastPlayed = lastPlayedLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => handleLetterSelect(letter)}
              className={`
                ${sizeClasses.button}
                font-bold rounded-lg transition-all duration-200
                flex items-center justify-center
                transform hover:scale-105 active:scale-95
                shadow-md hover:shadow-lg
                
                ${isSelected 
                  ? isVowel 
                    ? 'bg-purple-500 text-white border-2 border-purple-300' 
                    : 'bg-blue-500 text-white border-2 border-blue-300'
                  : isVowel 
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
                
                ${wasLastPlayed && !isSelected 
                  ? 'ring-2 ring-green-400 ring-opacity-50' 
                  : ''
                }
              `}
              aria-label={`${letter} harfi ${isVowel ? '(sesli harf)' : '(sessiz harf)'}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Bilgi paneli */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Sesli Harfler ({VOWELS.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Sessiz Harfler ({TURKISH_ALPHABET.length - VOWELS.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-600" />
            <span>
              {selectedLetter 
                ? `Seçili: ${selectedLetter}` 
                : 'Harf seçin'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Kullanım talimatları */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Bir harfe tıklayın {autoPlay ? '(otomatik oynar)' : 'sonra ▶️ butonuna basın'}
      </div>
    </div>
  );
} 