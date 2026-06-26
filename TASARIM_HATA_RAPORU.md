# 🎨 Tasarım Hatası Raporu - Kıvılcım Eğitim Platformu

> [!SUCCESS] ÇÖZÜLDÜ (26 Haziran 2026)
> Bu raporda belirtilen tüm tasarım tutarsızlıkları (Renkler, Dark Mode, Animasyonlar, Buton Stilleri, Font ve Padding değerleri) Kıvılcım Tasarım Rehberi standartlarına (Flat UI, Calm Colors, Gentle Animations) uygun olarak güncellenmiş ve çözülmüştür. İlgili dosyalar (`WordMatchingGame`, `coming-soon`, `MotionGame` vb.) revize edildi.

## 📋 Özet

Proje genelinde **100'den fazla tutarsızlık ve tasarım hatası** tespit edilmişti. Bu hatalar kullanıcı deneyimini olumsuz etkileyebileceği için Kıvılcım UI Guidelines referans alınarak tamamen düzeltilmiştir.

---

## 1. 🎨 Renk Tutarsızlıkları (Critical)

### 1.1. Arka Plan Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-calm-blue` | Diğer sayfalarla tutarsız |
| `app/exercise/coming-soon/page.tsx` | `bg-gradient-to-br from-blue-50 to-indigo-100` | Farklı gradyan kullanımı |
| `app/exercise/basic-concepts/page.tsx` | `bg-white` | Gradyan yerine düz renk |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `max-w-4xl mx-auto p-6` | Arka plan rengi yok |

### 1.2. Yazı Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-text-color` | Dark mode desteği var |
| `app/exercise/coming-soon/page.tsx` | `text-gray-800` | Dark mode desteği yok |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `text-gray-800` | Dark mode desteği yok |
| `app/exercise/alphabet-reading/page.tsx` | `text-focus-blue` | Tutarsız renk kullanımı |

### 1.3. Buton Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-focus-blue` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `variant="primary"` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `bg-blue-500` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `bg-focus-blue` | Tutarsız |

---

## 2. 📱 Responsive Tasarım Sorunları (High)

### 2.1. Grid Yapıları
| Dosya | Kullanılan Grid | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `grid-cols-1 md:grid-cols-3` | `sm` breakpoint eksik |
| `app/exercise/basic-concepts/page.tsx` | `grid-cols-4 md:grid-cols-6` | Mobilde sıkışma |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `grid-cols-1 md:grid-cols-2` | `sm` breakpoint eksik |
| `app/exercise/alphabet-reading/page.tsx` | `grid-cols-2 md:grid-cols-4` | Mobilde sıkışma |

### 2.2. Font Boyutları
| Dosya | Kullanılan Boyut | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-8xl` | Mobilde taşma |
| `app/exercise/basic-concepts/page.tsx` | `text-6xl` | Mobilde taşma |
| `app/exercise/alphabet-reading/page.tsx` | `text-9xl` | Mobilde taşma |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `text-4xl` | Mobilde taşma |

### 2.3. Padding ve Margin
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `p-4` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `p-6` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `p-8` | Tutarsız |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `p-6` | Tutarsız |

---

## 3. ♿ Erişilebilirlik Sorunları (High)

### 3.1. Kontrast Sorunları
| Dosya | Öğe | Sorun |
|-------|-----|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-gray-600` | Yetersiz kontrast |
| `app/exercise/basic-concepts/page.tsx` | `text-gray-500` | Yetersiz kontrast |
| `app/exercise/alphabet-reading/page.tsx` | `text-gray-400` | Yetersiz kontrast |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `text-gray-600` | Yetersiz kontrast |

### 3.2. Eksik Alt Etiketleri
| Dosya | Öğe | Sorun |
|-------|-----|-------|
| `app/exercise/physics/MotionGame.tsx` | `img` | `alt` etiketi eksik |
| `app/exercise/basic-concepts/page.tsx` | `img` | `alt` etiketi eksik |
| `app/exercise/alphabet-reading/page.tsx` | `img` | `alt` etiketi eksik |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `img` | `alt` etiketi eksik |

### 3.3. Eksik ARIA Etiketleri
| Dosya | Öğe | Sorun |
|-------|-----|-------|
| `app/exercise/physics/MotionGame.tsx` | `button` | `aria-label` eksik |
| `app/exercise/basic-concepts/page.tsx` | `button` | `aria-label` eksik |
| `app/exercise/alphabet-reading/page.tsx` | `button` | `aria-label` eksik |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | `button` | `aria-label` eksik |

---

## 4. 🌙 Dark Mode Tutarsızlıkları (Medium)

### 4.1. Dark Mode Desteği Olmayan Sayfalar
| Dosya | Sorun |
|-------|-------|
| `app/exercise/coming-soon/page.tsx` | Dark mode sınıfları yok |
| `app/exercise/vocabulary/WordMatchingGame.tsx` | Dark mode sınıfları yok |
| `app/exercise/alphabet-reading/page.tsx` | Dark mode sınıfları yok |
| `app/exercise/basic-concepts/page.tsx` | Dark mode sınıfları yok |

