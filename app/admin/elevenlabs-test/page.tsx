'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useElevenLabs } from '@/lib/elevenlabs';

// Types for ElevenLabs admin test page
interface VoiceInfo {
  id: string;
  name: string;
  description: string;
  language?: string;
  gender?: 'male' | 'female' | 'unknown';
  category?: string;
  isVerified?: boolean;
  isNew?: boolean; // Yeni eklenen voice'ları işaretle
}

interface VoiceTestResult {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  type: 'letter' | 'word' | 'sentence' | 'celebration';
  duration?: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

interface ElevenLabsStatus {
  apiKeyConfigured: boolean;
  sdkInitialized: boolean;
  lastTestSuccess: boolean;
  userInfo?: {
    name: string;
    email: string;
    tier: string;
  };
}

interface NewVoiceData {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  isVerified: boolean;
  labels: { [key: string]: string };
}

export default function ElevenLabsTestPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('');
  const [testType, setTestType] = useState<'letter' | 'word' | 'sentence' | 'celebration'>('letter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState<VoiceTestResult[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [voiceId, setVoiceId] = useState('');
  const [apiStatus, setApiStatus] = useState<ElevenLabsStatus | null>(null);
  const [newVoices, setNewVoices] = useState<NewVoiceData[]>([]);
  const [loadingNewVoices, setLoadingNewVoices] = useState(false);
  const [showNewVoices, setShowNewVoices] = useState(false);
  
  // YENİ: Ses dosyası kontrol sistemi state'leri
  const [audioFileStatus, setAudioFileStatus] = useState<{
    totalFiles: number;
    existingFiles: number;
    missingFiles: string[];
    checkInProgress: boolean;
    lastCheck?: Date;
  }>({
    totalFiles: 0,
    existingFiles: 0,
    missingFiles: [],
    checkInProgress: false
  });
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [creatingMissingFiles, setCreatingMissingFiles] = useState(false);

  const { speak, getVoices, testVoice, getApiStatus, getTestTexts } = useElevenLabs();

  // 5 Seçilmiş Türkçe Ses Sistemi
  const SELECTED_TURKISH_VOICES = [
    {
      id: 'jbJMQWv1eS4YjQ6PCcn6',
      name: 'Gülsu',
      slug: 'gulsu',
      gender: 'female',
      description: 'Genç Türk kadını, enerjik ve samimi ses. Hikayeler ve kitaplar için mükemmel.'
    },
    {
      id: 'mBUB5zYuPwfVE6DTcEjf', 
      name: 'Eda Atlas',
      slug: 'eda-atlas',
      gender: 'female',
      description: 'Genç, parlak Türk kadını sesi. Kurumsal, radyo ve TV reklamları için mükemmel seçim.'
    },
    {
      id: 'eUUtjbi66JcWz3T4Gvvo',
      name: 'Ayça',
      slug: 'ayca', 
      gender: 'female',
      description: 'Dinamik genç kadın sesi. Anlatıcılar ve motivasyonel konuşmalar için uygun.'
    },
    {
      id: 'V6TFTAE0gaN8LtBwl70x',
      name: 'Yusuf Suratlı',
      slug: 'yusuf-suratli',
      gender: 'male', 
      description: 'Parlak, genç yetişkin erkek sesi. Anlatıcı, konuşmacı, kitap seslendirme için mükemmel.'
    },
    {
      id: '9GYMX9eMWSq1yjiwXb7B',
      name: 'Sermin',
      slug: 'sermin',
      gender: 'female',
      description: 'Orijinal, akıcı ve vurgulu Türkçe kadın sesi.'
    }
  ];

  const [selectedVoice, setSelectedVoice] = useState(SELECTED_TURKISH_VOICES[0]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Sesler filtreleme logic'i - duplicate'ları da filtrele
  const filteredVoices = useMemo(() => {
    let filtered = voices;
    
    // Gender filter uygula
    if (genderFilter !== 'all') {
      filtered = filtered.filter(voice => voice.gender === genderFilter);
    }
    
    // Duplicate voice'ları filtrele - unique ID kontrolü
    const uniqueVoices = [];
    const seenIds = new Set();
    
    for (const voice of filtered) {
      if (!seenIds.has(voice.id)) {
        uniqueVoices.push(voice);
        seenIds.add(voice.id);
      } else {
        console.warn(`⚠️ Filtering duplicate voice: ${voice.name} (${voice.id})`);
      }
    }
    
    console.log(`🔍 Filtered voices: ${voices.length} → ${filtered.length} → ${uniqueVoices.length} (after duplicate removal)`);
    
    return uniqueVoices;
  }, [voices, genderFilter]);

  // Voice dropdown rendering with unique keys
  const renderVoiceOption = (voice: VoiceInfo, index: number) => {
    // Voice ismini format et - fallback kullan
    const voiceName = voice.name || `Voice_${voice.id.slice(0, 8)}`;
    const isNewVoice = voice.isNew || false;
    const genderIcon = voice.gender === 'male' ? '👨' : voice.gender === 'female' ? '👩' : '🎤';
    const newIndicator = isNewVoice ? '🆕 ' : '';
    const description = voice.description || 'Ses açıklaması mevcut değil';
    
    // Unique key generator for extra safety
    const uniqueKey = `${voice.id}-${index}`;
    
    return (
      <option key={uniqueKey} value={voice.id}>
        {newIndicator}{genderIcon} {voiceName} - {description}
      </option>
    );
  };

  // Get test text suggestions based on type
  const getTestSuggestions = () => {
    const testTexts = getTestTexts();
    return testTexts[testType] || [];
  };

  // Update voice selection when filter changes
  useEffect(() => {
    if (voices.length > 0) {
      const filtered = filteredVoices;
      if (filtered.length > 0 && (!voiceId || !filtered.find(v => v.id === voiceId))) {
        setVoiceId(filtered[0].id);
      }
    }
  }, [voices, genderFilter, filteredVoices, voiceId]);

  useEffect(() => {
    loadVoices();
    loadApiStatus();
  }, []);

  const loadVoices = useCallback(async () => {
    try {
      console.log('🔄 Loading voices...');
      const voiceList = await getVoices();
      console.log('📥 Raw voice data:', voiceList); // Debug log
      
      // getVoices now returns an array directly
      if (Array.isArray(voiceList) && voiceList.length > 0) {
        // Voice isimlerini kontrol et ve format et
        const formattedVoices = voiceList.map(voice => ({
          ...voice,
          name: voice.name || `Voice_${voice.id.slice(0, 8)}`, // Fallback name
          description: voice.description || 'Ses açıklaması mevcut değil',
          gender: voice.gender || 'unknown',
          isNew: voice.isNew || false
        }));
        
        console.log('✅ Formatted voices:', formattedVoices);
        console.log(`📊 Voice statistics:`, {
          total: formattedVoices.length,
          male: formattedVoices.filter(v => v.gender === 'male').length,
          female: formattedVoices.filter(v => v.gender === 'female').length,
          new: formattedVoices.filter(v => v.isNew).length
        });
        
        setVoices(formattedVoices);
        setVoiceId(formattedVoices[0].id);
        console.log('🎯 Voice selection updated:', formattedVoices[0].name);
      } else {
        console.warn('⚠️ No voices found in response:', voiceList);
        setVoices([]); // Fallback to empty array
        setError('Ses listesi boş. API anahtarını kontrol edin veya "Voice Bilgilerini Çek" butonunu kullanın.');
      }
    } catch (err) {
      console.error('❌ Voices loading error:', err);
      setVoices([]); // Ensure voices is always an array
      setError('Ses listesi yüklenirken hata oluştu. API bağlantısını kontrol edin.');
    }
  }, []);

  const loadApiStatus = useCallback(async () => {
    try {
      const status = await getApiStatus();
      setApiStatus(status);
    } catch (err) {
      console.error('API status loading error:', err);
    }
  }, []);

  // Yeni voice'ları ElevenLabs API'den çek
  const fetchNewVoices = async () => {
    setLoadingNewVoices(true);
    setError('');
    
    try {
      console.log('🔍 Fetching new voices from ElevenLabs API...');
      const response = await fetch('/api/speech/voices');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📥 New voices API response:', data);
      
      if (data.success && data.newVoices && Array.isArray(data.newVoices)) {
        // Voice isimlerini format et ve fallback ekle
        const formattedNewVoices = data.newVoices.map((voice: any) => ({
          id: voice.id,
          name: voice.name || voice.voice_name || `NewVoice_${voice.id.slice(0, 8)}`, // Multiple fallbacks
          description: voice.description || 'Yeni ElevenLabs voice',
          category: voice.category || 'generated',
          language: voice.language || 'tr',
          isVerified: voice.isVerified || false,
          labels: voice.labels || {},
          isNew: true
        }));
        
        console.log(`✅ Found ${formattedNewVoices.length} new voices:`, formattedNewVoices);
        
        setNewVoices(formattedNewVoices);
        setShowNewVoices(true);
        
        // Yeni voice'ları main voice listesine de ekle
        const updatedVoices = [...voices];
        const existingIds = new Set(voices.map(v => v.id));
        
        formattedNewVoices.forEach((newVoice: any) => {
          const exists = existingIds.has(newVoice.id);
          if (!exists) {
            updatedVoices.push({
              id: newVoice.id,
              name: newVoice.name,
              description: newVoice.description,
              language: newVoice.language,
              gender: detectGenderFromName(newVoice.name),
              category: newVoice.category,
              isVerified: newVoice.isVerified,
              isNew: true
            });
            existingIds.add(newVoice.id);
            console.log(`➕ Added unique voice to main list: ${newVoice.name} (${newVoice.id})`);
          } else {
            console.log(`⚠️ Skipping duplicate voice in main list: ${newVoice.name} (${newVoice.id})`);
          }
        });
        
        setVoices(updatedVoices);
        console.log(`🔄 Updated main voice list: ${voices.length} → ${updatedVoices.length} voices`);
        
      } else {
        console.warn('⚠️ No new voices found or invalid response format');
        setNewVoices([]);
        setShowNewVoices(true);
        setError('Yeni voice bulunamadı. Voice ID\'leri geçerli mi kontrol edin.');
      }
      
    } catch (err) {
      console.error('❌ Error fetching new voices:', err);
      setError(`Yeni voice'lar yüklenirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      setNewVoices([]);
      setShowNewVoices(true);
    } finally {
      setLoadingNewVoices(false);
    }
  };

  // Gender detection helper function (moved outside the main function)
  const detectGenderFromName = (name: string): 'male' | 'female' | 'unknown' => {
    const maleNames = ['adam', 'josh', 'antoni', 'daniel', 'ethan', 'marcus', 'david', 'mike', 'john'];
    const femaleNames = ['bella', 'rachel', 'domi', 'elli', 'sarah', 'alice', 'anna', 'emma', 'sophia'];
    
    const lowerName = name.toLowerCase();
    
    if (maleNames.some(male => lowerName.includes(male))) return 'male';
    if (femaleNames.some(female => lowerName.includes(female))) return 'female';
    
    return 'unknown';
  };

  // Belirli bir voice'u test et (yeni voice'lar için)
  const testNewVoice = async (newVoice: NewVoiceData) => {
    setLoading(true);
    setError('');
    setIsPlaying(true);

    const testTexts = {
      letter: 'A',
      word: 'merhaba',
      sentence: 'Bu yeni bir sestir.',
      celebration: 'Harika! Çok güzel!'
    };

    const testText = testTexts[testType];

    try {
      console.log(`🧪 Testing new voice: ${newVoice.name} (${newVoice.id})`);
      
      // Ses çalma testi
      await speak(testText, testType, newVoice.id);
      
      // Test sonucu kaydet
      const formattedResult: VoiceTestResult = {
        id: Date.now().toString(),
        text: testText,
        voiceId: newVoice.id,
        voiceName: `${newVoice.name} (YENİ)`,
        type: testType,
        duration: 0,
        success: true,
        timestamp: new Date()
      };
      
      setTestResults(prev => [formattedResult, ...prev.slice(0, 9)]);
      
    } catch (err) {
      console.error('New voice test error:', err);
      setError(`Yeni voice test hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      
      const failedResult: VoiceTestResult = {
        id: Date.now().toString(),
        text: testText,
        voiceId: newVoice.id,
        voiceName: `${newVoice.name} (YENİ)`,
        type: testType,
        duration: 0,
        success: false,
        error: err instanceof Error ? err.message : 'Bilinmeyen hata',
        timestamp: new Date()
      };
      
      setTestResults(prev => [failedResult, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
      setIsPlaying(false);
    }
  };

  // Geliştirilmiş test fonksiyonu - seçilen ses ile
  const handleTestVoice = async (text: string, contentType: string = 'sentence') => {
    if (!selectedVoice) return;
    
    const testKey = `${selectedVoice.id}-${contentType}`;
    
    try {
      setCurrentlyPlaying(testKey);
      console.log(`🎤 Testing voice: ${selectedVoice.name} (${selectedVoice.gender})`);
      console.log(`📝 Text: "${text}"`);
      console.log(`🎯 Content Type: ${contentType}`);
      
      const result = await testVoice(
        text,
        selectedVoice.id,
        contentType as 'letter' | 'word' | 'sentence' | 'celebration',
        {
          stability: contentType === 'letter' ? 0.9 : 0.7,
          similarityBoost: contentType === 'letter' ? 0.9 : 0.8,
          style: contentType === 'celebration' ? 0.7 : 0.4,
          useSpeakerBoost: true
        }
      );
      
      if (result.success) {
        console.log(`✅ Successfully played with ${selectedVoice.name}`);
      } else {
        console.error(`❌ Error with ${selectedVoice.name}:`, result.error);
      }
    } catch (error) {
      console.error(`💥 Test failed for ${selectedVoice.name}:`, error);
    } finally {
      setCurrentlyPlaying(null);
    }
  };

  const handleTest = async () => {
    if (!testText.trim()) {
      setError('Lütfen test metni girin');
      return;
    }

    setLoading(true);
    setError('');
    setIsPlaying(true);

    try {
      // Ses çalma testi
      await speak(testText, testType, voiceId);
      
      // Detaylı test sonucu
      const testResult = await testVoice(testText, voiceId, testType);
      
      // Voice ismini düzgün format et
      const selectedVoice = voices.find(v => v.id === voiceId);
      const voiceName = selectedVoice?.name || `Voice_${voiceId.slice(0, 8)}`;
      const isNewVoice = selectedVoice?.isNew || false;
      const formattedVoiceName = isNewVoice ? `🆕 ${voiceName}` : voiceName;
      
      // Create a properly formatted test result
      const formattedResult: VoiceTestResult = {
        id: Date.now().toString(),
        text: testText,
        voiceId: voiceId,
        voiceName: formattedVoiceName,
        type: testType,
        duration: testResult.duration || 0,
        success: testResult.success,
        error: testResult.error,
        timestamp: new Date()
      };
      
      setTestResults(prev => [formattedResult, ...prev.slice(0, 9)]); // Son 10 test sonucu
      
    } catch (err) {
      setError(`Test hatası: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      console.error('Test error:', err);
      
      // Voice ismini düzgün format et (hata durumu için)
      const selectedVoice = voices.find(v => v.id === voiceId);
      const voiceName = selectedVoice?.name || `Voice_${voiceId.slice(0, 8)}`;
      const isNewVoice = selectedVoice?.isNew || false;
      const formattedVoiceName = isNewVoice ? `🆕 ${voiceName}` : voiceName;
      
      // Add failed test result
      const failedResult: VoiceTestResult = {
        id: Date.now().toString(),
        text: testText,
        voiceId: voiceId,
        voiceName: formattedVoiceName,
        type: testType,
        duration: 0,
        success: false,
        error: err instanceof Error ? err.message : 'Bilinmeyen hata',
        timestamp: new Date()
      };
      
      setTestResults(prev => [failedResult, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
      setIsPlaying(false);
    }
  };

  const testTexts = getTestTexts();

  // YENİ: Ses dosyası varlık kontrolü fonksiyonları
  const checkAudioFiles = async () => {
    setAudioFileStatus(prev => ({ ...prev, checkInProgress: true }));
    
    try {
      // Kontrol edilecek kritik ses dosyaları
      const criticalAudioFiles = [
        // Ana sayfam hoş geldin mesajları
        '/audio/sentences/hosgeldin-mesaji.mp3',
        '/audio/sentences/alfabe-hosgeldin.mp3',
        
        // Türkçe harfler (29 harf)
        '/audio/letters/a.mp3', '/audio/letters/b.mp3', '/audio/letters/c.mp3',
        '/audio/letters/ch.mp3', '/audio/letters/d.mp3', '/audio/letters/e.mp3',
        '/audio/letters/f.mp3', '/audio/letters/g.mp3', '/audio/letters/gh.mp3',
        '/audio/letters/h.mp3', '/audio/letters/ii.mp3', '/audio/letters/i.mp3',
        '/audio/letters/j.mp3', '/audio/letters/k.mp3', '/audio/letters/l.mp3',
        '/audio/letters/m.mp3', '/audio/letters/n.mp3', '/audio/letters/o.mp3',
        '/audio/letters/oo.mp3', '/audio/letters/p.mp3', '/audio/letters/r.mp3',
        '/audio/letters/s.mp3', '/audio/letters/sh.mp3', '/audio/letters/t.mp3',
        '/audio/letters/u.mp3', '/audio/letters/uu.mp3', '/audio/letters/v.mp3',
        '/audio/letters/y.mp3', '/audio/letters/z.mp3',
        
        // Temel kutlama mesajları
        '/audio/celebrations/aferin-sana.mp3',
        '/audio/celebrations/bravo.mp3',
        '/audio/celebrations/cok-basarilisin-harika-is.mp3',
        '/audio/celebrations/harikasin-cok-guzel.mp3',
        '/audio/celebrations/mukemmel-devam-et.mp3',
        
        // Okuryazarlık modülü hece dosyaları
        '/audio/words/bu-hece-el.mp3',
        '/audio/words/bu-hece-al.mp3',
        '/audio/words/bu-hece-ol.mp3',
        '/audio/words/bu-hece-ul.mp3',
        '/audio/words/bu-hece-il.mp3',
        
        // Temel kelimeler
        '/audio/words/elma.mp3',
        '/audio/words/anne.mp3',
        '/audio/words/baba.mp3',
        '/audio/words/su.mp3',
        '/audio/words/ekmek.mp3'
      ];
      
      const missingFiles: string[] = [];
      const existingFiles: string[] = [];
      
      // Her dosyanın varlığını kontrol et
      for (const filePath of criticalAudioFiles) {
        try {
          const response = await fetch(filePath, { method: 'HEAD' });
          if (response.ok) {
            existingFiles.push(filePath);
          } else {
            missingFiles.push(filePath);
          }
        } catch (error) {
          missingFiles.push(filePath);
        }
      }
      
      setAudioFileStatus({
        totalFiles: criticalAudioFiles.length,
        existingFiles: existingFiles.length,
        missingFiles,
        checkInProgress: false,
        lastCheck: new Date()
      });
      
      console.log('📊 Audio File Status:', {
        total: criticalAudioFiles.length,
        existing: existingFiles.length,
        missing: missingFiles.length,
        missingList: missingFiles
      });
      
    } catch (error) {
      console.error('Error checking audio files:', error);
      setAudioFileStatus(prev => ({ ...prev, checkInProgress: false }));
    }
  };

  const createMissingAudioFiles = async () => {
    if (audioFileStatus.missingFiles.length === 0) {
      alert('Eksik ses dosyası bulunamadı!');
      return;
    }
    
    setCreatingMissingFiles(true);
    
    try {
      console.log(`🔄 ${audioFileStatus.missingFiles.length} eksik dosya için sıralı oluşturma başlatılıyor...`);
      
      const results = [];
      
      // Sıralı işlem için for loop kullan (paralel yerine)
      for (let i = 0; i < audioFileStatus.missingFiles.length; i++) {
        const filePath = audioFileStatus.missingFiles[i];
        const filename = filePath.split('/').pop()?.replace('.mp3', '') || '';
        
        // Dosya tipini belirle
        let contentType: 'letter' | 'word' | 'sentence' | 'celebration' = 'sentence';
        let text = filename;
        
        if (filePath.includes('/letters/')) {
          contentType = 'letter';
          // Harf mapping
          const letterMappings: { [key: string]: string } = {
            'ch': 'Ç', 'gh': 'Ğ', 'ii': 'I', 'i': 'İ',
            'oo': 'Ö', 'sh': 'Ş', 'uu': 'Ü'
          };
          text = letterMappings[filename] || filename.toUpperCase();
        } else if (filePath.includes('/words/')) {
          contentType = 'word';
          if (filename.startsWith('bu-hece-')) {
            const vowel = filename.replace('bu-hece-', '');
            text = `Bu hece ${vowel}... ${vowel}!`;
          }
        } else if (filePath.includes('/celebrations/')) {
          contentType = 'celebration';
          const celebrationMappings: { [key: string]: string } = {
            'aferin-sana': 'Aferin sana!',
            'bravo': 'Bravo!',
            'cok-basarilisin-harika-is': 'Çok başarılısın! Harika iş!',
            'harikasin-cok-guzel': 'Harikasın! Çok güzel yaptın!',
            'mukemmel-devam-et': 'Mükemmel! Devam et!'
          };
          text = celebrationMappings[filename] || filename.replace(/-/g, ' ');
        } else if (filePath.includes('/sentences/')) {
          const sentenceMappings: { [key: string]: string } = {
            'hosgeldin-mesaji': 'Kıvılcım platformuna hoş geldin!',
            'alfabe-hosgeldin': 'Alfabe okuma modülüne hoş geldin! 29 harflik Türk alfabesini birlikte öğreneceğiz.'
          };
          text = sentenceMappings[filename] || filename.replace(/-/g, ' ');
        }
        
        console.log(`🔄 [${i+1}/${audioFileStatus.missingFiles.length}] Creating: ${text} (${contentType}) -> ${filePath}`);
        
        try {
          // ElevenLabs API ile ses oluştur
          const response = await fetch('/api/speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              type: contentType,
              voiceId: 'jbJMQWv1eS4YjQ6PCcn6', // Gülsu voice
              language: 'tr'
            })
          });
          
          if (response.ok) {
            console.log(`✅ [${i+1}/${audioFileStatus.missingFiles.length}] Created: ${filePath}`);
            results.push({ filePath, success: true });
          } else {
            const errorText = await response.text();
            console.error(`❌ [${i+1}/${audioFileStatus.missingFiles.length}] Failed: ${filePath} - ${errorText}`);
            results.push({ filePath, success: false, error: errorText });
          }
        } catch (error) {
          console.error(`❌ [${i+1}/${audioFileStatus.missingFiles.length}] Error: ${filePath}`, error);
          results.push({ filePath, success: false, error: String(error) });
        }
        
        // Rate limiting için bekleme (son dosya değilse)
        if (i < audioFileStatus.missingFiles.length - 1) {
          console.log(`⏳ Rate limiting için 3 saniye bekleniyor...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      alert(`Ses dosyası oluşturma tamamlandı!\n✅ Başarılı: ${successful}\n❌ Başarısız: ${failed}\n\n${failed > 0 ? 'Başarısız olanlar için lütfen birkaç dakika bekleyip tekrar deneyin.' : 'Tüm dosyalar başarıyla oluşturuldu!'}`);
      
      // Kontrol tekrar çalıştır
      setTimeout(() => checkAudioFiles(), 2000);
      
    } catch (error) {
      console.error('Error creating missing audio files:', error);
      alert('Ses dosyası oluşturma hatası: ' + error);
    } finally {
      setCreatingMissingFiles(false);
    }
  };

  const testAudioQuality = async (filePath: string) => {
    try {
      const audio = new Audio(filePath);
      
      return new Promise((resolve) => {
        audio.oncanplaythrough = () => {
          resolve({
            filePath,
            duration: audio.duration,
            canPlay: true,
            quality: audio.duration > 0 ? 'good' : 'poor'
          });
        };
        
        audio.onerror = () => {
          resolve({
            filePath,
            duration: 0,
            canPlay: false,
            quality: 'error'
          });
        };
        
        audio.load();
      });
      
    } catch (error) {
      return {
        filePath,
        duration: 0,
        canPlay: false,
        quality: 'error',
        error: error
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎙️ ElevenLabs API Test Merkezi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Resmi SDK ile gelişmiş ses testi ve analiz
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <a 
              href="https://elevenlabs.io/docs/api-reference/introduction" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              📚 ElevenLabs API Referansı
            </a>
          </div>
        </div>

        {/* YENİ: Ses Dosyası Kontrol Paneli */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                🎵 Ses Dosyası Kontrol Sistemi
                {audioFileStatus.lastCheck && (
                  <span className="text-sm text-gray-500 font-normal">
                    (Son kontrol: {audioFileStatus.lastCheck.toLocaleTimeString()})
                  </span>
                )}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Kritik ses dosyalarının varlığını kontrol edin ve eksikleri otomatik oluşturun
              </p>
            </div>
            <button
              onClick={() => setShowAudioControls(!showAudioControls)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              {showAudioControls ? '🔼 Gizle' : '🔽 Göster'}
            </button>
          </div>

          {showAudioControls && (
            <div className="space-y-6">
              {/* Ses Dosyası İstatistikleri */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-700">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Toplam Dosya</div>
                  <div className="text-2xl font-bold text-green-600">
                    {audioFileStatus.totalFiles}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Mevcut</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {audioFileStatus.existingFiles}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-200 dark:border-red-700">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Eksik</div>
                  <div className="text-2xl font-bold text-red-600">
                    {audioFileStatus.missingFiles.length}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Başarı Oranı</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {audioFileStatus.totalFiles > 0 
                      ? Math.round((audioFileStatus.existingFiles / audioFileStatus.totalFiles) * 100)
                      : 0}%
                  </div>
                </div>
              </div>

              {/* Kontrol Butonları */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={checkAudioFiles}
                  disabled={audioFileStatus.checkInProgress}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  {audioFileStatus.checkInProgress ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Kontrol Ediliyor...
                    </>
                  ) : (
                    <>
                      🔍 Ses Dosyalarını Kontrol Et
                    </>
                  )}
                </button>

                <button
                  onClick={createMissingAudioFiles}
                  disabled={creatingMissingFiles || audioFileStatus.missingFiles.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  {creatingMissingFiles ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      ⚡ Eksik Dosyaları Oluştur ({audioFileStatus.missingFiles.length})
                    </>
                  )}
                </button>
              </div>

              {/* Eksik Dosyalar Listesi */}
              {audioFileStatus.missingFiles.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    ❌ Eksik Ses Dosyaları ({audioFileStatus.missingFiles.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {audioFileStatus.missingFiles.map((filePath, index) => {
                        const filename = filePath.split('/').pop();
                        const category = filePath.includes('/letters/') ? '🔤' : 
                                       filePath.includes('/words/') ? '📝' :
                                       filePath.includes('/sentences/') ? '💬' :
                                       filePath.includes('/celebrations/') ? '🎉' : '📁';
                        
                        return (
                          <div key={index} className="text-sm font-mono text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 rounded px-2 py-1 border">
                            {category} {filename}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Başarı Mesajı */}
              {audioFileStatus.existingFiles > 0 && audioFileStatus.missingFiles.length === 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    ✅ Tüm Kritik Ses Dosyaları Mevcut!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {audioFileStatus.existingFiles} adet ses dosyası başarıyla doğrulandı. Platform tam kapasiteyle çalışıyor.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* API Status Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            📊 API Durumu
          </h2>
          {apiStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">API Key</div>
                <div className={`text-lg font-semibold ${apiStatus.apiKeyConfigured ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus.apiKeyConfigured ? '✅ Yapılandırılmış' : '❌ Yapılandırılmamış'}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">SDK</div>
                <div className={`text-lg font-semibold ${apiStatus.sdkInitialized ? 'text-green-600' : 'text-yellow-600'}`}>
                  {apiStatus.sdkInitialized ? '✅ Başlatılmış' : '⚠️ Fallback Mode'}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">Son Test</div>
                <div className={`text-lg font-semibold ${apiStatus.lastTestSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus.lastTestSuccess ? '✅ Başarılı' : '❌ Başarısız'}
                </div>
              </div>
            </div>
          )}
          
          {apiStatus?.userInfo && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                👤 Kullanıcı Bilgileri
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <div>Ad: {apiStatus.userInfo.name}</div>
                <div>Email: {apiStatus.userInfo.email}</div>
                <div>Tier: {apiStatus.userInfo.tier}</div>
              </div>
            </div>
          )}
        </div>

        {/* 🎙️ Seçilmiş Türkçe Sesler - Yeni Bölüm */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              🎭
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                5 Seçilmiş Türkçe Ses Sistemi
              </h2>
              <p className="text-purple-600 dark:text-purple-300 text-sm">
                Her ses için ayrı klasörlerde MP3 dosyaları oluşturuldu
              </p>
            </div>
          </div>

          {/* Ses Seçici Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
              🎤 Ses Seçin:
            </label>
            <select
              value={selectedVoice.id}
              onChange={(e) => {
                const voice = SELECTED_TURKISH_VOICES.find(v => v.id === e.target.value);
                if (voice) setSelectedVoice(voice);
              }}
              className="w-full p-3 border border-purple-200 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500"
            >
              {SELECTED_TURKISH_VOICES.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.gender === 'male' ? '👨' : '👩'} {voice.name} ({voice.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Seçilen Ses Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-purple-100 dark:border-purple-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{selectedVoice.gender === 'male' ? '👨' : '👩'}</span>
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-100">
                  {selectedVoice.name}
                </h3>
                <p className="text-purple-600 dark:text-purple-300 text-sm">
                  Voice ID: {selectedVoice.id}
                </p>
              </div>
            </div>
            <p className="text-purple-700 dark:text-purple-200 text-sm">
              {selectedVoice.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded text-xs">
                📁 /voices/{selectedVoice.slug}/
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded text-xs">
                🇹🇷 Turkish
              </span>
            </div>
          </div>

          {/* Türkçe Test Butonları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleTestVoice('A', 'letter')}
              disabled={currentlyPlaying === `${selectedVoice.id}-letter`}
              className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <span className="text-2xl">🔤</span>
              <span className="font-medium">Harf Testi</span>
              <span className="text-xs">"A" harfi</span>
              {currentlyPlaying === `${selectedVoice.id}-letter` && (
                <div className="animate-pulse text-xs">▶️ Çalıyor...</div>
              )}
            </button>

            <button
              onClick={() => handleTestVoice('elma', 'word')}
              disabled={currentlyPlaying === `${selectedVoice.id}-word`}
              className="p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <span className="text-2xl">🍎</span>
              <span className="font-medium">Kelime Testi</span>
              <span className="text-xs">"elma"</span>
              {currentlyPlaying === `${selectedVoice.id}-word` && (
                <div className="animate-pulse text-xs">▶️ Çalıyor...</div>
              )}
            </button>

            <button
              onClick={() => handleTestVoice('Merhaba, nasılsın?', 'sentence')}
              disabled={currentlyPlaying === `${selectedVoice.id}-sentence`}
              className="p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <span className="text-2xl">💬</span>
              <span className="font-medium">Cümle Testi</span>
              <span className="text-xs">Selamlama</span>
              {currentlyPlaying === `${selectedVoice.id}-sentence` && (
                <div className="animate-pulse text-xs">▶️ Çalıyor...</div>
              )}
            </button>

            <button
              onClick={() => handleTestVoice('Harikasın! Çok güzel!', 'celebration')}
              disabled={currentlyPlaying === `${selectedVoice.id}-celebration`}
              className="p-4 bg-pink-100 dark:bg-pink-800 text-pink-700 dark:text-pink-200 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-700 transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <span className="text-2xl">🎉</span>
              <span className="font-medium">Kutlama Testi</span>
              <span className="text-xs">Başarı mesajı</span>
              {currentlyPlaying === `${selectedVoice.id}-celebration` && (
                <div className="animate-pulse text-xs">▶️ Çalıyor...</div>
              )}
            </button>
          </div>

          {/* Dosya Yolu Bilgisi */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              📁 Dosya Yapısı:
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <div>📂 /public/audio/voices/{selectedVoice.slug}/</div>
              <div className="ml-4">├── 📂 letters/ (29 Türk harfi)</div>
              <div className="ml-4">├── 📂 words/ (kelimeler ve heceler)</div>
              <div className="ml-4">├── 📂 sentences/ (yönlendirmeler)</div>
              <div className="ml-4">└── 📂 celebrations/ (kutlama mesajları)</div>
            </div>
          </div>
        </div>

        {/* Test Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            🧪 Ses Testi
          </h2>
          
          <div className="space-y-4">
            {/* Test Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Test Türü
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'letter', label: 'Harf', icon: '🔤', desc: 'Tek harf sesleri' },
                  { value: 'word', label: 'Kelime', icon: '📝', desc: 'Basit kelimeler' },
                  { value: 'sentence', label: 'Cümle', icon: '💬', desc: 'Tam cümleler' },
                  { value: 'celebration', label: 'Kutlama', icon: '🎉', desc: 'Tebrik mesajları' }
                ].map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => setTestType(value as any)}
                    className={`p-3 text-center rounded-lg text-sm font-medium transition-all duration-200 ${
                      testType === value
                        ? 'bg-green-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-50 border border-gray-200'
                    }`}
                  >
                    <div className="text-lg">{icon}</div>
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs opacity-75">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Text with Turkish Examples */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ✏️ Test Metni (Türkçe Karakterler Desteklenir)
              </label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder={`${testType === 'letter' ? 'Örn: Ç, Ğ, Ş' : 
                             testType === 'word' ? 'Örn: çilek, üzüm, ğöl' :
                             testType === 'sentence' ? 'Örn: Türkçe öğrenmek çok güzel.' :
                             'Örn: Aferin sana!'}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
              />
              
              {/* Quick Test Suggestions */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  🚀 Hızlı Test Örnekleri:
                </label>
                <div className="flex flex-wrap gap-2">
                  {getTestSuggestions().slice(0, 8).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setTestText(suggestion)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gender Filter Interface */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                👥 Cinsiyet Filtresi
                <span className="ml-2 text-sm text-gray-600">({filteredVoices.length} ses mevcut)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Tümü', icon: '👥' },
                  { value: 'male', label: 'Erkek', icon: '👨' },
                  { value: 'female', label: 'Bayan', icon: '👩' }
                ].map(({ value, label, icon }) => {
                  const count = value === 'all' ? voices.length : voices.filter(v => v.gender === value).length;
                  return (
                    <button
                      key={value}
                      onClick={() => setGenderFilter(value as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        genderFilter === value
                          ? 'bg-blue-500 text-white shadow-md scale-105'
                          : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {icon} {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Voice Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎤 Ses Seçimi (Türkçe Destekli)
              </label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Ses seçin...</option>
                {filteredVoices.map((voice, index) => renderVoiceOption(voice, index))}
              </select>
              {filteredVoices.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Seçilen filtrede ses bulunamadı.
                </p>
              )}
              
              {/* Voice Statistics */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Toplam: {voices.length} ses
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  👨 Erkek: {voices.filter(v => v.gender === 'male').length}
                </span>
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                  👩 Bayan: {voices.filter(v => v.gender === 'female').length}
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  🆕 Yeni: {voices.filter(v => v.isNew).length}
                </span>
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTest}
              disabled={loading || isPlaying}
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                loading || isPlaying
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {loading ? '⏳ Test Ediliyor...' : isPlaying ? '🔊 Oynatılıyor...' : '🎯 Test Et'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              📈 Test Sonuçları
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Zaman</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Ses</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Tür</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Metin</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Süre</th>
                    <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {testResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.timestamp && result.timestamp instanceof Date 
                          ? result.timestamp.toLocaleTimeString()
                          : 'Unknown Time'
                        }
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.voiceName}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.type}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200 max-w-xs truncate">
                        {result.text}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {result.duration || 0}ms
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.success 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {result.success ? '✅ Başarılı' : '❌ Başarısız'}
                        </span>
                        {result.error && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {result.error}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 