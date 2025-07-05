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
  { text: 'anne', filename: 'anne.mp3', type: 'word', category: 'words' },
  { text: 'baba', filename: 'baba.mp3', type: 'word', category: 'words' },
  { text: 'mama', filename: 'mama.mp3', type: 'word', category: 'words' },
  { text: 'dede', filename: 'dede.mp3', type: 'word', category: 'words' },
  { text: 'nene', filename: 'nene.mp3', type: 'word', category: 'words' },
  { text: 'abla', filename: 'abla.mp3', type: 'word', category: 'words' },
  { text: 'abi', filename: 'abi.mp3', type: 'word', category: 'words' },
  
  // Türkçe meyve ve hayvan isimleri
  { text: 'elma', filename: 'elma.mp3', type: 'word', category: 'words' },
  { text: 'armut', filename: 'armut.mp3', type: 'word', category: 'words' },
  { text: 'kiraz', filename: 'kiraz.mp3', type: 'word', category: 'words' },
  { text: 'üzüm', filename: 'üzüm.mp3', type: 'word', category: 'words' },
  { text: 'kedi', filename: 'kedi.mp3', type: 'word', category: 'words' },
  { text: 'köpek', filename: 'köpek.mp3', type: 'word', category: 'words' },
  { text: 'kuş', filename: 'kuş.mp3', type: 'word', category: 'words' },
  { text: 'balık', filename: 'balık.mp3', type: 'word', category: 'words' },
  
  // Temel nesneler
  { text: 'ev', filename: 'ev.mp3', type: 'word', category: 'words' },
  { text: 'su', filename: 'su.mp3', type: 'word', category: 'words' },
  { text: 'ekmek', filename: 'ekmek.mp3', type: 'word', category: 'words' },
  { text: 'süt', filename: 'süt.mp3', type: 'word', category: 'words' },
  { text: 'çay', filename: 'çay.mp3', type: 'word', category: 'words' },
  { text: 'şeker', filename: 'şeker.mp3', type: 'word', category: 'words' },
];

// Türkçe yönlendirme cümleleri
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
];

// Türkçe kutlama mesajları
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
];

// Tüm statik ses dosyalarını birleştir
export const ALL_STATIC_AUDIO: StaticAudioFile[] = [
  ...TURKISH_LETTERS,
  ...BASIC_WORDS,
  ...INSTRUCTION_SENTENCES,
  ...CELEBRATION_MESSAGES,
];

// Türkçe karakterli ses dosyası yolu oluşturucu
export function getStaticAudioPath(text: string, type: VoiceType): string | null {
  const audioFile = ALL_STATIC_AUDIO.find(
    file => file.text.toLowerCase() === text.toLowerCase() && file.type === type
  );
  
  if (!audioFile) return null;
  
  const basePath = `/audio/${type === 'letter' ? 'letters' : 
                          type === 'word' ? 'words' : 
                          type === 'sentence' ? 'sentences' : 
                          'celebrations'}`;
  
  return `${basePath}/${audioFile.filename}`;
}

// Ses dosyası var mı kontrol et
export function hasStaticAudio(text: string, type: VoiceType): boolean {
  return getStaticAudioPath(text, type) !== null;
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