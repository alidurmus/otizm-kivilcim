// Audio constants and static file management for Kıvılcım platform

export type VoiceType = 'letter' | 'word' | 'sentence' | 'celebration';

// Sabit ses dosyaları mapping'i
export interface StaticAudioFile {
  text: string;
  filename: string;
  type: VoiceType;
  category: string;
}

// Türk alfabesi harfleri - 29 harf (A'dan Z'ye + özel karakterler)
export const TURKISH_LETTERS: StaticAudioFile[] = [
  // Sesli harfler (8 adet)
  { text: 'a', filename: 'a.mp3', type: 'letter', category: 'vowels' },
  { text: 'e', filename: 'e.mp3', type: 'letter', category: 'vowels' },
  { text: 'ı', filename: 'ı.mp3', type: 'letter', category: 'vowels' },
  { text: 'i', filename: 'i.mp3', type: 'letter', category: 'vowels' },
  { text: 'o', filename: 'o.mp3', type: 'letter', category: 'vowels' },
  { text: 'ö', filename: 'ö.mp3', type: 'letter', category: 'vowels' },
  { text: 'u', filename: 'u.mp3', type: 'letter', category: 'vowels' },
  { text: 'ü', filename: 'ü.mp3', type: 'letter', category: 'vowels' },
  
  // Sessiz harfler - Türk alfabesi sırasıyla (21 adet)
  { text: 'b', filename: 'b.mp3', type: 'letter', category: 'consonants' },
  { text: 'c', filename: 'c.mp3', type: 'letter', category: 'consonants' },
  { text: 'ç', filename: 'ç.mp3', type: 'letter', category: 'consonants' },
  { text: 'd', filename: 'd.mp3', type: 'letter', category: 'consonants' },
  { text: 'f', filename: 'f.mp3', type: 'letter', category: 'consonants' },
  { text: 'g', filename: 'g.mp3', type: 'letter', category: 'consonants' },
  { text: 'ğ', filename: 'ğ.mp3', type: 'letter', category: 'consonants' },
  { text: 'h', filename: 'h.mp3', type: 'letter', category: 'consonants' },
  { text: 'j', filename: 'j.mp3', type: 'letter', category: 'consonants' },
  { text: 'k', filename: 'k.mp3', type: 'letter', category: 'consonants' },
  { text: 'l', filename: 'l.mp3', type: 'letter', category: 'consonants' },
  { text: 'm', filename: 'm.mp3', type: 'letter', category: 'consonants' },
  { text: 'n', filename: 'n.mp3', type: 'letter', category: 'consonants' },
  { text: 'p', filename: 'p.mp3', type: 'letter', category: 'consonants' },
  { text: 'r', filename: 'r.mp3', type: 'letter', category: 'consonants' },
  { text: 's', filename: 's.mp3', type: 'letter', category: 'consonants' },
  { text: 'ş', filename: 'ş.mp3', type: 'letter', category: 'consonants' },
  { text: 't', filename: 't.mp3', type: 'letter', category: 'consonants' },
  { text: 'v', filename: 'v.mp3', type: 'letter', category: 'consonants' },
  { text: 'y', filename: 'y.mp3', type: 'letter', category: 'consonants' },
  { text: 'z', filename: 'z.mp3', type: 'letter', category: 'consonants' },
];

