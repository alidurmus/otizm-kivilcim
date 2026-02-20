// 🎵 Kıvılcım Platform'da Tek Harf Oynatma Örnekleri

import React, { useState, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

// ✅ 1. EN BASIT KULLANIM - Sadece bir harf oynat
function SimpleLetterExample() {
  const { speak } = useElevenLabs();
  
  const playLetter = async (letter: string) => {
    // Örnek: 'A' harfini oynat
    await speak(letter.toLowerCase(), 'letter');
  };
  
  return (
    <button onClick={() => playLetter('A')}>
      🔤 A Harfini Oynat
    </button>
  );
}

// ✅ 2. DİNAMİK HARF SEÇİMİ - Kullanıcı harfi seçer
function DynamicLetterExample() {
  const { speak } = useElevenLabs();
  const [selectedLetter, setSelectedLetter] = useState('A');
  
  const TURKISH_LETTERS = ['A', 'B', 'C', 'Ç', 'D', 'E', 'F']; // İlk 7 harf
  
  return (
    <div>
      {/* Harf seçimi */}
      <select 
        value={selectedLetter} 
        onChange={(e) => setSelectedLetter(e.target.value)}
      >
        {TURKISH_LETTERS.map(letter => (
          <option key={letter} value={letter}>{letter}</option>
        ))}
      </select>
      
      {/* Seçili harfi oynat */}
      <button onClick={() => speak(selectedLetter.toLowerCase(), 'letter')}>
        🔊 {selectedLetter} Oynat
      </button>
    </div>
  );
}

// ✅ 3. ALFABE OKUMA MODÜLÜNDEKİ MEVCUT KULLANIM
function AlphabetModuleExample() {
  const { speak, stopCurrentAudio } = useElevenLabs();
  
  // Mevcut alfabe modülünden alınmış fonksiyon
  const pronounceLetter = useCallback(async (letter: string) => {
    try {
      // Önceki sesi durdur
      stopCurrentAudio();
      
      // Harfi seslendir (küçük harfle çünkü ses dosyaları küçük harf)
      await speak(letter.toLowerCase(), 'letter');
    } catch (error) {
      console.warn(`Letter pronunciation failed: ${letter}`, error);
    }
  }, [speak, stopCurrentAudio]);

  return (
    <div className="grid grid-cols-6 gap-2">
      {['A', 'B', 'C', 'Ç', 'D', 'E'].map(letter => (
        <button
          key={letter}
          onClick={() => pronounceLetter(letter)}
          className="p-3 bg-blue-100 hover:bg-blue-200 rounded"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

// ✅ 4. SESLI/SESSİZ HARF AYRIMI İLE
function VowelConsonantExample() {
  const { speak } = useElevenLabs();
  
  const VOWELS = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];
  const CONSONANTS = ['B', 'C', 'Ç', 'D', 'F', 'G', 'Ğ', 'H'];
  
  const playLetterWithType = async (letter: string) => {
    const isVowel = VOWELS.includes(letter);
    
    // Önce harfi oynat
    await speak(letter.toLowerCase(), 'letter');
    
    // Sonra tipini söyle
    setTimeout(() => {
      const typeText = isVowel ? 'sesli harf' : 'sessiz harf';
      speak(typeText, 'word');
    }, 1500);
  };
  
  return (
    <div>
      <h3>🟣 Sesli Harfler</h3>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {VOWELS.map(letter => (
          <button
            key={letter}
            onClick={() => playLetterWithType(letter)}
            className="p-2 bg-purple-100 hover:bg-purple-200 rounded"
          >
            {letter}
          </button>
        ))}
      </div>
      
      <h3>🔵 Sessiz Harfler</h3>
      <div className="grid grid-cols-4 gap-2">
        {CONSONANTS.map(letter => (
          <button
            key={letter}
            onClick={() => playLetterWithType(letter)}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

// ✅ 5. SIRA SIRA HARF OYNATMA (Otomatik)
function SequentialLetterExample() {
  const { speak } = useElevenLabs();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const LETTERS = ['A', 'B', 'C', 'Ç', 'D'];
  
  const playSequence = async () => {
    setIsPlaying(true);
    
    for (let i = 0; i < LETTERS.length; i++) {
      setCurrentIndex(i);
      await speak(LETTERS[i].toLowerCase(), 'letter');
      
      // Harfler arası 1 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setIsPlaying(false);
    setCurrentIndex(0);
  };
  
  return (
    <div>
      <button 
        onClick={playSequence}
        disabled={isPlaying}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isPlaying ? '▶️ Oynatılıyor...' : '🎵 Harfleri Sırayla Oynat'}
      </button>
      
      <div className="flex gap-2">
        {LETTERS.map((letter, index) => (
          <div
            key={letter}
            className={`p-3 rounded text-center ${
              index === currentIndex && isPlaying 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎯 KULLANIM ÖZETİ:
/*
1. TEK HARF OYNATMA:
   await speak('a', 'letter');  // 'A' harfi

2. HARF + TİP AÇIKLAMASI:
   await speak('a', 'letter');
   await speak('sesli harf', 'word');

3. MEVCUT ALFABE MODÜLÜNDEKİ KULLANIM:
   /exercise/alphabet-reading sayfasında zaten mevcut!

4. 29 TÜRK HARFİ DESTEĞİ:
   A, B, C, Ç, D, E, F, G, Ğ, H, I, İ, J, K, L, M, N, O, Ö, P, R, S, Ş, T, U, Ü, V, Y, Z

5. SES DOSYALARI:
   /public/audio/letters/ klasöründe tüm harfler mevcut
   a.mp3, b.mp3, ch.mp3 (ç), gh.mp3 (ğ), vs.
*/ 