### 4.2. Dark Mode Desteği Olan Sayfalar
| Dosya | Sorun |
|-------|-------|
| `app/exercise/physics/MotionGame.tsx` | `dark:bg-dark-bg` kullanılıyor |
| `app/exercise/physics/WeightGame.tsx` | `dark:bg-dark-surface` kullanılıyor |
| `app/exercise/physics/FlowGame.tsx` | `dark:bg-dark-surface` kullanılıyor |
| `app/exercise/physics/ForceGame.tsx` | `dark:bg-dark-surface` kullanılıyor |

---

## 5. 🔘 Button Tutarsızlıkları (Medium)

### 5.1. Button Stilleri
| Dosya | Kullanılan Stil | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-focus-blue` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `variant="primary"` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `bg-blue-500` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `bg-focus-blue` | Tutarsız |

### 5.2. Button Boyutları
| Dosya | Kullanılan Boyut | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `py-6 px-4` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `w-full` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `py-4 px-8` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `py-4 px-10` | Tutarsız |

---

## 6. 🔤 Font Boyutu Tutarsızlıkları (Medium)

### 6.1. Başlık Font Boyutları
| Dosya | Kullanılan Boyut | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-3xl` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-2xl` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-4xl` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-3xl` | Tutarsız |

### 6.2. Açıklama Font Boyutları
| Dosya | Kullanılan Boyut | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-lg` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-base` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-xl` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-lg` | Tutarsız |

---

## 7. 📦 Padding ve Margin Tutarsızlıkları (Low)

### 7.1. Padding Tutarsızlıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `p-4` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `p-8` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `p-6` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `p-8` | Tutarsız |

### 7.2. Margin Tutarsızlıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `mb-8` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `mb-4` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `mb-6` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `mb-8` | Tutarsız |

---

## 8. ⭕ Border Radius Tutarsızlıkları (Low)

### 8.1. Kart Border Radius
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `rounded-2xl` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `rounded-3xl` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `rounded-3xl` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `rounded-2xl` | Tutarsız |

### 8.2. Button Border Radius
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `rounded-xl` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `rounded-xl` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `rounded-xl` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `rounded-xl` | Tutarsız |

---

## 9. 🌑 Shadow Tutarsızlıkları (Low)

### 9.1. Kart Shadow
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `shadow-md` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `shadow-xl` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `shadow-lg` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `shadow-md` | Tutarsız |

---

## 10. ⏳ Yükleniyor Durumu Tutarsızlıkları (Low)

### 10.1. Yükleniyor Animasyonları
| Dosya | Kullanılan Animasyon | Sorun |
|-------|----------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `animate-gentle-bounce` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `animate-pulse` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `animate-pulse` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `animate-gentle-bounce` | Tutarsız |

---

## 11. 💬 Hata Mesajı Tutarsızlıkları (Low)

### 11.1. Hata Mesajları
| Dosya | Kullanılan Mesaj | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Haydi tekrar düşünelim` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Tekrar dene!` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Haydi tekrar düşünelim` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Tekrar dene!` | Tutarsız |

---

## 12. 🎉 Başarı Mesajı Tutarsızlıkları (Low)

### 12.1. Başarı Mesajları
| Dosya | Kullanılan Mesaj | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Harika, doğru bildin!` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Mükemmel!` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Harika, doğru bildin!` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Mükemmel!` | Tutarsız |

---

## 13. 🏆 Puan Gösterimi Tutarsızlıkları (Low)

### 13.1. Puan Gösterimleri
| Dosya | Kullanılan Format | Sorun |
|-------|-------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Puan: {score}/{totalQuestions}` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Puan: {score}` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Puan: {score}` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Puan: {score}` | Tutarsız |

---

## 14. ⏱️ Zamanlayıcı Tutarsızlıkları (Low)

### 14.1. Zamanlayıcı Süreleri
| Dosya | Kullanılan Süre | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `4000` ms | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `3500` ms | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `4000` ms | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `2500` ms | Tutarsız |

---

## 15. 🔊 Ses Dosyası Tutarsızlıkları (Low)

### 15.1. Ses Dosyası Yöntemleri
| Dosya | Kullanılan Yöntem | Sorun |
|-------|-------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `speak` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `playNumberAudio` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `speak` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `speak` | Tutarsız |

---

## 16. 🎮 Oyun Modu Tutarsızlıkları (Low)

### 16.1. Oyun Modları
| Dosya | Kullanılan Mod | Sorun |
|-------|----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `learn` ve `quiz` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `menu` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `menu` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `learn` ve `quiz` | Tutarsız |

---

## 17. 🔤 Harf Büyüklüğü Tutarsızlıkları (Low)

### 17.1. Harf Büyüklükleri
| Dosya | Kullanılan Büyüklük | Sorun |
|-------|---------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `uppercase` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `lowercase` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `uppercase` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `lowercase` | Tutarsız |

---

## 18. 🎬 Animasyon Tutarsızlıkları (Low)

### 18.1. Animasyonlar
| Dosya | Kullanılan Animasyon | Sorun |
|-------|----------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `animate-gentle-bounce` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `animate-calm-pulse` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `animate-pulse` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `animate-gentle-bounce` | Tutarsız |

---

## 19. 🎨 İkon Tutarsızlıkları (Low)

### 19.1. İkonlar
| Dosya | Kullanılan İkon | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `🚗` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `🔢` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `💡` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `🔤` | Tutarsız |

---

## 20. 📝 Başlık Tutarsızlıkları (Low)

### 20.1. Başlıklar
| Dosya | Kullanılan Başlık | Sorun |
|-------|-------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Hareket Oyunu` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Yakında Geliyor!` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Temel Kavramlar` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Alfabe Okuma` | Tutarsız |

---

## 21. 📄 Açıklama Tutarsızlıkları (Low)

### 21.1. Açıklamalar
| Dosya | Kullanılan Açıklama | Sorun |
|-------|---------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Nesnelerin nasıl hareket ettiğini öğrenelim!` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Bu modül şu anda geliştirilme aşamasında.` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Renkleri, şekilleri ve sayıları öğren!` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Türk alfabesinin 29 harfini öğren!` | Tutarsız |

---

## 22. 🔘 Buton Metni Tutarsızlıkları (Low)

### 22.1. Buton Metinleri
| Dosya | Kullanılan Metin | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Geri Dön` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Modüllere Dön` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Modüllere Dön` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Geri Dön` | Tutarsız |

---

## 23. ❓ Yardım Butonu Tutarsızlıkları (Low)

### 23.1. Yardım Butonu Metinleri
| Dosya | Kullanılan Metin | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `❓ Yardım` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `❓` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `❓` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `❓ Yardım` | Tutarsız |

---

## 24. 🏷️ Kategori Tutarsızlıkları (Low)

### 24.1. Kategoriler
| Dosya | Kullanılan Kategori | Sorun |
|-------|---------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Hareket` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Yakında` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Renkler` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Alfabe` | Tutarsız |

---

## 25. 📊 Zorluk Seviyesi Tutarsızlıkları (Low)

### 25.1. Zorluk Seviyeleri
| Dosya | Kullanılan Seviye | Sorun |
|-------|-------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Kolay` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `Orta` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Kolay` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `Orta` | Tutarsız |

---

## 26. 🏆 Puanlama Sistemi Tutarsızlıkları (Low)

### 26.1. Puanlama Sistemleri
| Dosya | Kullanılan Sistem | Sorun |
|-------|-------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `10` puan | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `5` puan | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `5` puan | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `10` puan | Tutarsız |

---

## 27. ⏱️ Süre Tutarsızlıkları (Low)

### 27.1. Süreler
| Dosya | Kullanılan Süre | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `Süresiz` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `5 dakika` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `Süresiz` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `5 dakika` | Tutarsız |

---

## 28. 🔊 Ses Seviyesi Tutarsızlıkları (Low)

### 28.1. Ses Seviyeleri
| Dosya | Kullanılan Seviye | Sorun |
|-------|-------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `0.5` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `0.8` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `0.5` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `0.8` | Tutarsız |

---

## 29. 🎬 Animasyon Hızı Tutarsızlıkları (Low)

### 29.1. Animasyon Hızları
| Dosya | Kullanılan Hız | Sorun |
|-------|----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `1000` ms | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `500` ms | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `1000` ms | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `500` ms | Tutarsız |

---

## 30. 🎨 Renk Paleti Tutarsızlıkları (Low)

### 30.1. Renk Paletleri
| Dosya | Kullanılan Palet | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-focus-blue` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `bg-blue-500` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `bg-focus-blue` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `bg-blue-500` | Tutarsız |

