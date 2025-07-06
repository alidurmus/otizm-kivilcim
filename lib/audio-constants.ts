// Audio constants and static file management for Kıvılcım platform

export type VoiceType = 'letter' | 'word' | 'sentence' | 'celebration';

// Sabit ses dosyaları mapping'i
export interface StaticAudioFile {
  text: string;
  filename: string;
  type: VoiceType;
  category: string;
}

// Türk alfabesi harfleri - 29 harf (Dialog.md uyumlu, URL-safe filenames)
export const TURKISH_LETTERS: StaticAudioFile[] = [
  { text: 'a', filename: 'a.mp3', type: 'letter', category: 'alphabet' },
  { text: 'b', filename: 'b.mp3', type: 'letter', category: 'alphabet' },
  { text: 'c', filename: 'c.mp3', type: 'letter', category: 'alphabet' },
  { text: 'ç', filename: 'ch.mp3', type: 'letter', category: 'alphabet' },
  { text: 'd', filename: 'd.mp3', type: 'letter', category: 'alphabet' },
  { text: 'e', filename: 'e.mp3', type: 'letter', category: 'alphabet' },
  { text: 'f', filename: 'f.mp3', type: 'letter', category: 'alphabet' },
  { text: 'g', filename: 'g.mp3', type: 'letter', category: 'alphabet' },
  { text: 'ğ', filename: 'gh.mp3', type: 'letter', category: 'alphabet' },
  { text: 'h', filename: 'h.mp3', type: 'letter', category: 'alphabet' },
  { text: 'ı', filename: 'ii.mp3', type: 'letter', category: 'alphabet' },
  { text: 'i', filename: 'i.mp3', type: 'letter', category: 'alphabet' },
  { text: 'j', filename: 'j.mp3', type: 'letter', category: 'alphabet' },
  { text: 'k', filename: 'k.mp3', type: 'letter', category: 'alphabet' },
  { text: 'l', filename: 'l.mp3', type: 'letter', category: 'alphabet' },
  { text: 'm', filename: 'm.mp3', type: 'letter', category: 'alphabet' },
  { text: 'n', filename: 'n.mp3', type: 'letter', category: 'alphabet' },
  { text: 'o', filename: 'o.mp3', type: 'letter', category: 'alphabet' },
  { text: 'ö', filename: 'oh.mp3', type: 'letter', category: 'alphabet' },
  { text: 'p', filename: 'p.mp3', type: 'letter', category: 'alphabet' },
  { text: 'r', filename: 'r.mp3', type: 'letter', category: 'alphabet' },
  { text: 's', filename: 's.mp3', type: 'letter', category: 'alphabet' },
  { text: 'ş', filename: 'sh.mp3', type: 'letter', category: 'alphabet' },
  { text: 't', filename: 't.mp3', type: 'letter', category: 'alphabet' },
  { text: 'u', filename: 'u.mp3', type: 'letter', category: 'alphabet' },
  { text: 'ü', filename: 'uh.mp3', type: 'letter', category: 'alphabet' },
  { text: 'v', filename: 'v.mp3', type: 'letter', category: 'alphabet' },
  { text: 'y', filename: 'y.mp3', type: 'letter', category: 'alphabet' },
  { text: 'z', filename: 'z.mp3', type: 'letter', category: 'alphabet' },
];