// Türkçe heceler ve kelimeler
export const BASIC_WORDS: StaticAudioFile[] = [
  // Açık heceler - Türkçe okuryazarlık için kritik
  { text: 'el', filename: 'el.mp3', type: 'word', category: 'syllables' },
  { text: 'al', filename: 'al.mp3', type: 'word', category: 'syllables' },
  { text: 'ol', filename: 'ol.mp3', type: 'word', category: 'syllables' },
  { text: 'il', filename: 'il.mp3', type: 'word', category: 'syllables' },
  { text: 'öl', filename: 'öl.mp3', type: 'word', category: 'syllables' },
  { text: 'am', filename: 'am.mp3', type: 'word', category: 'syllables' },
  { text: 'em', filename: 'em.mp3', type: 'word', category: 'syllables' },
  { text: 'an', filename: 'an.mp3', type: 'word', category: 'syllables' },
  { text: 'en', filename: 'en.mp3', type: 'word', category: 'syllables' },
  { text: 'in', filename: 'in.mp3', type: 'word', category: 'syllables' },
  { text: 'un', filename: 'un.mp3', type: 'word', category: 'syllables' },
  { text: 'ün', filename: 'ün.mp3', type: 'word', category: 'syllables' },
  { text: 'at', filename: 'at.mp3', type: 'word', category: 'syllables' },
  { text: 'et', filename: 'et.mp3', type: 'word', category: 'syllables' },
  { text: 'it', filename: 'it.mp3', type: 'word', category: 'syllables' },
  { text: 'ut', filename: 'ut.mp3', type: 'word', category: 'syllables' },
  
  // Türkçe özel karakterli heceler
  { text: 'aç', filename: 'aç.mp3', type: 'word', category: 'syllables' },
  { text: 'eş', filename: 'eş.mp3', type: 'word', category: 'syllables' },
  { text: 'iş', filename: 'iş.mp3', type: 'word', category: 'syllables' },
  { text: 'uş', filename: 'uş.mp3', type: 'word', category: 'syllables' },
  { text: 'üş', filename: 'üş.mp3', type: 'word', category: 'syllables' },
  
  // Basit Türkçe kelimeler - aile ve günlük yaşam
  { text: 'anne', filename: 'anne.mp3', type: 'word', category: 'family' },
  { text: 'baba', filename: 'baba.mp3', type: 'word', category: 'family' },
  { text: 'mama', filename: 'mama.mp3', type: 'word', category: 'family' },
  { text: 'dede', filename: 'dede.mp3', type: 'word', category: 'family' },
  { text: 'nene', filename: 'nene.mp3', type: 'word', category: 'family' },
  { text: 'abla', filename: 'abla.mp3', type: 'word', category: 'family' },
  { text: 'abi', filename: 'abi.mp3', type: 'word', category: 'family' },
  { text: 'kardeş', filename: 'kardes.mp3', type: 'word', category: 'family' },
  
  // Türkçe meyve ve sebzeler
  { text: 'elma', filename: 'elma.mp3', type: 'word', category: 'fruits' },
  { text: 'armut', filename: 'armut.mp3', type: 'word', category: 'fruits' },
  { text: 'kiraz', filename: 'kiraz.mp3', type: 'word', category: 'fruits' },
  { text: 'üzüm', filename: 'uzum.mp3', type: 'word', category: 'fruits' },
  { text: 'muz', filename: 'muz.mp3', type: 'word', category: 'fruits' },
  { text: 'çilek', filename: 'cilek.mp3', type: 'word', category: 'fruits' },
  { text: 'domates', filename: 'domates.mp3', type: 'word', category: 'vegetables' },
  { text: 'salatalık', filename: 'salatalik.mp3', type: 'word', category: 'vegetables' },
  
  // Hayvanlar
  { text: 'kedi', filename: 'kedi.mp3', type: 'word', category: 'animals' },
  { text: 'köpek', filename: 'kopek.mp3', type: 'word', category: 'animals' },
  { text: 'kuş', filename: 'kus.mp3', type: 'word', category: 'animals' },
  { text: 'balık', filename: 'balik.mp3', type: 'word', category: 'animals' },
  { text: 'fil', filename: 'fil.mp3', type: 'word', category: 'animals' },
  { text: 'kaplan', filename: 'kaplan.mp3', type: 'word', category: 'animals' },
  { text: 'aslan', filename: 'aslan.mp3', type: 'word', category: 'animals' },
  { text: 'tavşan', filename: 'tavsan.mp3', type: 'word', category: 'animals' },
  
  // Temel nesneler
  { text: 'ev', filename: 'ev.mp3', type: 'word', category: 'objects' },
  { text: 'su', filename: 'su.mp3', type: 'word', category: 'objects' },
  { text: 'ekmek', filename: 'ekmek.mp3', type: 'word', category: 'objects' },
  { text: 'süt', filename: 'sut.mp3', type: 'word', category: 'objects' },
  { text: 'çay', filename: 'cay.mp3', type: 'word', category: 'objects' },
  { text: 'şeker', filename: 'seker.mp3', type: 'word', category: 'objects' },
  { text: 'kitap', filename: 'kitap.mp3', type: 'word', category: 'objects' },
  { text: 'kalem', filename: 'kalem.mp3', type: 'word', category: 'objects' },
  { text: 'çanta', filename: 'canta.mp3', type: 'word', category: 'objects' },

  // Ek kelimeler - diğer sayfalarda kullanılan
  { text: 'çe', filename: 'ce.mp3', type: 'word', category: 'syllables' },
  { text: 'şa', filename: 'sa.mp3', type: 'word', category: 'syllables' },
  { text: 'ğı', filename: 'gi.mp3', type: 'word', category: 'syllables' },
  { text: 'öz', filename: 'oz.mp3', type: 'word', category: 'syllables' },
  { text: 'ör', filename: 'or.mp3', type: 'word', category: 'syllables' },
];

