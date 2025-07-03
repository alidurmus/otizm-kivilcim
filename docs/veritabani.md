# Veritabanı Mimarisi ve Entegrasyonu – Kıvılcım (Next.js)

Bu doküman, Kıvılcım platformunun Next.js tabanlı web uygulamasında kullanılacak veritabanı yapısını ve entegrasyon adımlarını özetler.

## 1. Kullanılan Teknoloji
- **Firebase Firestore**: Gerçek zamanlı NoSQL veritabanı
- **Firebase Authentication**: Kimlik doğrulama ve kullanıcı yönetimi

## 2. Temel Veri Modeli

```
users (Koleksiyon)
  └── {userId} (Doküman)
      ├── profile: { name, createdAt }
      ├── avatar: { character, color, accessories }
      ├── sensory_settings: { visualTheme, soundVolume, reduceMotion, hapticFeedback, rewardStyle }
      └── modules (Alt Koleksiyon)
          ├── okuryazarlik: { status, lastActivity, overallAccuracy, progress, difficultSounds }
          ├── sosyal_iletisim: { ... }
          └── ...
```

### Açıklamalar
- **users**: Tüm kullanıcıları barındıran ana koleksiyon. Her kullanıcı, Firebase Authentication ile oluşturulan benzersiz bir kimliğe (userId) sahiptir.
- **profile**: Kullanıcı adı ve kayıt tarihi gibi temel bilgiler.
- **avatar**: Oyunlaştırma ve kişiselleştirme için karakter özellikleri.
- **sensory_settings**: Duyusal kontrol paneli ayarları (tema, ses, animasyon, haptic feedback, ödül stili).
- **modules**: Her gelişim alanı için ayrı bir doküman (okuryazarlık, sosyal iletişim, vb.). Her modül dokümanı, o modüle özgü ilerleme, başarı oranı ve zorlanılan alanlar gibi detayları içerir.

## 3. Güvenlik
- Her kullanıcı yalnızca kendi verisine erişebilir (Firestore Security Rules).
- Kimlik doğrulama zorunludur.
- Firebase Güvenlik Kuralları ile "Her kullanıcı sadece kendi {userId} dokümanı altındaki verileri okuyabilir ve yazabilir." kuralı uygulanmalıdır. Bu, veri gizliliğini sağlar.

## 4. Next.js ile Entegrasyon
- [firebase](https://www.npmjs.com/package/firebase) paketi ile istemci ve sunucu tarafı entegrasyonu
- Ortak bir `firebase.js` yapılandırma dosyası
- Firestore CRUD işlemleri için özel hook veya servisler

## 5. Kaynaklar
- [Firebase Firestore Dokümantasyonu](https://firebase.google.com/docs/firestore)
- [Next.js Resmi Dokümantasyonu](https://nextjs.org/docs)

---

> Detaylı veri modeli ve örnek kodlar için `docs/architecture/kullanici-veri-mimarisi.md` ve yeni dokümantasyon dosyalarına bakınız. 