// Türkçe heceler ve kelimeler - Dialog.md uyumlu
export const BASIC_WORDS: StaticAudioFile[] = [
  // Okuryazarlık modülü heceler
  { text: 'el', filename: 'el.mp3', type: 'word', category: 'literacy' },
  { text: 'al', filename: 'al.mp3', type: 'word', category: 'literacy' },
  { text: 'at', filename: 'at.mp3', type: 'word', category: 'literacy' },
  { text: 'ev', filename: 'ev.mp3', type: 'word', category: 'literacy' },
  { text: 'ok', filename: 'ok.mp3', type: 'word', category: 'literacy' },
  
  // Temel kavramlar kelimeleri
  { text: 'bu', filename: 'bu.mp3', type: 'word', category: 'concepts' },
  { text: 'rengi', filename: 'rengi.mp3', type: 'word', category: 'concepts' },
  { text: 'der', filename: 'der.mp3', type: 'word', category: 'concepts' },
  { text: 'bu doğru değil', filename: 'bu-dogru-degil.mp3', type: 'word', category: 'vocabulary' },
  
  // Açık heceler - Türkçe okuryazarlık için kritik
  { text: 'ol', filename: 'ol.mp3', type: 'word', category: 'syllables' },
  { text: 'il', filename: 'il.mp3', type: 'word', category: 'syllables' },
  { text: 'öl', filename: 'ohl.mp3', type: 'word', category: 'syllables' },
  { text: 'am', filename: 'am.mp3', type: 'word', category: 'syllables' },
  { text: 'em', filename: 'em.mp3', type: 'word', category: 'syllables' },
  { text: 'an', filename: 'an.mp3', type: 'word', category: 'syllables' },
  { text: 'en', filename: 'en.mp3', type: 'word', category: 'syllables' },
  { text: 'in', filename: 'in.mp3', type: 'word', category: 'syllables' },
  { text: 'un', filename: 'un.mp3', type: 'word', category: 'syllables' },
  { text: 'ün', filename: 'uhn.mp3', type: 'word', category: 'syllables' },
  { text: 'et', filename: 'et.mp3', type: 'word', category: 'syllables' },
  { text: 'it', filename: 'it.mp3', type: 'word', category: 'syllables' },
  { text: 'ut', filename: 'ut.mp3', type: 'word', category: 'syllables' },
  
  // Türkçe özel karakterli heceler
  { text: 'aç', filename: 'ach.mp3', type: 'word', category: 'syllables' },
  { text: 'eş', filename: 'esh.mp3', type: 'word', category: 'syllables' },
  { text: 'iş', filename: 'ish.mp3', type: 'word', category: 'syllables' },
  { text: 'uş', filename: 'ush.mp3', type: 'word', category: 'syllables' },
  { text: 'üş', filename: 'uhsh.mp3', type: 'word', category: 'syllables' },
  
  // Basit Türkçe kelimeler - aile ve günlük yaşam
  { text: 'anne', filename: 'anne.mp3', type: 'word', category: 'family' },
  { text: 'baba', filename: 'baba.mp3', type: 'word', category: 'family' },
  { text: 'mama', filename: 'mama.mp3', type: 'word', category: 'family' },
  { text: 'dede', filename: 'dede.mp3', type: 'word', category: 'family' },
  { text: 'nene', filename: 'nene.mp3', type: 'word', category: 'family' },
  { text: 'abla', filename: 'abla.mp3', type: 'word', category: 'family' },
  { text: 'abi', filename: 'abi.mp3', type: 'word', category: 'family' },
  { text: 'kardeş', filename: 'kardesh.mp3', type: 'word', category: 'family' },
  
  // Türkçe meyve ve sebzeler
  { text: 'elma', filename: 'elma.mp3', type: 'word', category: 'fruits' },
  { text: 'armut', filename: 'armut.mp3', type: 'word', category: 'fruits' },
  { text: 'kiraz', filename: 'kiraz.mp3', type: 'word', category: 'fruits' },
  { text: 'üzüm', filename: 'uhzuhm.mp3', type: 'word', category: 'fruits' },
  { text: 'muz', filename: 'muz.mp3', type: 'word', category: 'fruits' },
  { text: 'çilek', filename: 'chilek.mp3', type: 'word', category: 'fruits' },
  { text: 'domates', filename: 'domates.mp3', type: 'word', category: 'vegetables' },
  { text: 'salatalık', filename: 'salatalik.mp3', type: 'word', category: 'vegetables' },
  
  // Hayvanlar - Hafıza oyunu için Gülsu voice ile oluşturulmuş
  { text: 'kedi', filename: 'kedi.mp3', type: 'word', category: 'animals' },
  { text: 'köpek', filename: 'kohpek.mp3', type: 'word', category: 'animals' },
  { text: 'kuş', filename: 'kush.mp3', type: 'word', category: 'animals' },
  { text: 'balık', filename: 'balik.mp3', type: 'word', category: 'animals' },
  { text: 'fil', filename: 'fil.mp3', type: 'word', category: 'animals' },
  { text: 'kaplan', filename: 'kaplan.mp3', type: 'word', category: 'animals' },
  { text: 'aslan', filename: 'aslan.mp3', type: 'word', category: 'animals' },
  { text: 'tavşan', filename: 'tavshan.mp3', type: 'word', category: 'animals' },
  { text: 'kurbağa', filename: 'kurbaga.mp3', type: 'word', category: 'animals' },
  { text: 'koala', filename: 'koala.mp3', type: 'word', category: 'animals' },
  
  // Temel nesneler
  { text: 'su', filename: 'su.mp3', type: 'word', category: 'objects' },
  { text: 'ekmek', filename: 'ekmek.mp3', type: 'word', category: 'objects' },
  { text: 'süt', filename: 'suht.mp3', type: 'word', category: 'objects' },
  { text: 'çay', filename: 'chay.mp3', type: 'word', category: 'objects' },
  { text: 'şeker', filename: 'sheker.mp3', type: 'word', category: 'objects' },
  { text: 'kitap', filename: 'kitap.mp3', type: 'word', category: 'objects' },
  { text: 'kalem', filename: 'kalem.mp3', type: 'word', category: 'objects' },
  { text: 'çanta', filename: 'chanta.mp3', type: 'word', category: 'objects' },

  // Matematik modülü - sayılar (Türkçe telaffuz)
  { text: 'Bir', filename: 'bir.mp3', type: 'word', category: 'mathematics' },
  { text: 'İki', filename: 'iki.mp3', type: 'word', category: 'mathematics' },
  { text: 'Üç', filename: 'uch.mp3', type: 'word', category: 'mathematics' },
  { text: 'Dört', filename: 'dort.mp3', type: 'word', category: 'mathematics' },
  { text: 'Beş', filename: 'bes.mp3', type: 'word', category: 'mathematics' },
  { text: 'Altı', filename: 'alti.mp3', type: 'word', category: 'mathematics' },
  { text: 'Yedi', filename: 'yedi.mp3', type: 'word', category: 'mathematics' },
  { text: 'Sekiz', filename: 'sekiz.mp3', type: 'word', category: 'mathematics' },
  { text: 'Dokuz', filename: 'dokuz.mp3', type: 'word', category: 'mathematics' },
  { text: 'On', filename: 'on.mp3', type: 'word', category: 'mathematics' },
  
  // Matematik işlem kelimeleri
  { text: 'artı', filename: 'arti.mp3', type: 'word', category: 'mathematics' },
  { text: 'eşittir', filename: 'esittir.mp3', type: 'word', category: 'mathematics' },
  { text: 'kaç eder', filename: 'kach-eder.mp3', type: 'word', category: 'mathematics' },
  { text: 'toplam', filename: 'toplam.mp3', type: 'word', category: 'mathematics' },
  { text: 'tane', filename: 'tane.mp3', type: 'word', category: 'mathematics' },
  
  // Matematik nesneleri (sayma için)
  { text: 'elmalar', filename: 'elmalar.mp3', type: 'word', category: 'mathematics' },
  { text: 'yıldızlar', filename: 'yildizlar.mp3', type: 'word', category: 'mathematics' },
  { text: 'kalpler', filename: 'kalpler.mp3', type: 'word', category: 'mathematics' },
  { text: 'toplar', filename: 'toplar.mp3', type: 'word', category: 'mathematics' },
  { text: 'çiçekler', filename: 'chichekler.mp3', type: 'word', category: 'mathematics' },
  { text: 'arabalar', filename: 'arabalar.mp3', type: 'word', category: 'mathematics' },
  { text: 'kelebekler', filename: 'kelebekler.mp3', type: 'word', category: 'mathematics' },
  { text: 'köpekler', filename: 'kopekler.mp3', type: 'word', category: 'mathematics' },
  
  // Şekil isimleri
  { text: 'yıldız', filename: 'yildiz.mp3', type: 'word', category: 'mathematics' },
  { text: 'elmas', filename: 'elmas.mp3', type: 'word', category: 'mathematics' },
  { text: 'mavi kare', filename: 'mavi-kare.mp3', type: 'word', category: 'mathematics' },
  { text: 'mor daire', filename: 'mor-daire.mp3', type: 'word', category: 'mathematics' },
  { text: 'turuncu elmas', filename: 'turuncu-elmas.mp3', type: 'word', category: 'mathematics' },
  { text: 'yeşil daire', filename: 'yesil-daire.mp3', type: 'word', category: 'mathematics' },

  // Ek kelimeler - diğer sayfalarda kullanılan
  { text: 'çe', filename: 'che.mp3', type: 'word', category: 'syllables' },
  { text: 'şa', filename: 'sha.mp3', type: 'word', category: 'syllables' },
  { text: 'ğı', filename: 'ghii.mp3', type: 'word', category: 'syllables' },
  { text: 'öz', filename: 'ohz.mp3', type: 'word', category: 'syllables' },
  { text: 'ör', filename: 'ohr.mp3', type: 'word', category: 'syllables' },
];