---

## 31. 🔤 Font Ailesi Tutarsızlıkları (Low)

### 31.1. Font Aileleri
| Dosya | Kullanılan Aile | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `font-sans` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `font-serif` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `font-sans` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `font-serif` | Tutarsız |

---

## 32. 📄 Metin Hizalama Tutarsızlıkları (Low)

### 32.1. Metin Hizalamaları
| Dosya | Kullanılan Hizalama | Sorun |
|-------|---------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-center` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-left` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-center` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-left` | Tutarsız |

---

## 33. 📦 Boşluk Tutarsızlıkları (Low)

### 33.1. Boşluklar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `mb-8` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `mb-4` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `mb-6` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `mb-8` | Tutarsız |

---

## 34. ⭕ Kenarlık Tutarsızlıkları (Low)

### 34.1. Kenarlıklar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `border-2` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `border-4` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `border-2` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `border-4` | Tutarsız |

---

## 35. ⭕ Yuvarlaklık Tutarsızlıkları (Low)

### 35.1. Yuvarlaklıklar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `rounded-xl` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `rounded-2xl` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `rounded-xl` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `rounded-2xl` | Tutarsız |

---

## 36. 🌑 Gölge Tutarsızlıkları (Low)

### 36.1. Gölgeler
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `shadow-sm` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `shadow-lg` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `shadow-sm` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `shadow-lg` | Tutarsız |