// Ana sayfa diyalogları
export const HOME_PAGE_DIALOGS: StaticAudioFile[] = [
  { text: "Merhaba! Kıvılcım'a hoş geldin! Birlikte öğrenmeye hazır mısın?", filename: 'hosgeldin-mesaji.mp3', type: 'sentence', category: 'homepage' },
];

// Alfabe sayfası diyalogları
export const ALPHABET_DIALOGS: StaticAudioFile[] = [
  { text: "Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.", filename: 'alfabe-hosgeldin.mp3', type: 'sentence', category: 'alphabet' },
];

// Okuryazarlık egzersizi diyalogları  
export const LITERACY_DIALOGS: StaticAudioFile[] = [
  { text: "Bu hece el... el!", filename: 'bu-hece-el.mp3', type: 'word', category: 'literacy' },
  { text: "Harikasın! Çok güzel yaptın!", filename: 'harikasin-cok-guzel.mp3', type: 'celebration', category: 'literacy' },
  { text: "Bravo! Mükemmel bir çalışma!", filename: 'bravo-mukemmel-calisma.mp3', type: 'celebration', category: 'literacy' },
  { text: "Süpersin! Devam et böyle!", filename: 'supersin-devam-et.mp3', type: 'celebration', category: 'literacy' },
  { text: "Çok başarılısın! Harika iş!", filename: 'cok-basarilisin-harika-is.mp3', type: 'celebration', category: 'literacy' },
];

// Sosyal iletişim diyalogları
export const SOCIAL_COMMUNICATION_DIALOGS: StaticAudioFile[] = [
  { text: "Doğru!", filename: 'dogru.mp3', type: 'celebration', category: 'social' },
  { text: "Tekrar dene.", filename: 'tekrar-dene-social.mp3', type: 'sentence', category: 'social' },
  { text: "aktivitesini öğrenelim!", filename: 'aktivite-ogrenelim.mp3', type: 'sentence', category: 'social' },
  { text: "Tebrikler! Aktiviteyi tamamladın!", filename: 'aktivite-tamamlandi.mp3', type: 'celebration', category: 'social' },
];

// Temel kavramlar diyalogları
export const BASIC_CONCEPTS_DIALOGS: StaticAudioFile[] = [
  { text: "Bu", filename: 'bu.mp3', type: 'word', category: 'concepts' },
  { text: "rengi.", filename: 'rengi.mp3', type: 'word', category: 'concepts' },
  { text: "sesi çıkarır.", filename: 'sesi-cikarir.mp3', type: 'sentence', category: 'concepts' },
  { text: "tane elma", filename: 'tane-elma.mp3', type: 'sentence', category: 'concepts' },
  { text: "der", filename: 'der.mp3', type: 'word', category: 'concepts' },
];