// Ana sayfa diyalogları
export const HOME_PAGE_DIALOGS: StaticAudioFile[] = [
  { text: "Merhaba! Kıvılcım'a hoş geldin! Birlikte öğrenmeye hazır mısın?", filename: 'hosgeldin-mesaji.mp3', type: 'sentence', category: 'homepage' },
];

// Alfabe sayfası diyalogları
export const ALPHABET_DIALOGS: StaticAudioFile[] = [
  { text: "Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.", filename: 'alfabe-hosgeldin.mp3', type: 'sentence', category: 'alphabet' },
];

// Alfabe okuma modülü diyalogları - Dialog.md'den
export const ALPHABET_MODULE_DIALOGS: StaticAudioFile[] = [
  { text: "Doğru! Harika iş çıkardın!", filename: 'dogru-harika-is.mp3', type: 'celebration', category: 'alphabet' },
  { text: "Hayır, bu {answer}. Doğru cevap {correctAnswer}. Tekrar deneyelim.", filename: 'yanlis-cevap-tekrar.mp3', type: 'sentence', category: 'alphabet' },
];

// Okuryazarlık egzersizi diyalogları - Dialog.md uyumlu
export const LITERACY_DIALOGS: StaticAudioFile[] = [
  { text: "Harikasın! Çok güzel yaptın!", filename: 'harikasin-cok-guzel.mp3', type: 'celebration', category: 'literacy' },
  { text: "Bravo! Mükemmel bir çalışma!", filename: 'bravo-mukemmel-calisma.mp3', type: 'celebration', category: 'literacy' },
  { text: "Süpersin! Devam et böyle!", filename: 'supersin-devam-et.mp3', type: 'celebration', category: 'literacy' },
  { text: "Çok başarılısın! Harika iş!", filename: 'cok-basarilisin-harika-is.mp3', type: 'celebration', category: 'literacy' },
];