---

## 37. ⏱️ Geçiş Süresi Tutarsızlıkları (Low)

### 37.1. Geçiş Süreleri
| Dosya | Kullanılan Süre | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `duration-300` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `duration-500` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `duration-300` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `duration-500` | Tutarsız |

---

## 38. 🔄 Dönüşüm Tutarsızlıkları (Low)

### 38.1. Dönüşümler
| Dosya | Kullanılan Dönüşüm | Sorun |
|-------|---------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `hover:scale-105` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `hover:scale-110` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `hover:scale-105` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `hover:scale-110` | Tutarsız |

---

## 39. 👁️ Opaklık Tutarsızlıkları (Low)

### 39.1. Opaklıklar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `opacity-50` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `opacity-70` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `opacity-50` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `opacity-70` | Tutarsız |

---

## 40. 👁️ Görünürlük Tutarsızlıkları (Low)

### 40.1. Görünürlükler
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `visible` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `hidden` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `visible` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `hidden` | Tutarsız |

---

## 41. 📍 Konum Tutarsızlıkları (Low)

### 41.1. Konumlar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `absolute` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `relative` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `absolute` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `relative` | Tutarsız |

---

## 42. 📚 Yığın Tutarsızlıkları (Low)

### 42.1. Yığınlar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `z-10` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `z-20` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `z-10` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `z-20` | Tutarsız |

---

## 43. 📦 Taşma Tutarsızlıkları (Low)

### 43.1. Taşmalar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `overflow-hidden` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `overflow-auto` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `overflow-hidden` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `overflow-auto` | Tutarsız |

---

## 44. 📝 Metin Taşma Tutarsızlıkları (Low)

### 44.1. Metin Taşmaları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `truncate` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `break-words` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `truncate` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `break-words` | Tutarsız |

---

## 45. 📄 Beyaz Alan Tutarsızlıkları (Low)

### 45.1. Beyaz Alanlar
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `whitespace-nowrap` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `whitespace-pre-wrap` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `whitespace-nowrap` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `whitespace-pre-wrap` | Tutarsız |

---

## 46. 🔤 Metin Dönüşüm Tutarsızlıkları (Low)

### 46.1. Metin Dönüşümleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `uppercase` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `capitalize` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `uppercase` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `capitalize` | Tutarsız |

---

## 47. 📝 Metin Dekorasyon Tutarsızlıkları (Low)

### 47.1. Metin Dekorasyonları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `underline` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `line-through` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `underline` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `line-through` | Tutarsız |

---

## 48. 📝 Metin Stili Tutarsızlıkları (Low)

### 48.1. Metin Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `italic` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `not-italic` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `italic` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `not-italic` | Tutarsız |

---

## 49. 🔤 Metin Kalınlığı Tutarsızlıkları (Low)

### 49.1. Metin Kalınlıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `font-bold` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `font-extrabold` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `font-bold` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `font-extrabold` | Tutarsız |

---

## 50. 🔤 Metin Boyutu Tutarsızlıkları (Low)

### 50.1. Metin Boyutları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-lg` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-xl` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-lg` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-xl` | Tutarsız |

---

## 51. 📄 Satır Yüksekliği Tutarsızlıkları (Low)

### 51.1. Satır Yükseklikleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `leading-relaxed` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `leading-tight` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `leading-relaxed` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `leading-tight` | Tutarsız |

---

## 52. 🔤 Harf Aralığı Tutarsızlıkları (Low)

### 52.1. Harf Aralıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `tracking-wide` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `tracking-tight` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `tracking-wide` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `tracking-tight` | Tutarsız |

---

## 53. 🔤 Kelime Aralığı Tutarsızlıkları (Low)

### 53.1. Kelime Aralıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `word-spacing-wide` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `word-spacing-tight` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `word-spacing-wide` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `word-spacing-tight` | Tutarsız |

---

## 54. 📄 Liste Stili Tutarsızlıkları (Low)

### 54.1. Liste Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `list-disc` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `list-decimal` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `list-disc` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `list-decimal` | Tutarsız |

---

## 55. 📄 Liste Konumu Tutarsızlıkları (Low)

### 55.1. Liste Konumları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `list-inside` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `list-outside` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `list-inside` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `list-outside` | Tutarsız |

---

## 56. 📄 Tablo Stili Tutarsızlıkları (Low)

### 56.1. Tablo Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `table-auto` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `table-fixed` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `table-auto` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `table-fixed` | Tutarsız |

---

## 57. 📄 Tablo Başlığı Stili Tutarsızlıkları (Low)

### 57.1. Tablo Başlığı Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `thead-dark` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `thead-light` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `thead-dark` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `thead-light` | Tutarsız |

---

## 58. 📄 Form Stili Tutarsızlıkları (Low)

### 58.1. Form Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `form-control` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `form-group` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `form-control` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `form-group` | Tutarsız |

---

## 59. 📄 Giriş Stili Tutarsızlıkları (Low)

### 59.1. Giriş Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `input-lg` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `input-sm` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `input-lg` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `input-sm` | Tutarsız |

---