// Yazma-anlatım diyalogları
export const WRITING_EXPRESSION_DIALOGS: StaticAudioFile[] = [
  { text: "Tebrikler!", filename: 'tebrikler-yazma.mp3', type: 'celebration', category: 'writing' },
  { text: "kelimesini tamamladın!", filename: 'kelimesini-tamamladin.mp3', type: 'sentence', category: 'writing' },
  { text: "Tekrar dene. Harflerin sırasına dikkat et.", filename: 'harflerin-sirasina-dikkat.mp3', type: 'sentence', category: 'writing' },
  { text: "Tüm kelimeleri tamamladın! Harikasın!", filename: 'tum-kelimeleri-tamamladin.mp3', type: 'celebration', category: 'writing' },
  { text: "Harika cümle:", filename: 'harika-cumle.mp3', type: 'sentence', category: 'writing' },
  { text: "Tüm cümleleri tamamladın! Muhteşemsin!", filename: 'tum-cumleleri-tamamladin.mp3', type: 'celebration', category: 'writing' },
];

// Yapboz diyalogları
export const PUZZLE_DIALOGS: StaticAudioFile[] = [
  { text: "seviye seçtin.", filename: 'seviye-sectin.mp3', type: 'sentence', category: 'puzzle' },
  { text: "yapbozunu başlayalım!", filename: 'yapboz-baslayalim.mp3', type: 'sentence', category: 'puzzle' },
];

// Kelime oyunları diyalogları
export const VOCABULARY_GAME_DIALOGS: StaticAudioFile[] = [
  { text: "Harika! Eşleştirme buldu!", filename: 'harika-eslestirme-buldu.mp3', type: 'celebration', category: 'vocabulary' },
  { text: "Tebrikler! Tüm eşleştirmeleri buldun!", filename: 'tum-eslestirmeleri-buldun.mp3', type: 'celebration', category: 'vocabulary' },
];

// Türkçe yönlendirme cümleleri - genişletilmiş
export const INSTRUCTION_SENTENCES: StaticAudioFile[] = [
  { text: 'Başlayalım!', filename: 'baslayalim.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Harfleri birleştir.', filename: 'harfleri-birlestir.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Bu harfi söyle.', filename: 'bu-harfi-soyle.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Doğru yere sürükle.', filename: 'dogru-yere-surukle.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Tekrar dene.', filename: 'tekrar-dene.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Çok iyi!', filename: 'cok-iyi.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Devam et.', filename: 'devam-et.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Sorun değil, tekrar deneyelim.', filename: 'sorun-degil-tekrar.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Müthiş! Devam ediyoruz.', filename: 'muthis-devam-ediyoruz.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Şimdi bir sonraki harfe geçelim.', filename: 'simdi-sonraki-harfe.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Bu kelimeyi okuyabilir misin?', filename: 'bu-kelimeyi-okuyabilir-misin.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Hangi harf eksik?', filename: 'hangi-harf-eksik.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Kelimeyi tamamla.', filename: 'kelimeyi-tamamla.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Mükemmel bir başlangıç!', filename: 'mukemmel-baslangic.mp3', type: 'sentence', category: 'instructions' },
];

// Türkçe kutlama mesajları - genişletilmiş
export const CELEBRATION_MESSAGES: StaticAudioFile[] = [
  { text: 'Harikasın!', filename: 'harikasin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Bravo!', filename: 'bravo.mp3', type: 'celebration', category: 'praise' },
  { text: 'Mükemmel!', filename: 'mukemmel.mp3', type: 'celebration', category: 'praise' },
  { text: 'Çok başarılısın!', filename: 'cok-basarilisin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Süpersin!', filename: 'supersin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Aferin sana!', filename: 'aferin-sana.mp3', type: 'celebration', category: 'praise' },
  { text: 'Harika iş çıkardın!', filename: 'harika-is-cikardin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Çok güzel yaptın!', filename: 'cok-guzel-yaptin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Tebrikler!', filename: 'tebrikler.mp3', type: 'celebration', category: 'praise' },
  { text: 'Devam et böyle!', filename: 'devam-et-boyle.mp3', type: 'celebration', category: 'praise' },
  { text: 'Muhteşemsin!', filename: 'muhtesemsin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Çok güzeldi!', filename: 'cok-guzeldi.mp3', type: 'celebration', category: 'praise' },
  { text: 'Harika ilerleme!', filename: 'harika-ilerleme.mp3', type: 'celebration', category: 'praise' },
  { text: 'Sen bir yıldızsın!', filename: 'sen-bir-yildizsin.mp3', type: 'celebration', category: 'praise' },
  { text: 'Mükemmel bir öğrencisin!', filename: 'mukemmel-ogrencisin.mp3', type: 'celebration', category: 'praise' },
];

