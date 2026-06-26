'use client';

import React, { memo } from 'react';
import { Button } from './Button';

interface GameRule {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface GameHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: string;
  gameName: string;
}

const gameRules: Record<string, GameRule[]> = {
  'word-matching': [
    {
      step: 1,
      title: 'Kelimeyi Dinle',
      description: 'Önce ses butonuna basarak kelimeyi dinle',
      icon: '🔊'
    },
    {
      step: 2,
      title: 'Doğru Resmi Bul',
      description: 'Dinlediğin kelimeye uygun resmi seç',
      icon: '🖼️'
    },
    {
      step: 3,
      title: 'Tebrikler!',
      description: 'Doğru seçtiğinde yıldız kazanırsın',
      icon: '⭐'
    }
  ],
  'memory': [
    {
      step: 1,
      title: 'Kartları Çevir',
      description: 'Kartlara tıklayarak ne olduğunu gör',
      icon: '🃏'
    },
    {
      step: 2,
      title: 'Çiftleri Bul',
      description: 'Aynı olan iki kartı eşleştir',
      icon: '🎯'
    },
    {
      step: 3,
      title: 'Tamamla',
      description: 'Tüm çiftleri bulduğunda oyun biter',
      icon: '🏆'
    }
  ],
  'emotion-recognition': [
    {
      step: 1,
      title: 'Yüzü İncele',
      description: 'Ekrandaki yüz ifadesini dikkatli incele',
      icon: '👤'
    },
    {
      step: 2,
      title: 'Duyguyu Seç',
      description: 'Aşağıdaki duygu seçeneklerinden doğru olanı seç',
      icon: '😊'
    },
    {
      step: 3,
      title: 'Geri Bildirim Al',
      description: 'Doğru seçtiğinde tebrik alırsın',
      icon: '🎉'
    }
  ],
  'social-stories': [
    {
      step: 1,
      title: 'Hikayeyi Oku',
      description: 'Sosyal durumu anlatan hikayeyi dikkatli oku',
      icon: '📖'
    },
    {
      step: 2,
      title: 'Soruyu Yanıtla',
      description: 'Hikaye ile ilgili soruları yanıtla',
      icon: '❓'
    },
    {
      step: 3,
      title: 'Puan Kazan',
      description: 'Doğru yanıtlarınla puan topla',
      icon: '💯'
    }
  ],
  'daily-activities': [
    {
      step: 1,
      title: 'Aktiviteyi Seç',
      description: 'Yapmak istediğin günlük aktiviteyi seç',
      icon: '🎯'
    },
    {
      step: 2,
      title: 'Adımları Takip Et',
      description: 'Her adımı sırasıyla takip et',
      icon: '📝'
    },
    {
      step: 3,
      title: 'Tamamla',
      description: 'Tüm adımları tamamlayınca başarı kazanırsın',
      icon: '✅'
    }
  ],
  'communication-skills': [
    {
      step: 1,
      title: 'Cümleyi Dinle',
      description: 'Öğrenmek istediğin cümleyi dinle',
      icon: '👂'
    },
    {
      step: 2,
      title: 'Tekrar Et',
      description: 'Mikrofonla cümleyi tekrar etmeye çalış',
      icon: '🎤'
    },
    {
      step: 3,
      title: 'Pratik Yap',
      description: 'Farklı cümlelerle pratik yaparak öğren',
      icon: '🎯'
    }
  ],
  'letter-tracing': [
    {
      step: 1,
      title: 'Harfi İncele',
      description: 'Ekrandaki harfi dikkatli incele',
      icon: '🔤'
    },
    {
      step: 2,
      title: 'Çizgiyi Takip Et',
      description: 'Parmağınla okları takip ederek harfi çiz',
      icon: '✏️'
    },
    {
      step: 3,
      title: 'Tekrar Et',
      description: 'Harfi birkaç kez çizerek öğren',
      icon: '🔁'
    }
  ],
  'word-building': [
    {
      step: 1,
      title: 'Resmi İncele',
      description: 'Ekrandaki resmi dikkatli incele',
      icon: '🖼️'
    },
    {
      step: 2,
      title: 'Harfleri Sürükle',
      description: 'Doğru harfleri sürükleyerek kelimeyi oluştur',
      icon: '🔤'
    },
    {
      step: 3,
      title: 'Kelimeyi Tamamla',
      description: 'Tüm harfleri doğru yerleştirince kelime tamamlanır',
      icon: '✨'
    }
  ],
  'sentence-making': [
    {
      step: 1,
      title: 'Kelimeleri İncele',
      description: 'Verilen kelimeleri dikkatli incele',
      icon: '📝'
    },
    {
      step: 2,
      title: 'Sıraya Diz',
      description: 'Kelimeleri sürükleyerek anlamlı cümle oluştur',
      icon: '🔄'
    },
    {
      step: 3,
      title: 'Cümleyi Kontrol Et',
      description: 'Oluşturduğun cümlenin doğruluğunu kontrol et',
      icon: '✅'
    }
  ],
  'video-watching': [
    {
      step: 1,
      title: 'Video Kategorisi Seç',
      description: 'İstediğin türde videoları bulmak için kategori seç',
      icon: '📂'
    },
    {
      step: 2,
      title: 'Video Seç ve İzle',
      description: 'Beğendiğin videoyu seç ve izlemeye başla',
      icon: '▶️'
    },
    {
      step: 3,
      title: 'Kontrolleri Kullan',
      description: 'Videoyu duraklat, devam ettir veya kapat',
      icon: '⏯️'
    }
  ],
  'story-writing': [
    {
      step: 1,
      title: 'Konuyu Seç',
      description: 'Hikaye yazacağın konuyu seç',
      icon: '📚'
    },
    {
      step: 2,
      title: 'Yazmaya Başla',
      description: 'Anahtar kelimeleri kullanarak hikayeni yaz',
      icon: '✍️'
    },
    {
      step: 3,
      title: 'Paylaş',
      description: 'Hikayeni tamamlayıp paylaş',
      icon: '🎭'
    }
  ],
  'expression-practice': [
    {
      step: 1,
      title: 'Durumu Düşün',
      description: 'Verilen durumu düşün ve hissettiklerini anlat',
      icon: '💭'
    },
    {
      step: 2,
      title: 'İfade Et',
      description: 'Duygularını kelimelerle ifade et',
      icon: '💬'
    },
    {
      step: 3,
      title: 'Paylaş',
      description: 'Deneyimlerini paylaş',
      icon: '🤝'
    }
  ],
  'colors': [
    {
      step: 1,
      title: 'Rengi Gör',
      description: 'Ekrandaki rengi dikkatli incele',
      icon: '🎨'
    },
    {
      step: 2,
      title: 'Renk Adını Öğren',
      description: 'Rengin adını dinle ve öğren',
      icon: '🔊'
    },
    {
      step: 3,
      title: 'Seçim Yap',
      description: 'Doğru renk adını seç',
      icon: '✅'
    }
  ],
  'shapes': [
    {
      step: 1,
      title: 'Şekli İncele',
      description: 'Ekrandaki şekli dikkatli incele',
      icon: '🔷'
    },
    {
      step: 2,
      title: 'Şekil Adını Öğren',
      description: 'Şeklin adını dinle ve öğren',
      icon: '📐'
    },
    {
      step: 3,
      title: 'Doğru Şekli Seç',
      description: 'Aynı şekli seçeneklerden bul',
      icon: '🎯'
    }
  ],
  'numbers': [
    {
      step: 1,
      title: 'Sayıyı Gör',
      description: 'Ekrandaki sayıyı ve nesneleri say',
      icon: '🔢'
    },
    {
      step: 2,
      title: 'Sayı Adını Öğren',
      description: 'Sayının adını dinle ve öğren',
      icon: '🔊'
    },
    {
      step: 3,
      title: 'Doğru Sayıyı Seç',
      description: 'Nesne sayısına uygun sayıyı seç',
      icon: '🍎'
    }
  ],
  'sizes': [
    {
      step: 1,
      title: 'Boyutları Karşılaştır',
      description: 'Farklı boyutlardaki nesneleri karşılaştır',
      icon: '📏'
    },
    {
      step: 2,
      title: 'Boyut Adını Öğren',
      description: 'Büyük, küçük, uzun, kısa kavramlarını öğren',
      icon: '📐'
    },
    {
      step: 3,
      title: 'Doğru Boyutu Seç',
      description: 'Verilen boyut kavramına uygun nesneyi seç',
      icon: '✅'
    }
  ],
  'directions': [
    {
      step: 1,
      title: 'Yönü Gör',
      description: 'Ekrandaki yön göstergesini incele',
      icon: '🧭'
    },
    {
      step: 2,
      title: 'Yön Adını Öğren',
      description: 'Yukarı, aşağı, sağ, sol kavramlarını öğren',
      icon: '➡️'
    },
    {
      step: 3,
      title: 'Doğru Yönü Seç',
      description: 'Verilen yön kavramına uygun seçeneği seç',
      icon: '🎯'
    }
  ],
  'opposites': [
    {
      step: 1,
      title: 'Zıtlıkları Gör',
      description: 'Ekrandaki zıt kavramları incele',
      icon: '⚖️'
    },
    {
      step: 2,
      title: 'Zıt Kavramları Öğren',
      description: 'Sıcak-soğuk, hızlı-yavaş gibi zıtlıkları öğren',
      icon: '🔄'
    },
    {
      step: 3,
      title: 'Zıt Kavramı Seç',
      description: 'Verilen kavramın zıttını seç',
      icon: '🎯'
    }
  ],
  'time': [
    {
      step: 1,
      title: 'Zaman Dilimini Gör',
      description: 'Ekrandaki gündüz/gece veya mevsim görselini incele',
      icon: '🕐'
    },
    {
      step: 2,
      title: 'Zaman Kavramını Öğren',
      description: 'Gündüz, gece, mevsimler gibi zaman kavramlarını öğren',
      icon: '📅'
    },
    {
      step: 3,
      title: 'Doğru Zamanı Seç',
      description: 'Verilen duruma uygun zaman dilimini seç',
      icon: '✅'
    }
  ],
  'stories': [
    {
      step: 1,
      title: 'Hikaye Seç',
      description: 'Dinlemek istediğin hikayeyi kategoriden seç',
      icon: '📚'
    },
    {
      step: 2,
      title: 'Sayfaları Takip Et',
      description: 'Önceki/sonraki butonları ile sayfaları takip et',
      icon: '📄'
    },
    {
      step: 3,
      title: 'Dinle ve Eğlen',
      description: 'Ses butonuna basarak hikayeyi dinle veya otomatik oynat',
      icon: '🔊'
    }
  ],
  'animals': [
    {
      step: 1,
      title: 'Kategori Seç',
      description: 'Ev hayvanları, vahşi hayvanlar, kuşlar veya deniz hayvanları kategorilerinden birini seç',
      icon: '🏠'
    },
    {
      step: 2,
      title: 'Hayvan Seç',
      description: 'Öğrenmek istediğin hayvanın resmine tıkla',
      icon: '🐾'
    },
    {
      step: 3,
      title: 'Bilgileri Öğren',
      description: 'Hayvanın sesini, yaşam alanını ve özelliklerini öğren',
      icon: '📚'
    }
  ],
  'music-listening': [
    {
      step: 1,
      title: 'Müzik Kategorisi Seç',
      description: 'Sakinleştirici, eğitici, klasik müzik veya doğa sesleri kategorilerinden birini seç',
      icon: '🎵'
    },
    {
      step: 2,
      title: 'Müzik Seç ve Çal',
      description: 'Beğendiğin müziği seç ve çalmaya başla',
      icon: '▶️'
    },
    {
      step: 3,
      title: 'Müzik Kontrolü',
      description: 'Sesini ayarla, durdur, devam ettir veya farklı müzik seç',
      icon: '🎚️'
    }
  ],
  'puzzle': [
    {
      step: 1,
      title: '1. Kategori ve Zorluk Seç',
      description: 'Hayvanlar, meyveler, araçlar veya şekiller kategorisinden birini seç. Sonra zorluk seviyeni belirle: Kolay (4 parça), Orta (9 parça) veya Zor (16 parça).',
      icon: '🎯'
    },
    {
      step: 2,
      title: '2. Parçaları Sürükle',
      description: 'Sağdaki puzzle parçalarını sol taraftaki yapboz tahtasına sürükle. Her parçayı doğru konumuna yerleştirmeye çalış.',
      icon: '🧩'
    },
    {
      step: 3,
      title: '3. Tamamla ve Kutla',
      description: 'Tüm parçaları doğru yerlere koyduğunda puzzle tamamlanır! Başarını kutla ve yeni bir puzzle dene.',
      icon: '🎉'
    }
  ],
  'alphabet-reading': [
    {
      step: 1,
      title: '1. Öğrenme Modu',
      description: 'Türk alfabesindeki 29 harfi tek tek öğren. Harfe tıklayarak sesini dinle. Büyük harf, küçük harf veya karışık modlarını seç.',
      icon: '🔤'
    },
    {
      step: 2,
      title: '2. Harf Tanıma Quiz',
      description: 'Quiz butonuna bas ve dinle butonuna tıklayarak harfi dinle. Aşağıdaki 4 seçenekten doğru harfi seç. Sesli ve sessiz harfleri ayırt etmeyi öğren.',
      icon: '👂'
    },
    {
      step: 3,
      title: '3. Alfabe Haritası',
      description: 'Alt taraftaki alfabe haritasından herhangi bir harfe tıklayarak o harfi öğren. İlerleme kaydet ve yeni harfleri keşfet.',
      icon: '🗺️'
    }
  ]
};