// Kelime dağarcığı modülü diyalogları - Dialog.md'den
export const VOCABULARY_DIALOGS: StaticAudioFile[] = [
  { text: "Harika! Doğru eşleştirme!", filename: 'harika-dogru-eslestirme.mp3', type: 'celebration', category: 'vocabulary' },
  { text: "Tebrikler! Tüm kelimeleri doğru eşleştirdin!", filename: 'tebrikler-tum-kelimeler.mp3', type: 'celebration', category: 'vocabulary' },
  { text: "Harika! Bu bir {word}.", filename: 'harika-bu-bir.mp3', type: 'celebration', category: 'vocabulary' },
  { text: "Harika! Eşleştirme buldu!", filename: 'harika-eslestirme-buldu.mp3', type: 'celebration', category: 'vocabulary' },
  { text: "Tebrikler! Tüm eşleştirmeleri buldun!", filename: 'tebrikler-tum-eslestirmeler.mp3', type: 'celebration', category: 'vocabulary' },
];

// Sosyal iletişim modülü diyalogları - Dialog.md'den
export const SOCIAL_COMMUNICATION_DIALOGS: StaticAudioFile[] = [
  { text: "{emotion.name}: {emotion.description}", filename: 'duygu-tanimi.mp3', type: 'sentence', category: 'social' },
  { text: "Doğru! {explanation}", filename: 'dogru-aciklama.mp3', type: 'celebration', category: 'social' },
  { text: "Tekrar dene. {explanation}", filename: 'tekrar-dene-aciklama.mp3', type: 'sentence', category: 'social' },
  { text: "Harika! {score} doğru cevap verdin!", filename: 'harika-dogru-cevap.mp3', type: 'celebration', category: 'social' },
  { text: "{activity} aktivitesini öğrenelim!", filename: 'aktivite-ogrenelim.mp3', type: 'sentence', category: 'social' },
  { text: "Tebrikler! Aktiviteyi tamamladın!", filename: 'tebrikler-aktivite-tamamlandi.mp3', type: 'celebration', category: 'social' },
  { text: "{skill}: {phrase}. {situation}", filename: 'iletisim-becerisi.mp3', type: 'sentence', category: 'social' },
  
  // Specific emotion descriptions - for social communication module
  { text: "Mutlu: Neşeli ve keyifli hissetmek", filename: 'mutlu-neseli-keyifli.mp3', type: 'sentence', category: 'emotions' },
  { text: "Üzgün: Kederli ve mutsuz hissetmek", filename: 'uzgun-kederli-mutsuz.mp3', type: 'sentence', category: 'emotions' },
  { text: "Kızgın: Öfkeli ve sinirli hissetmek", filename: 'kizgin-ofkeli-sinirli.mp3', type: 'sentence', category: 'emotions' },
  { text: "Şaşkın: Hayret etmek ve şaşırmak", filename: 'saskin-hayret-sasirama.mp3', type: 'sentence', category: 'emotions' },
  { text: "Korkmuş: Endişeli ve korkulu hissetmek", filename: 'korkmus-endiseli-korkulu.mp3', type: 'sentence', category: 'emotions' },
  { text: "Heyecanlı: Coşkulu ve heyecanlı hissetmek", filename: 'heyecanli-coskulu.mp3', type: 'sentence', category: 'emotions' },
];