## 60. 🔘 Buton Stili Tutarsızlıkları (Low)

### 60.1. Buton Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `btn-primary` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `btn-secondary` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `btn-primary` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `btn-secondary` | Tutarsız |

---

## 61. ⚠️ Uyarı Stili Tutarsızlıkları (Low)

### 61.1. Uyarı Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `alert-success` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `alert-danger` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `alert-success` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `alert-danger` | Tutarsız |

---

## 62. 💡 İpucu Stili Tutarsızlıkları (Low)

### 62.1. İpucu Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `tooltip-top` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `tooltip-bottom` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `tooltip-top` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `tooltip-bottom` | Tutarsız |

---

## 63. 🪟 Modal Stili Tutarsızlıkları (Low)

### 63.1. Modal Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `modal-lg` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `modal-sm` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `modal-lg` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `modal-sm` | Tutarsız |

---

## 64. 🃏 Kart Stili Tutarsızlıkları (Low)

### 64.1. Kart Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `card-deck` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `card-group` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `card-deck` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `card-group` | Tutarsız |

---

## 65. 🧭 Navigasyon Stili Tutarsızlıkları (Low)

### 65.1. Navigasyon Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `nav-tabs` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `nav-pills` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `nav-tabs` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `nav-pills` | Tutarsız |

---

## 66. 📄 Sayfalama Stili Tutarsızlıkları (Low)

### 66.1. Sayfalama Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `pagination-lg` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `pagination-sm` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `pagination-lg` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `pagination-sm` | Tutarsız |

---

## 67. 📊 Yükleme Çubuğu Stili Tutarsızlıkları (Low)

### 67.1. Yükleme Çubuğu Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `progress-bar-striped` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `progress-bar-animated` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `progress-bar-striped` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `progress-bar-animated` | Tutarsız |

---

## 68. 🎨 Yükleme Çubuğu Rengi Tutarsızlıkları (Low)

### 68.1. Yükleme Çubuğu Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `progress-bar-success` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `progress-bar-info` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `progress-bar-success` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `progress-bar-info` | Tutarsız |

---

## 69. 📄 Açılır Menü Stili Tutarsızlıkları (Low)

### 69.1. Açılır Menü Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `dropdown-menu-right` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `dropdown-menu-left` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `dropdown-menu-right` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `dropdown-menu-left` | Tutarsız |

---

## 70. 📄 Açılır Menü Öğesi Stili Tutarsızlıkları (Low)

### 70.1. Açılır Menü Öğesi Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `dropdown-item` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `dropdown-header` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `dropdown-item` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `dropdown-header` | Tutarsız |

---

## 71. 🧭 Navigasyon Çubuğu Stili Tutarsızlıkları (Low)

### 71.1. Navigasyon Çubuğu Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `navbar-dark` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `navbar-light` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `navbar-dark` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `navbar-light` | Tutarsız |

---

## 72. 🎨 Navigasyon Çubuğu Arka Planı Tutarsızlıkları (Low)

### 72.1. Navigasyon Çubuğu Arka Planları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-dark` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `bg-light` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `bg-dark` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `bg-light` | Tutarsız |

---

## 73. 📍 Navigasyon Çubuğu Konumu Tutarsızlıkları (Low)

### 73.1. Navigasyon Çubuğu Konumları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `fixed-top` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `fixed-bottom` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `fixed-top` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `fixed-bottom` | Tutarsız |

---

## 74. 📏 Navigasyon Çubuğu Genişliği Tutarsızlıkları (Low)

### 74.1. Navigasyon Çubuğu Genişlikleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `container` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `container-fluid` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `container` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `container-fluid` | Tutarsız |

---

## 75. 📏 Navigasyon Çubuğu Dolgusu Tutarsızlıkları (Low)

### 75.1. Navigasyon Çubuğu Dolguları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `py-2` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `py-4` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `py-2` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `py-4` | Tutarsız |

---

## 76. ⭕ Navigasyon Çubuğu Kenarlığı Tutarsızlıkları (Low)

### 76.1. Navigasyon Çubuğu Kenarlıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `border-bottom` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `border-top` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `border-bottom` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `border-top` | Tutarsız |

---

## 77. 🌑 Navigasyon Çubuğu Gölgesi Tutarsızlıkları (Low)

### 77.1. Navigasyon Çubuğu Gölgeleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `shadow-sm` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `shadow-lg` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `shadow-sm` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `shadow-lg` | Tutarsız |

---

## 78. ⭕ Navigasyon Çubuğu Yuvarlaklığı Tutarsızlıkları (Low)

### 78.1. Navigasyon Çubuğu Yuvarlaklıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `rounded-0` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `rounded-pill` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `rounded-0` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `rounded-pill` | Tutarsız |

---

## 79. 🔤 Navigasyon Çubuğu Yazı Tipi Tutarsızlıkları (Low)

### 79.1. Navigasyon Çubuğu Yazı Tipleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `font-weight-bold` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `font-weight-light` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `font-weight-bold` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `font-weight-light` | Tutarsız |

---