const gameNames: Record<string, string> = {
  'word-matching': 'Kelime Eşleştirme',
  'memory': 'Hafıza Oyunu',
  'emotion-recognition': 'Duygu Tanıma',
  'social-stories': 'Sosyal Öyküler',
  'daily-activities': 'Günlük Aktiviteler',
  'communication-skills': 'İletişim Becerileri',
  'letter-tracing': 'Harf İzleme',
  'word-building': 'Kelime Oluşturma',
  'sentence-making': 'Cümle Yapma',
  'story-writing': 'Hikaye Yazma',
  'expression-practice': 'İfade Etme',
  'colors': 'Renkler',
  'shapes': 'Şekiller',
  'numbers': 'Sayılar',
  'sizes': 'Boyutlar',
  'directions': 'Yönler',
  'opposites': 'Zıtlıklar',
  'time': 'Zaman',
  'animals': 'Hayvanlar',
  'video-watching': 'Video İzleme Odası',
  'music-listening': 'Müzik Dinleme Odası',
  'puzzle': 'Puzzle Oyunu',
  'alphabet-reading': 'Alfabe Okuma'
};

export const GameHelpModal = memo(function GameHelpModal({ isOpen, onClose, gameType, gameName }: GameHelpModalProps) {
  const rules = gameRules[gameType] || [];
  const displayName = gameNames[gameType] || gameName;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ❓ Oyun Kuralları
          </h2>
          <button
            onClick={onClose}
            aria-label="Yardım menüsünü kapat"
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            {displayName}
          </h3>
          <p className="text-gray-600 text-sm">
            Bu oyunu nasıl oynayacağını öğren:
          </p>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {rule.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{rule.icon}</span>
                  <h4 className="font-semibold text-gray-800">{rule.title}</h4>
                </div>
                <p className="text-gray-600 text-sm">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💡</span>
            <h4 className="font-semibold text-yellow-800">İpucu</h4>
          </div>
          <p className="text-yellow-700 text-sm">
            Oyunu oynarken zorlandığında bu yardım menüsünü tekrar açabilirsin!
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={onClose}
            ariaLabel="Anladım ve kapat"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Anladım! 🎮
          </Button>
        </div>
      </div>
    </div>
  );
});

export default GameHelpModal; 