---
name: otizm-ui-check
description: UI bileşenlerinin (components) otizm dostu pedagojik kurallara ve erişilebilirliğe uyup uymadığını denetler.
---

# Otizm UI/UX Denetim Yeteneği (otizm-ui-check)

Bu yetenek tetiklendiğinde (örneğin kullanıcı bir ekranın otizm standartlarına uyup uymadığını sorduğunda), şu adımları izlemelisin:

1. **Renk Paleti Kontrolü:** İlgili kod (veya layout) dosyasını incele. Parlak ve rahatsız edici renkler (örneğin saf kırmızı, neon sarı) var mı kontrol et. Sadece pastel/yumuşak tonların kullanıldığına emin ol.
2. **Pedagojik Geribildirim:** `alert()`, `hata modal'ı` veya çocukta anksiyete yaratacak büyük hata sembolleri (`X`) var mı bak.
3. **Bilişsel Yük (Cognitive Load):** Ekranda aynı anda çok fazla seçenek/buton olup olmadığını denetle (genellikle 2-4 arası idealdir).
4. **Erişilebilirlik (A11y):** İnteraktif elemanların `aria-label`, büyük tıklama alanları (padding) ve okunaklı font (sans-serif, büyük punto) kullanıp kullanmadığını doğrula.
5. **Premium ve Modern Tasarım:** Sadelik, "basit/MVP" görünümü anlamına gelmemelidir. Bileşenlerin `glass-panel`, `premium-shadow`, yumuşak gradient (`soft-gradient-bg`) ve mikro-animasyonlar (`hover:scale-[1.02]`, `transition-all`) barındırıp barındırmadığını kontrol et.

Eğer yukarıdakilerden herhangi biri ihlal ediliyorsa (örn. tasarım çok yavan duruyorsa veya duyusal olarak zararlıysa), bunu düzeltecek bir kod güncellemesi (örneğin Tailwind sınıflarını veya yapıyı değiştirerek) öner veya doğrudan `replace_file_content` ile düzenle.