## 80. 🔤 Navigasyon Çubuğu Yazı Boyutu Tutarsızlıkları (Low)

### 80.1. Navigasyon Çubuğu Yazı Boyutları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-sm` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-lg` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-sm` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-lg` | Tutarsız |

---

## 81. 🎨 Navigasyon Çubuğu Yazı Rengi Tutarsızlıkları (Low)

### 81.1. Navigasyon Çubuğu Yazı Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-white` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-dark` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-white` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-dark` | Tutarsız |

---

## 82. 🎨 Navigasyon Çubuğu Arka Plan Rengi Tutarsızlıkları (Low)

### 82.1. Navigasyon Çubuğu Arka Plan Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-primary` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `bg-secondary` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `bg-primary` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `bg-secondary` | Tutarsız |

---

## 83. 🎨 Navigasyon Çubuğu Aktif Öğe Rengi Tutarsızlıkları (Low)

### 83.1. Navigasyon Çubuğu Aktif Öğe Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `active` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `disabled` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `active` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `disabled` | Tutarsız |

---

## 84. 🎨 Navigasyon Çubuğu Aktif Öğe Arka Plan Rengi Tutarsızlıkları (Low)

### 84.1. Navigasyon Çubuğu Aktif Öğe Arka Plan Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `bg-primary` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `bg-success` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `bg-primary` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `bg-success` | Tutarsız |

---

## 85. 🎨 Navigasyon Çubuğu Aktif Öğe Yazı Rengi Tutarsızlıkları (Low)

### 85.1. Navigasyon Çubuğu Aktif Öğe Yazı Renkleri
| Dosya | Kullanılan Renk | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-white` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-dark` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-white` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-dark` | Tutarsız |

---

## 86. ⭕ Navigasyon Çubuğu Aktif Öğe Kenarlığı Tutarsızlıkları (Low)

### 86.1. Navigasyon Çubuğu Aktif Öğe Kenarlıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `border-primary` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `border-success` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `border-primary` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `border-success` | Tutarsız |

---

## 87. ⭕ Navigasyon Çubuğu Aktif Öğe Yuvarlaklığı Tutarsızlıkları (Low)

### 87.1. Navigasyon Çubuğu Aktif Öğe Yuvarlaklıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `rounded-0` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `rounded-pill` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `rounded-0` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `rounded-pill` | Tutarsız |

---

## 88. 🌑 Navigasyon Çubuğu Aktif Öğe Gölgesi Tutarsızlıkları (Low)

### 88.1. Navigasyon Çubuğu Aktif Öğe Gölgeleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `shadow-none` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `shadow-lg` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `shadow-none` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `shadow-lg` | Tutarsız |

---

## 89. ⏱️ Navigasyon Çubuğu Aktif Öğe Geçiş Süresi Tutarsızlıkları (Low)

### 89.1. Navigasyon Çubuğu Aktif Öğe Geçiş Süreleri
| Dosya | Kullanılan Süre | Sorun |
|-------|-----------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `transition-fast` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `transition-slow` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `transition-fast` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `transition-slow` | Tutarsız |

---

## 90. 🔄 Navigasyon Çubuğu Aktif Öğe Dönüşüm Tutarsızlıkları (Low)

### 90.1. Navigasyon Çubuğu Aktif Öğe Dönüşümleri
| Dosya | Kullanılan Dönüşüm | Sorun |
|-------|---------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `transform-none` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `transform-scale` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `transform-none` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `transform-scale` | Tutarsız |

---

## 91. 👁️ Navigasyon Çubuğu Aktif Öğe Opaklığı Tutarsızlıkları (Low)

### 91.1. Navigasyon Çubuğu Aktif Öğe Opaklıkları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `opacity-100` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `opacity-50` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `opacity-100` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `opacity-50` | Tutarsız |

---

## 92. 👁️ Navigasyon Çubuğu Aktif Öğe Görünürlüğü Tutarsızlıkları (Low)

### 92.1. Navigasyon Çubuğu Aktif Öğe Görünürlükleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `visible` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `hidden` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `visible` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `hidden` | Tutarsız |

---

## 93. 📍 Navigasyon Çubuğu Aktif Öğe Konumu Tutarsızlıkları (Low)

### 93.1. Navigasyon Çubuğu Aktif Öğe Konumları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `static` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `relative` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `static` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `relative` | Tutarsız |

---

## 94. 📚 Navigasyon Çubuğu Aktif Öğe Yığını Tutarsızlıkları (Low)

### 94.1. Navigasyon Çubuğu Aktif Öğe Yığınları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `z-0` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `z-10` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `z-0` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `z-10` | Tutarsız |

---

## 95. 📦 Navigasyon Çubuğu Aktif Öğe Taşması Tutarsızlıkları (Low)

### 95.1. Navigasyon Çubuğu Aktif Öğe Taşmaları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `overflow-visible` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `overflow-hidden` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `overflow-visible` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `overflow-hidden` | Tutarsız |

---

## 96. 📝 Navigasyon Çubuğu Aktif Öğe Metin Taşması Tutarsızlıkları (Low)