// Sosyal beceriler modülü diyalogları - Dialog.md'den
export const SOCIAL_SKILLS_DIALOGS: StaticAudioFile[] = [
  { text: "Mükemmel! {explanation}", filename: 'mukemmel-aciklama.mp3', type: 'celebration', category: 'social-skills' },
  { text: "{explanation} Tekrar deneyelim!", filename: 'aciklama-tekrar-deneyelim.mp3', type: 'sentence', category: 'social-skills' },
  { text: "Harika! Tüm sosyal beceri egzersizlerini tamamladın! {score} doğru cevap verdin!", filename: 'harika-sosyal-tamamlandi.mp3', type: 'celebration', category: 'social-skills' },
];

// Yazma ve ifade modülü diyalogları - Dialog.md'den
export const WRITING_EXPRESSION_DIALOGS: StaticAudioFile[] = [
  { text: "{letter} harfini yazalım. {instructions}", filename: 'harf-yazalim.mp3', type: 'sentence', category: 'writing' },
  { text: "Harika! Harfi çok güzel yazdın!", filename: 'harika-harf-yazdin.mp3', type: 'celebration', category: 'writing' },
  { text: "Tebrikler! \"{word}\" kelimesini tamamladın!", filename: 'tebrikler-kelime-tamamlandi.mp3', type: 'celebration', category: 'writing' },
  { text: "Tekrar dene. Harflerin sırasına dikkat et.", filename: 'tekrar-dene-harf-sirasi.mp3', type: 'sentence', category: 'writing' },
  { text: "Tüm kelimeleri tamamladın! Harikasın!", filename: 'tum-kelimeler-harika.mp3', type: 'celebration', category: 'writing' },
  { text: "Harika cümle: \"{sentence}\"", filename: 'harika-cumle.mp3', type: 'celebration', category: 'writing' },
  { text: "Tüm cümleleri tamamladın! Muhteşemsin!", filename: 'tum-cumleler-muhtesemsinn.mp3', type: 'celebration', category: 'writing' },
  { text: "Harika bir hikaye yazdın! Çok yaratıcısın!", filename: 'harika-hikaye-yaratici.mp3', type: 'celebration', category: 'writing' },
  { text: "Duygularını çok güzel ifade ettin! Bu çok önemli!", filename: 'duygularini-guzel-ifade.mp3', type: 'celebration', category: 'writing' },
];

