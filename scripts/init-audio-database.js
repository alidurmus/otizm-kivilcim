/**
 * Ses dosyaları veritabanını başlatma script'i
 * Bu script mevcut statik ses dosyalarını veritabanına kaydeder
 */

const fs = require('fs');
const path = require('path');

// Örnek ses dosyaları verisi
const sampleAudioFiles = [
  // Alfabe harfleri
  {
    title: 'A Harfi',
    filename: 'a.mp3',
    filePath: '/audio/letters/a.mp3',
    category: 'letter',
    module: 'alphabet-reading',
    language: 'tr',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    voiceName: 'Adam',
    duration: 1.2,
    fileSize: 3456,
    description: 'Türk alfabesinin ilk harfi A',
    tags: ['alfabe', 'harf', 'sesli-harf']
  },
  {
    title: 'B Harfi',
    filename: 'b.mp3',
    filePath: '/audio/letters/b.mp3',
    category: 'letter',
    module: 'alphabet-reading',
    language: 'tr',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    voiceName: 'Adam',
    duration: 1.1,
    fileSize: 3234,
    description: 'Türk alfabesinin ikinci harfi B',
    tags: ['alfabe', 'harf', 'sessiz-harf']
  },
  {
    title: 'C Harfi',
    filename: 'c.mp3',
    filePath: '/audio/letters/c.mp3',
    category: 'letter',
    module: 'alphabet-reading',
    language: 'tr',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    voiceName: 'Adam',
    duration: 1.0,
    fileSize: 3102,
    description: 'Türk alfabesinin üçüncü harfi C',
    tags: ['alfabe', 'harf', 'sessiz-harf']
  },

  // Kelimeler
  {
    title: 'Elma Kelimesi',
    filename: 'elma.mp3',
    filePath: '/audio/words/elma.mp3',
    category: 'word',
    module: 'vocabulary',
    language: 'tr',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    voiceName: 'Rachel',
    duration: 1.8,
    fileSize: 5234,
    description: 'Kırmızı meyve - elma kelimesi',
    tags: ['kelime', 'meyve', 'günlük-kelimeler']
  },
  {
    title: 'Araba Kelimesi',
    filename: 'araba.mp3',
    filePath: '/audio/words/araba.mp3',
    category: 'word',
    module: 'vocabulary',
    language: 'tr',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    voiceName: 'Rachel',
    duration: 2.1,
    fileSize: 5867,
    description: 'Ulaşım aracı - araba kelimesi',
    tags: ['kelime', 'araç', 'ulaşım']
  },

  // Cümleler
  {
    title: 'Alfabe Hoş Geldin Mesajı',
    filename: 'alfabe-hosgeldin.mp3',
    filePath: '/audio/sentences/alfabe-hosgeldin.mp3',
    category: 'sentence',
    module: 'alphabet-reading',
    language: 'tr',
    voiceId: 'ErXwobaYiN019PkySvjV',
    voiceName: 'Antoni',
    duration: 5.2,
    fileSize: 15234,
    description: 'Alfabe okuma modülü hoş geldin mesajı',
    tags: ['hoş-geldin', 'alfabe', 'yönlendirme']
  },
  {
    title: 'Matematik Hoş Geldin Mesajı',
    filename: 'matematik-hosgeldin.mp3',
    filePath: '/audio/sentences/matematik-hosgeldin.mp3',
    category: 'sentence',
    module: 'mathematics',
    language: 'tr',
    voiceId: 'ErXwobaYiN019PkySvjV',
    voiceName: 'Antoni',
    duration: 4.8,
    fileSize: 14123,
    description: 'Matematik dünyası modülü hoş geldin mesajı',
    tags: ['hoş-geldin', 'matematik', 'yönlendirme']
  },

  // Kutlamalar
  {
    title: 'Aferin Sana',
    filename: 'aferin-sana.mp3',
    filePath: '/audio/celebrations/aferin-sana.mp3',
    category: 'celebration',
    module: 'general',
    language: 'tr',
    voiceId: 'VR6AewLTigWG4xSOukaG',
    voiceName: 'Josh',
    duration: 2.5,
    fileSize: 7234,
    description: 'Genel başarı kutlama mesajı',
    tags: ['kutlama', 'başarı', 'övgü']
  },
  {
    title: 'Bravo Mükemmel',
    filename: 'bravo-mukemmel.mp3',
    filePath: '/audio/celebrations/bravo-mukemmel.mp3',
    category: 'celebration',
    module: 'general',
    language: 'tr',
    voiceId: 'VR6AewLTigWG4xSOukaG',
    voiceName: 'Josh',
    duration: 2.8,
    fileSize: 8123,
    description: 'Yüksek başarı kutlama mesajı',
    tags: ['kutlama', 'mükemmel', 'başarı']
  },

  // Sayılar (Matematik)
  {
    title: 'Bir Sayısı',
    filename: 'bir.mp3',
    filePath: '/audio/words/bir.mp3',
    category: 'word',
    module: 'mathematics',
    language: 'tr',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    voiceName: 'Rachel',
    duration: 1.3,
    fileSize: 3789,
    description: '1 sayısının Türkçe telaffuzu',
    tags: ['sayı', 'matematik', 'rakam']
  },
  {
    title: 'İki Sayısı',
    filename: 'iki.mp3',
    filePath: '/audio/words/iki.mp3',
    category: 'word',
    module: 'mathematics',
    language: 'tr',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    voiceName: 'Rachel',
    duration: 1.1,
    fileSize: 3456,
    description: '2 sayısının Türkçe telaffuzu',
    tags: ['sayı', 'matematik', 'rakam']
  }
];