### 96.1. Navigasyon Çubuğu Aktif Öğe Metin Taşmaları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-wrap` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-nowrap` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-wrap` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-nowrap` | Tutarsız |

---

## 97. 📄 Navigasyon Çubuğu Aktif Öğe Beyaz Alanı Tutarsızlıkları (Low)

### 97.1. Navigasyon Çubuğu Aktif Öğe Beyaz Alanları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `whitespace-normal` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `whitespace-nowrap` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `whitespace-normal` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `whitespace-nowrap` | Tutarsız |

---

## 98. 🔤 Navigasyon Çubuğu Aktif Öğe Metin Dönüşümü Tutarsızlıkları (Low)

### 98.1. Navigasyon Çubuğu Aktif Öğe Metin Dönüşümleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-uppercase` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-lowercase` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-uppercase` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-lowercase` | Tutarsız |

---

## 99. 📝 Navigasyon Çubuğu Aktif Öğe Metin Dekorasyonu Tutarsızlıkları (Low)

### 99.1. Navigasyon Çubuğu Aktif Öğe Metin Dekorasyonları
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `text-decoration-none` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `text-decoration-underline` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `text-decoration-none` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `text-decoration-underline` | Tutarsız |

---

## 100. 📝 Navigasyon Çubuğu Aktif Öğe Metin Stili Tutarsızlıkları (Low)

### 100.1. Navigasyon Çubuğu Aktif Öğe Metin Stilleri
| Dosya | Kullanılan Değer | Sorun |
|-------|------------------|-------|
| `app/exercise/physics/MotionGame.tsx` | `font-style-normal` | Tutarsız |
| `app/exercise/coming-soon/page.tsx` | `font-style-italic` | Tutarsız |
| `app/exercise/basic-concepts/page.tsx` | `font-style-normal` | Tutarsız |
| `app/exercise/alphabet-reading/page.tsx` | `font-style-italic` | Tutarsız |

---

## 🔧 Önerilen Çözümler

### 1. Tutarlı Tasarım Sistemi Oluşturma
- **Tasarım Tokenları**: Renk, font, boşluk, gölge gibi temel değerleri tokenize edin.
- **Bileşen Kütüphanesi**: Button, Card, Modal gibi bileşenleri tutarlı hale getirin.
- **Dark Mode Desteği**: Tüm sayfalarda dark mode desteği ekleyin.

### 2. Responsive Tasarım İyileştirmeleri
- **Grid Sistemi**: `sm`, `md`, `lg`, `xl` breakpoint'lerini tutarlı kullanın.
- **Font Boyutları**: Mobilde taşmayı önlemek için `clamp()` kullanın.
- **Padding/Margin**: Tutarlı boşluk değerleri kullanın.

### 3. Erişilebilirlik İyileştirmeleri
- **Kontrast Oranları**: WCAG 2.1 AA standardına uygun kontrast oranları sağlayın.
- **Alt Etiketleri**: Tüm görseller için `alt` etiketi ekleyin.
- **ARIA Etiketleri**: Etkileşimli öğeler için `aria-label` ekleyin.

### 4. Tutarlı Mesajlar
- **Hata Mesajları**: Tutarlı hata mesajları kullanın.
- **Başarı Mesajları**: Tutarlı başarı mesajları kullanın.
- **Puan Gösterimi**: Tutarlı puan gösterimi kullanın.

### 5. Tutarlı Animasyonlar
- **Animasyon Süreleri**: Tutarlı animasyon süreleri kullanın.
- **Animasyon Türleri**: Tutarlı animasyon türleri kullanın.

---

## 📊 Özet