// Temel kavramlar modülü diyalogları - Dialog.md'den güncellendi
export const BASIC_CONCEPTS_DIALOGS: StaticAudioFile[] = [
  { text: "Bu {color.name} rengi. {emoji}", filename: 'bu-renk.mp3', type: 'sentence', category: 'concepts' },
  { text: "Bu {shape.name}. {description}", filename: 'bu-sekil.mp3', type: 'sentence', category: 'concepts' },
  { text: "Bu {number.name}. {number} tane elma", filename: 'bu-sayi.mp3', type: 'sentence', category: 'concepts' },
  { text: "Bu {animal.name}. {sound} sesi çıkarır. {description}", filename: 'bu-hayvan.mp3', type: 'sentence', category: 'concepts' },
  { text: "{animal.name} {sound} der", filename: 'hayvan-ses.mp3', type: 'sentence', category: 'concepts' },
  { text: "sesi çıkarır.", filename: 'sesi-cikarir.mp3', type: 'sentence', category: 'concepts' },
  { text: "tane elma", filename: 'tane-elma.mp3', type: 'sentence', category: 'concepts' },
];

// Puzzle oyunu modülü diyalogları - Dialog.md'den
export const PUZZLE_DIALOGS: StaticAudioFile[] = [
  { text: "{category.name} kategorisini seçtin. Şimdi zorluk seviyesini seç.", filename: 'kategori-sectinn.mp3', type: 'sentence', category: 'puzzle' },
  { text: "{difficultyName} seviye seçtin. {puzzle.name} yapbozunu başlayalım!", filename: 'zorluk-sectin-baslayalim.mp3', type: 'sentence', category: 'puzzle' },
  { text: "Harika! Doğru yere koydin!", filename: 'harika-dogru-yere.mp3', type: 'celebration', category: 'puzzle' },
  { text: "Tebrikler! Yapbozu tamamladın! Çok başarılısın!", filename: 'tebrikler-yapboz-tamamlandi.mp3', type: 'celebration', category: 'puzzle' },
  { text: "Başka bir yere dene. Sen yapabilirsin!", filename: 'baska-yere-dene.mp3', type: 'sentence', category: 'puzzle' },
  { text: "seviye seçtin.", filename: 'seviye-sectin.mp3', type: 'sentence', category: 'puzzle' },
  { text: "yapbozunu başlayalım!", filename: 'yapboz-baslayalim.mp3', type: 'sentence', category: 'puzzle' },
  
  // Specific puzzle sentences - filled templates
  { text: "Hayvanlar kategorisini seçtin. Şimdi zorluk seviyesini seç.", filename: 'hayvanlar-kategorisini-sectin-zorluk-seviyesini-sec.mp3', type: 'sentence', category: 'puzzle' },
  { text: "Kolay seviye seçtin. Dostane Köpek yapbozunu başlayalım!", filename: 'kolay-seviye-sectin-dostane-kopek-yapbozunu-baslayalim.mp3', type: 'sentence', category: 'puzzle' },
];

