# Kıvılcım - Yapay Zeka (AI) Davranış Kuralları

Bu belge, "Kıvılcım: Otizm Dostu Eğitim Platformu" üzerinde çalışan her türlü yapay zeka ajanının (AI Coder, Assistant) uyması gereken **Project-Scoped Rules** kümesini tanımlar.

## 1. Temel Proje Felsefesi (Otizm Dostu Tasarım)
Tüm kod ve tasarım çıktıları şu 3 temel kritere uymak ZORUNDADIR:
- **Duyusal Güvenlik:** UI bileşenlerinde kırmızı çarpı (`X`), yüksek kontrastlı rahatsız edici renkler (saf kırmızı #FF0000), hızlı yanıp sönen veya ani gürültü çıkaran elementler KULLANILAMAZ. Pastel tonlar (Tailwind: `blue-500`, `green-400`, `purple-500`) tercih edilir.
- **Pozitif Hata Yönetimi:** Yanlış cevaplarda çocuğu durduran veya sert bildirim veren modal/alert yapılamaz. Yerine "Bir daha deneyelim" veya "Sıradakine geçelim" şeklinde sessiz veya nazik ilerleme stratejisi (Fail-Forward) kodlanır.
- **Sade Arayüz (UX):** Ekranda aynı anda en fazla 3-4 etkileşimli element bulunabilir. Dikkat dağıtıcı gereksiz animasyonlardan kaçınılır.

## 2. Teknik ve Kodlama Standartları
- **Framework:** Next.js (App Router), React, TypeScript.
- **Styling:** Sadece Tailwind CSS utility sınıfları. (Harici `.css` dosyalarına ad-hoc sınıflar yazılamaz).
- **TypeScript:** `any` kullanımı yasaktır. Her component Props'u interface/type ile tanımlanmalıdır.
- **Client vs Server Components:** Bileşenler varsayılan olarak `Server Component`'tir. Hook (useState vb.) veya event listener (onClick) içerenler en üste `'use client'` almalıdır.

## 3. Proje Yönetimi
- **Todo Güncellemeleri:** Eğer ajan `docs/todo.md` listesinde bir görev tamamlarsa, durumu `[ ]`'den `[x]`'e ve ⏳ / 🔄 ikonlarından ✅ (Tamamlandı) şekline taşımakla yükümlüdür.
- **Erişilebilirlik (A11y):** Tıklanabilir her element (`<button>`, `<a>`) ZORUNLU olarak açıklayıcı bir `aria-label` barındırmalıdır. Ekran okuyucu testlerine uygun olmalıdır.

> **Uyarı:** Bu kurallara uymayan hiçbir kod parçası PR/commit aşamasına getirilmemeli ve `implementation_plan` üzerinden geri çevrilmelidir.

## 4. Premium ve Modern Tasarım (Aesthetics)
- **Glassmorphism ve Gölgeler:** UI elementleri modern ve premium hissettirmelidir. Bunun için `glass-panel` ve `premium-shadow` class'larını veya yumuşak gölgeleri (`shadow-lg`, `shadow-xl`) kullanın.
- **Yumuşak Geçişler ve Animasyonlar:** Dikkat dağıtmayacak düzeyde sakinleştirici mikro-animasyonlar (örn. `hover:scale-[1.02]`, `transition-all duration-500`) eklenmeli, arayüz akıcı hissettirmelidir.
- **Renk Uyumu:** Canlı ancak pastel (soft) renk paletleri ve `soft-gradient-bg` (örn. `from-blue-400/80 to-cyan-400/80`) tercih edilmelidir. Tasarım ASLA basit/MVP seviyesinde görünmemelidir, kullanıcıda ilk bakışta premium etkisi yaratacak bir zenginlik taşımalıdır, ancak otizm duyusal güvenlik kuralları ihlal edilmemelidir.