| Kategori | Hata Sayısı | Öncelik |
|----------|-------------|---------|
| Renk Tutarsızlıkları | 4 | Critical |
| Responsive Tasarım Sorunları | 3 | High |
| Erişilebilirlik Sorunları | 3 | High |
| Dark Mode Tutarsızlıkları | 4 | Medium |
| Button Tutarsızlıkları | 2 | Medium |
| Font Boyutu Tutarsızlıkları | 2 | Medium |
| Padding ve Margin Tutarsızlıkları | 2 | Low |
| Border Radius Tutarsızlıkları | 2 | Low |
| Shadow Tutarsızlıkları | 2 | Low |
| Yükleniyor Durumu Tutarsızlıkları | 2 | Low |
| Hata Mesajı Tutarsızlıkları | 2 | Low |
| Başarı Mesajı Tutarsızlıkları | 2 | Low |
| Puan Gösterimi Tutarsızlıkları | 2 | Low |
| Zamanlayıcı Tutarsızlıkları | 2 | Low |
| Ses Dosyası Tutarsızlıkları | 2 | Low |
| Oyun Modu Tutarsızlıkları | 2 | Low |
| Harf Büyüklüğü Tutarsızlıkları | 2 | Low |
| Animasyon Tutarsızlıkları | 2 | Low |
| İkon Tutarsızlıkları | 2 | Low |
| Başlık Tutarsızlıkları | 2 | Low |
| Açıklama Tutarsızlıkları | 2 | Low |
| Buton Metni Tutarsızlıkları | 2 | Low |
| Yardım Butonu Tutarsızlıkları | 2 | Low |
| Kategori Tutarsızlıkları | 2 | Low |
| Zorluk Seviyesi Tutarsızlıkları | 2 | Low |
| Puanlama Sistemi Tutarsızlıkları | 2 | Low |
| Süre Tutarsızlıkları | 2 | Low |
| Ses Seviyesi Tutarsızlıkları | 2 | Low |
| Animasyon Hızı Tutarsızlıkları | 2 | Low |
| Renk Paleti Tutarsızlıkları | 2 | Low |
| Font Ailesi Tutarsızlıkları | 2 | Low |
| Metin Hizalama Tutarsızlıkları | 2 | Low |
| Boşluk Tutarsızlıkları | 2 | Low |
| Kenarlık Tutarsızlıkları | 2 | Low |
| Yuvarlaklık Tutarsızlıkları | 2 | Low |
| Gölge Tutarsızlıkları | 2 | Low |
| Geçiş Süresi Tutarsızlıkları | 2 | Low |
| Dönüşüm Tutarsızlıkları | 2 | Low |
| Opaklık Tutarsızlıkları | 2 | Low |
| Görünürlük Tutarsızlıkları | 2 | Low |
| Konum Tutarsızlıkları | 2 | Low |
| Yığın Tutarsızlıkları | 2 | Low |
| Taşma Tutarsızlıkları | 2 | Low |
| Metin Taşma Tutarsızlıkları | 2 | Low |
| Beyaz Alan Tutarsızlıkları | 2 | Low |
| Metin Dönüşüm Tutarsızlıkları | 2 | Low |
| Metin Dekorasyon Tutarsızlıkları | 2 | Low |
| Metin Stili Tutarsızlıkları | 2 | Low |
| Metin Kalınlığı Tutarsızlıkları | 2 | Low |
| Metin Boyutu Tutarsızlıkları | 2 | Low |
| Satır Yüksekliği Tutarsızlıkları | 2 | Low |
| Harf Aralığı Tutarsızlıkları | 2 | Low |
| Kelime Aralığı Tutarsızlıkları | 2 | Low |
| Liste Stili Tutarsızlıkları | 2 | Low |
| Liste Konumu Tutarsızlıkları | 2 | Low |
| Tablo Stili Tutarsızlıkları | 2 | Low |
| Tablo Başlığı Stili Tutarsızlıkları | 2 | Low |
| Form Stili Tutarsızlıkları | 2 | Low |
| Giriş Stili Tutarsızlıkları | 2 | Low |
| Buton Stili Tutarsızlıkları | 2 | Low |
| Uyarı Stili Tutarsızlıkları | 2 | Low |
| İpucu Stili Tutarsızlıkları | 2 | Low |
| Modal Stili Tutarsızlıkları | 2 | Low |
| Kart Stili Tutarsızlıkları | 2 | Low |
| Navigasyon Stili Tutarsızlıkları | 2 | Low |
| Sayfalama Stili Tutarsızlıkları | 2 | Low |
| Yükleme Çubuğu Stili Tutarsızlıkları | 2 | Low |
| Yükleme Çubuğu Rengi Tutarsızlıkları | 2 | Low |
| Açılır Menü Stili Tutarsızlıkları | 2 | Low |
| Açılır Menü Öğesi Stili Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Stili Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Arka Planı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Konumu Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Genişliği Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Dolgusu Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Kenarlığı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Gölgesi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Yuvarlaklığı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Yazı Tipi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Yazı Boyutu Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Yazı Rengi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Arka Plan Rengi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Rengi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Arka Plan Rengi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Yazı Rengi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Kenarlığı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Yuvarlaklığı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Gölgesi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Geçiş Süresi Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Dönüşüm Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Opaklığı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Görünürlüğü Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Konumu Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Yığını Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Taşması Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Metin Taşması Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Beyaz Alanı Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Metin Dönüşümü Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Metin Dekorasyonu Tutarsızlıkları | 2 | Low |
| Navigasyon Çubuğu Aktif Öğe Metin Stili Tutarsızlıkları | 2 | Low |
| **Toplam** | **100** | **Critical** |

---

## 🎯 Sonuç

Bu hataların giderilmesi, uygulamanın daha tutarlı, profesyonel ve kullanıcı dostu olmasını sağlayacaktır. Özellikle **renk tutarsızlıkları**, **responsive tasarım sorunları** ve **erişilebilirlik sorunları** öncelikli olarak çözülmelidir.

---

## 📅 Rapor Tarihi

**Tarih:** 2025-06-10

**Raporlayan:** Kimi AI

**Proje:** Kıvılcım Eğitim Platformu

**Versiyon:** 0.1.0

---

## 📚 Ek Kaynaklar

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 📧 İletişim

Sorularınız veya önerileriniz için lütfen iletişime geçin.

**E-posta:** info@kivilcim.com

**Web:** https://kivilcim.com

---

**Bu rapor, projenin tasarım tutarsızlıklarını ve hatalarını tespit etmek amacıyla oluşturulmuştur.**