// Hikayeler modülü diyalogları - Dialog.md'den
export const STORIES_DIALOGS: StaticAudioFile[] = [
  { text: "Bu hikaye henüz hazırlanıyor. Lütfen daha sonra tekrar deneyin.", filename: 'hikaye-hazirlanıyor.mp3', type: 'sentence', category: 'stories' },
];

// Matematik modülü diyalogları - Yeni eklenen
export const MATHEMATICS_DIALOGS: StaticAudioFile[] = [
  // Hoş geldin mesajları
  { text: 'Sayı tanıma oyununa hoş geldin! Sayıları öğrenelim.', filename: 'sayi-tanima-hosgeldin.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Sayma oyununa hoş geldin! Nesneleri sayalım.', filename: 'sayma-oyunu-hosgeldin.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Toplama oyununa hoş geldin! Sayıları toplayalım.', filename: 'toplama-oyunu-hosgeldin.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Şekil sayı oyununa hoş geldin! Şekilleri sayalım.', filename: 'sekil-sayi-hosgeldin.mp3', type: 'sentence', category: 'mathematics' },
  
  // Sorular ve yönlendirmeler
  { text: 'Şimdi quiz zamanı! Duyduğun sayıyı seç.', filename: 'quiz-zamani-sayi-sec.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Kaç tane var? Sayalım!', filename: 'kach-tane-var-sayalim.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Duyduğun sayıyı seç!', filename: 'duydugun-sayiyi-sec.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Birlikte sayalım:', filename: 'birlikte-sayalim.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Şekilleri tek tek sayalım:', filename: 'sekilleri-tek-tek-sayalim.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Toplama işlemini birlikte yapalım:', filename: 'toplama-islemini-birlikte.mp3', type: 'sentence', category: 'mathematics' },
  
  // Açıklamalar
  { text: 'Önce tane nesnemiz var', filename: 'once-tane-nesnemiz-var.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Sonra tane daha ekliyoruz', filename: 'sonra-tane-daha-ekliyoruz.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Toplam tane nesne oluyor!', filename: 'toplam-tane-nesne-oluyor.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Şekillerdeki desenleri say ve doğru sayıyı seç!', filename: 'sekillerdeki-desenleri-say.mp3', type: 'sentence', category: 'mathematics' },
  
  // Başarı mesajları
  { text: 'Aferin! Doğru sayıyı seçtin.', filename: 'aferin-dogru-sayiyi-sectin.mp3', type: 'celebration', category: 'mathematics' },
  { text: 'doğru cevap!', filename: 'dogru-cevap.mp3', type: 'celebration', category: 'mathematics' },
  { text: 'Mükemmel! eşittir !', filename: 'mukemmel-esittir.mp3', type: 'celebration', category: 'mathematics' },
  { text: 'tane var.', filename: 'tane-var.mp3', type: 'celebration', category: 'mathematics' },
  { text: 'tane !', filename: 'tane-isim.mp3', type: 'celebration', category: 'mathematics' },
  
  // Hata mesajları
  { text: 'idi. Tekrar deneyelim.', filename: 'idi-tekrar-deneyelim.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'Doğru cevap idi.', filename: 'dogru-cevap-idi.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'idi. Tekrar sayalım.', filename: 'idi-tekrar-sayalim.mp3', type: 'sentence', category: 'mathematics' },
  { text: 'vardı. Tekrar sayalım.', filename: 'vardi-tekrar-sayalim.mp3', type: 'sentence', category: 'mathematics' },

  // Matematik modülü hoş geldin mesajı
  { text: 'Toplama oyunu! Hoş geldin!', filename: 'toplama-oyunu-hosgeldin.mp3', type: 'sentence', category: 'mathematics' },
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

// Genel kutlama mesajları - Dialog.md'den tüm kutlamalar
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
  // Dialog.md'den ekstra kutlamalar
  { text: 'Harikasın! Çok güzel yaptın!', filename: 'harikasin-cok-guzel.mp3', type: 'celebration', category: 'praise' },
  { text: 'Bravo! Mükemmel bir çalışma!', filename: 'bravo-mukemmel-calisma.mp3', type: 'celebration', category: 'praise' },
  { text: 'Süpersin! Devam et böyle!', filename: 'supersin-devam-et.mp3', type: 'celebration', category: 'praise' },
  { text: 'Çok başarılısın! Harika iş!', filename: 'cok-basarilisin-harika-is.mp3', type: 'celebration', category: 'praise' },
  { text: 'Mükemmel! Devam et!', filename: 'mukemmel-devam-et.mp3', type: 'celebration', category: 'praise' },
  // Hafıza oyunu için yeni oluşturulan kutlama mesajları (Gülsu voice)
  { text: 'Harika! Eşleştirmeyi buldun!', filename: 'harika-eslestirme-buldu.mp3', type: 'celebration', category: 'vocabulary' },
  { text: 'Tebrikler! Tüm eşleştirmeleri buldun!', filename: 'tebrikler-tum-eslestirmeler.mp3', type: 'celebration', category: 'vocabulary' },
];