// JSON dosyası olarak kaydetme
function saveToJSON() {
  const jsonData = {
    timestamp: new Date().toISOString(),
    audioFiles: sampleAudioFiles.map((file, index) => ({
      id: `audio-${index + 1}`,
      ...file,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    }))
  };

  const outputPath = path.join(__dirname, '../public/data/sample-audio-files.json');
  
  // Klasörü oluştur
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`✅ ${jsonData.audioFiles.length} ses dosyası örneği ${outputPath} dosyasına kaydedildi`);
}

// API test fonksiyonu
async function testAudioAPI() {
  try {
    console.log('🧪 Ses dosyaları API test ediliyor...');
    
    // Node.js'de fetch kullanmak için
    const fetch = (await import('node-fetch')).default;
    
    // Tüm ses dosyalarını getir
    const response = await fetch('http://localhost:3002/api/audio');
    if (response.ok) {
      const audioFiles = await response.json();
      console.log(`✅ API Test Başarılı: ${audioFiles.length} ses dosyası bulundu`);
    } else {
      console.log('❌ API Test Başarısız: API yanıt vermedi');
    }
  } catch (error) {
    console.log('❌ API Test Başarısız:', error.message);
    console.log('💡 Sunucunun çalıştığından emin olun: npm run dev');
  }
}

// Manuel veritabanı init fonksiyonu
function printFirestoreCommands() {
  console.log('\n🔥 Firebase/Firestore için manuel init komutları:');
  console.log('------------------------------------------------------');
  
  sampleAudioFiles.forEach((file, index) => {
    console.log(`
// Ses dosyası ${index + 1}: ${file.title}
await addDoc(collection(db, 'audioFiles'), {
  title: '${file.title}',
  filename: '${file.filename}',
  filePath: '${file.filePath}',
  category: '${file.category}',
  module: '${file.module}',
  language: '${file.language}',
  voiceId: '${file.voiceId}',
  voiceName: '${file.voiceName}',
  duration: ${file.duration},
  fileSize: ${file.fileSize},
  description: '${file.description}',
  tags: ${JSON.stringify(file.tags)},
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  isActive: true
});`);
  });
}

// Script çalıştırma
if (require.main === module) {
  console.log('🎵 Ses Dosyaları Veritabanı Başlatma Script\'i');
  console.log('===============================================\n');
  
  // JSON örnek dosyasını oluştur
  saveToJSON();
  
  // API test et
  setTimeout(testAudioAPI, 1000);
  
  // Firestore komutlarını yazdır
  printFirestoreCommands();
  
  console.log('\n📋 Sonraki Adımlar:');
  console.log('1. Sunucuyu başlat: npm run dev');
  console.log('2. Admin paneline git: http://localhost:3002/admin');
  console.log('3. "🎵 Ses Dosyaları" butonuna tıkla');
  console.log('4. Ses dosyalarını manuel ekle veya Firebase Console kullan');
  console.log('\n✨ Sistem hazır!');
}

module.exports = {
  sampleAudioFiles,
  saveToJSON,
  testAudioAPI,
  printFirestoreCommands
}; 