// Tüm statik ses dosyalarını birleştir
export const ALL_STATIC_AUDIO: StaticAudioFile[] = [
  ...TURKISH_LETTERS,
  ...BASIC_WORDS,
  ...HOME_PAGE_DIALOGS,
  ...ALPHABET_DIALOGS,
  ...LITERACY_DIALOGS,
  ...SOCIAL_COMMUNICATION_DIALOGS,
  ...BASIC_CONCEPTS_DIALOGS,
  ...WRITING_EXPRESSION_DIALOGS,
  ...PUZZLE_DIALOGS,
  ...VOCABULARY_GAME_DIALOGS,
  ...INSTRUCTION_SENTENCES,
  ...CELEBRATION_MESSAGES,
];

// Gelişmiş multi-voice ses dosyası yolu oluşturucu
export function getStaticAudioPath(text: string, type: VoiceType, voiceSlug?: string): string | null {
  const audioFile = ALL_STATIC_AUDIO.find(
    file => file.text.toLowerCase() === text.toLowerCase() && file.type === type
  );
  
  if (!audioFile) return null;
  
  // Multi-voice support - eğer voice slug belirtilmişse o sesi kullan
  if (voiceSlug) {
    const voiceBasePath = `/audio/voices/${voiceSlug}`;
    const typePath = type === 'letter' ? 'letters' : 
                     type === 'word' ? 'words' : 
                     type === 'sentence' ? 'sentences' : 
                     'celebrations';
    
    return `${voiceBasePath}/${typePath}/${audioFile.filename}`;
  }
  
  // Varsayılan yol (eski yapı için uyumluluk)
  const basePath = `/audio/${type === 'letter' ? 'letters' : 
                          type === 'word' ? 'words' : 
                          type === 'sentence' ? 'sentences' : 
                          'celebrations'}`;
  
  return `${basePath}/${audioFile.filename}`;
}

// Ses dosyası var mı kontrol et - multi-voice destekli
export function hasStaticAudio(text: string, type: VoiceType, voiceSlug?: string): boolean {
  return getStaticAudioPath(text, type, voiceSlug) !== null;
}

// Kategori bazında ses dosyalarını getir
export function getAudioFilesByCategory(category: string): StaticAudioFile[] {
  return ALL_STATIC_AUDIO.filter(file => file.category === category);
}

// Tip bazında ses dosyalarını getir
export function getAudioFilesByType(type: VoiceType): StaticAudioFile[] {
  return ALL_STATIC_AUDIO.filter(file => file.type === type);
}

// Türkçe karakterleri URL-safe filename'e çevirme
export function turkishToFilename(text: string): string {
  const turkishMap: { [key: string]: string } = {
    'ç': 'c',
    'ğ': 'g', 
    'ı': 'i',
    'ö': 'o',
    'ş': 's',
    'ü': 'u',
    'Ç': 'C',
    'Ğ': 'G',
    'I': 'I',
    'İ': 'I',
    'Ö': 'O',
    'Ş': 'S',
    'Ü': 'U'
  };
  
  return text
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Tüm ses dosyalarının istatistiklerini getir
export function getAudioStats() {
  const stats = {
    totalFiles: ALL_STATIC_AUDIO.length,
    byType: {
      letter: ALL_STATIC_AUDIO.filter(f => f.type === 'letter').length,
      word: ALL_STATIC_AUDIO.filter(f => f.type === 'word').length,
      sentence: ALL_STATIC_AUDIO.filter(f => f.type === 'sentence').length,
      celebration: ALL_STATIC_AUDIO.filter(f => f.type === 'celebration').length,
    },
    byCategory: {} as Record<string, number>
  };
  
  // Kategori bazında sayım
  ALL_STATIC_AUDIO.forEach(file => {
    stats.byCategory[file.category] = (stats.byCategory[file.category] || 0) + 1;
  });
  
  return stats;
} 