export const SENTENCE_MESSAGES: StaticAudioFile[] = [
  // Alfabetik sıra - static dosya adlarıyla tutarlı
  { text: 'Alfabe okuma modülüne hoş geldin! Türk alfabesinin 29 harfini birlikte öğreneceğiz.', filename: 'alfabe-hosgeldin.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Bu duygu!', filename: 'bu-duygu.mp3', type: 'sentence', category: 'concepts' },
  { text: 'Bu hayvan!', filename: 'bu-hayvan.mp3', type: 'sentence', category: 'concepts' },
  { text: 'Bu renk!', filename: 'bu-renk.mp3', type: 'sentence', category: 'concepts' },
  { text: 'Bu sayı!', filename: 'bu-sayi.mp3', type: 'sentence', category: 'concepts' },
  { text: 'Bu şekil!', filename: 'bu-sekil.mp3', type: 'sentence', category: 'concepts' },
  { text: 'Çok iyi!', filename: 'cok-iyi.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Harika!', filename: 'harika.mp3', type: 'celebration', category: 'praise' },
  { text: 'Harika bir eşleştirme!', filename: 'harika-eslestirme.mp3', type: 'celebration', category: 'vocabulary' },
  { text: 'Hayvan sesi!', filename: 'hayvan-sesi.mp3', type: 'sentence', category: 'concepts' },
  { text: 'İletişim becerisi!', filename: 'iletisim-becerisi.mp3', type: 'sentence', category: 'social' },
  { text: 'Sonraki adım!', filename: 'sonraki-adim.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Tekrar dene!', filename: 'tekrar-dene.mp3', type: 'sentence', category: 'instructions' },
  { text: 'Yanlış!', filename: 'yanlis.mp3', type: 'sentence', category: 'instructions' },
];

// Word type mesajları - hece öğretimi için
export const WORD_MESSAGES: StaticAudioFile[] = [
  { text: 'Bu hece!', filename: 'bu-hece.mp3', type: 'word', category: 'literacy' },
];

// Tüm statik ses dosyalarını birleştir - Dialog.md uyumlu
export const ALL_STATIC_AUDIO: StaticAudioFile[] = [
  ...TURKISH_LETTERS,
  ...BASIC_WORDS,
  ...HOME_PAGE_DIALOGS,
  ...ALPHABET_DIALOGS,
  ...ALPHABET_MODULE_DIALOGS,
  ...LITERACY_DIALOGS,
  ...VOCABULARY_DIALOGS,
  ...SOCIAL_COMMUNICATION_DIALOGS,
  ...SOCIAL_SKILLS_DIALOGS,
  ...WRITING_EXPRESSION_DIALOGS,
  ...BASIC_CONCEPTS_DIALOGS,
  ...PUZZLE_DIALOGS,
  ...STORIES_DIALOGS,
  ...MATHEMATICS_DIALOGS,
  ...INSTRUCTION_SENTENCES,
  ...CELEBRATION_MESSAGES,
  ...SENTENCE_MESSAGES,
  ...WORD_MESSAGES,
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