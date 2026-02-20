# Modül Bazlı Kural Sistemi - Ana İndeks

**Amaç:** Her modül için özel kurallar tanımlayarak modül bazlı işlemlerde tutarlı yaklaşım sağlamak  
**Kullanım:** Modül ile ilgili işlem yapmadan önce ilgili modül kurallarını oku ve uygula  
**Güncelleme:** 2025-01-07

## 📁 Modül Kuralları Dizini

### 🎯 Critical Priority Modüller
1. **[alphabet-reading.md](./alphabet-reading.md)** - Alfabe Okuma Modülü
   - Primary Voice: Adam (letter sounds)
   - Audio: User manages MP3 files manually
   - Focus: 29 Turkish letters with autism-friendly design

2. **[mathematics.md](./mathematics.md)** - Matematik Dünyası Modülü
   - Primary Voice: Gülsu (default character)
   - Audio: User manages math audio files
   - Focus: 1-10 numbers with visual math support

3. **[social-communication.md](./social-communication.md)** - Sosyal İletişim Modülü
   - Primary Voice: Gülsu + Antoni (storytelling)
   - Audio: User manages emotion audio files
   - Focus: Emotion recognition + social stories

### 📚 High Priority Modüller
4. **[vocabulary.md](./vocabulary.md)** - Kelime Dağarcığı Modülü
   - Primary Voice: Rachel (word pronunciation)
   - Focus: Image-word matching + memory games

5. **[basic-concepts.md](./basic-concepts.md)** - Temel Kavramlar Modülü
   - Primary Voice: Rachel (concepts) + Josh (animal sounds)
   - Focus: Colors, shapes, numbers, animals

6. **[literacy.md](./literacy.md)** - Okuryazarlık Modülü
   - Primary Voice: Adam (letters) + Rachel (words)
   - Focus: Reading progression with click-to-place system

### 🎨 Medium Priority Modüller
7. **[writing-expression.md](./writing-expression.md)** - Yazma ve İfade Modülü
   - Primary Voice: Antoni (instructions)
   - Focus: Letter tracing + creative expression

8. **[music-room.md](./music-room.md)** - Müzik Odası Modülü
   - Primary Voice: Josh (minimal voice, focus on music)
   - Focus: Therapeutic music experience

9. **[video-room.md](./video-room.md)** - Video Odası Modülü
   - Primary Voice: Antoni (video instructions)
   - Focus: Educational and calming video content

10. **[puzzle.md](./puzzle.md)** - Puzzle Oyunu Modülü
    - Primary Voice: Josh (game instructions)
    - Focus: Motor skills with drag & drop puzzles

## 🎭 Voice Character Assignments

### Gender-Balanced Voice System
```typescript
VOICE_CHARACTERS = {
  // Male Voices (60%)
  'Adam': 'Letter sounds, clear pronunciation',
  'Antoni': 'Storytelling, instructions, video guidance',
  'Josh': 'Celebrations, games, music activities',
  
  // Female Voices (40%)  
  'Rachel': 'Word pronunciation, concept explanations',
  'Gülsu': 'Default character, mathematics, social communication'
}
```

### Content-Type Voice Mapping
```typescript
CONTENT_ASSIGNMENTS = {
  letter: 'Adam',        // Harf telaffuzları
  word: 'Rachel',        // Kelime telaffuzları
  sentence: 'Antoni',    // Cümle ve yönlendirmeler
  celebration: 'Josh',   // Kutlama mesajları
  story: 'Antoni',       // Hikaye anlatımı
  instruction: 'Antoni', // Aktivite yönergeleri
  concept: 'Rachel',     // Kavram açıklamaları
  game: 'Josh'          // Oyun aktiviteleri
}
```

## 🚨 Kritik Kullanım Kuralları

### Modül İşlemi Yapmadan Önce:
1. **Kural Dosyasını Oku:** İlgili modülün .md dosyasını oku
2. **Voice Assignment Kontrol:** Doğru voice character kullan
3. **Audio File Policy:** User'ın audio yönetim tercihini honor et
4. **Autism-Friendly Check:** Tüm değişiklikler autism-friendly olmalı
5. **Test Requirements:** Modül özel test gereksinimlerini uygula

### Universal Rules (Tüm Modüller)
```typescript
UNIVERSAL_RULES = {
  voiceConsistency: 'Character continuity maintain et',
  audioManagement: 'User manages audio files manually',
  autismFriendly: 'All designs autism-accessible olmalı',
  turkishSupport: 'Full Turkish language support',
  positiveReinforcement: 'Only positive feedback use et'
}
```

### Audio File Management
- **User Control:** User manages all module-specific audio files
- **Fallback System:** Static files → ElevenLabs SDK → Web Speech API
- **Voice Consistency:** Character assignments respect et
- **Quality Standards:** 128kbps MP3, clear pronunciation

## 📋 Development Workflow

### Modül Bazlı İşlem Adımları:
1. **Modül Belirle:** Hangi modül üzerinde çalışacağını belirle
2. **Kuralları Oku:** `docs/modules/{module-name}.md` dosyasını oku
3. **Voice Check:** Doğru voice character assignments kontrol et
4. **Audio Policy:** User audio management policy'i uygula
5. **Autism Guidelines:** Autism-friendly design principles follow et
6. **Test:** Modül özel test requirements'i çalıştır

### Kural Güncelleme Süreçi:
- **User Request:** User tarafından kural değişikliği istenirse
- **Expert Review:** Otizm uzmanı onayı (sosyal iletişim için kritik)
- **Documentation Update:** İlgili modül .md dosyasını güncelle
- **Team Communication:** Değişiklikleri team'e bildir

## 📊 Quality Assurance

### Modül Kuralı Compliance Check:
- [ ] Voice character doğru assign edildi mi?
- [ ] Audio file management policy uygulandı mı?
- [ ] Autism-friendly design principles follow edildi mi?
- [ ] Turkish language support tam mı?
- [ ] Test requirements karşılandı mı?
- [ ] User control areas respect edildi mi?

---

> **Bu kural sistemi zorunludur.** Her modül işlemi öncesinde ilgili modül kurallarını okuyarak işlem yapın. Kuralların değiştirilmesi user approval gerektirir.

## 🔗 İlgili Dokümanlar

- **[docs/prd.md](../prd.md)** - Ana platform gereksinimleri
- **[lib/audio-constants.ts](../../lib/audio-constants.ts)** - Audio file mappings
- **[dialog.md](../dialog.md)** - Voice character dialog catalog
- **[docs/todo.md](../todo.md)** - Güncel development tasks 