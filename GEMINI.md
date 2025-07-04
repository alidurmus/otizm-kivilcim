# **Kıvılcım \- Gemini AI Kullanım Kılavuzu ve Kuralları (Next.js)**

**Doküman Amacı:** Bu kılavuz, "Kıvılcım" platformunun Next.js ile geliştirilmesi sürecinde Google Gemini yapay zeka modelini kullanırken uyulması gereken ilkeleri, standartları ve en iyi pratikleri tanımlar. Amaç, Gemini'yi projenin kalitesini, verimliliğini ve yaratıcılığını artıran bir yardımcı araç olarak kullanırken, projenin temel pedagojik ve duyusal dostu felsefesinden ödün vermemektir.

### **1\\. Genel İlkeler ve Felsefe**

* **Gemini Bir Yardımcı Pilottur:** Gemini, fikir üretme, kodlama, metin yazma ve problem çözme süreçlerinde güçlü bir yardımcıdır ancak nihai karar verici değildir. Üretilen her çıktı, insan aklı ve uzmanlığı süzgecinden geçmelidir.  
* **Proje Değerlerine Tam Uyum:** Gemini'den talep edilen ve alınan her türlü içerik (kod, metin, fikir), "Kıvılcım" projesinin üç temel direğine uymak zorundadır:  
  1\\. **Pedagojik Olarak Sağlam:** İçerik, kanıta dayalı eğitim metotlarına uygun olmalıdır.  
  2\\. **Duyusal Olarak Güvenli:** İçerik, görsel ve işitsel olarak sakin, net ve öngörülebilir olmalıdır.  
  3\\. **Pozitif ve Teşvik Edici:** İçerik, çocuğu motive etmeli ve özgüvenini desteklemelidir.  
* **İnsan Denetimi Zorunludur:** Hiçbir yapay zeka çıktısı, ilgili uzman (geliştirici, tasarımcı, eğitimci) tarafından gözden geçirilip onaylanmadan doğrudan projeye dahil edilemez.

#### **1.1. Oturum Başlangıcı Kuralları**
*   **Konteksti Yükle:** Her oturumun başında, `docs` dizinindeki tüm `.md` dosyalarını oku. Bu, projenin güncel durumu, kararları ve hedefleri hakkında tam bağlam sahibi olmanı sağlar ve daha isabetli cevaplar vermene yardımcı olur.


### **2\\. Etkili Komut (Prompt) Yazma Kuralları**

Gemini'den en doğru ve kullanışlı sonuçları almak için komutlarımızı (prompt) belirli bir standartta yazmalıyız.

* **Rol ve Persona Tanımla:** Komuta başlarken Gemini'ye bir rol atayın.  
  * *Örnek:* \`"Sen, otizmli çocukların eğitimi konusunda uzman bir pedagogsun."\* veya *"Sen, Next.js, React ve TypeScript konusunda uzman bir web geliştiricisisin."*  
* **Bağlam Sağla:** Projenin amacını ve hedef kitlesini net bir şekilde belirtin.  
  * *Örnek:* *"Otizmli çocuklara yönelik, duyusal olarak hassas bir eğitim platformu olan 'Kıvılcım' için içerik üretiyorum. Platform Next.js ile geliştiriliyor."*  
* **Net ve Spesifik Ol:** Ne istediğinizi açık ve madde madde belirtin.  
* **Format Belirt:** Çıktının hangi formatta olması gerektiğini söyleyin (örn: JSON, Markdown, TSX kodu, liste).  
* **Kısıtlamaları ve Kuralları Ekle:** İstemediğiniz şeyleri veya uyması gereken kuralları (kivilcim\_nextjs\_rules dokümanına atıfta bulunarak) komuta dahil edin.  
  * *Örnek:* *"Tüm bileşenler Server Component olmalı, sadece interaktivite için 'use client' kullan. Stil için sadece Tailwind CSS utility sınıflarını kullan."*

### **3\\. İçerik Üretim Kuralları (Kullanım Alanına Göre)**

#### **3\\.1\\. Metinsel ve Görsel İçerik Üretimi**

* (Değişiklik yok, önceki sürümle aynı kurallar geçerlidir: Dil basit, ton pozitif, görseller sade ve 2D olmalıdır.)

#### **3\\.2\\. Kod Üretimi (Next.js / React / TypeScript)**

* **Standartlar:** Üretilen kodun, kivilcim\_nextjs\_rules dokümanında belirtilen tüm standartlara uyması istenmelidir.  
* **Bileşen Yapısı:** Kod, küçük, tekrar kullanılabilir ve tek bir sorumluluğu olan (SRP) fonksiyonel React bileşenleri halinde üretilmelidir.  
* **Server vs. Client Components:** Gemini'ye, bileşenleri varsayılan olarak **Server Component** olarak oluşturması, sadece hook (useState, useEffect vb.) veya olay dinleyici (onClick vb.) gerektiğinde "use client" direktifini eklemesi gerektiği belirtilmelidir.  
* **TypeScript:** Tüm kodlar strict modda, güçlü tiplerle yazılmalıdır. Bileşen props'ları için her zaman interface veya type tanımlanmalıdır. any tipi kullanılmamalıdır.  
* **Stil (Tailwind CSS):** Üretilen JSX, harici CSS dosyaları yerine doğrudan **Tailwind CSS utility sınıflarını** kullanmalıdır.  
* **Durum Yönetimi (State Management):** Basit durumlar için useState, karmaşık durumlar için useReducer istenmelidir. Global durum için **Zustand**'a uygun store ve hook yapısı talep edilebilir.  
* **Onay:** Üretilen tüm kodlar, bir **geliştirici tarafından** gözden geçirilmeli, refaktör edilmeli ve projenin standartlarına tam uyumlu hale getirilmelidir. Ayrıca, ilgili testleri yazılmadan projeye dahil edilemez.

### **4\\. Pratik Kullanım Senaryoları (Next.js için Güncellendi)**

* **Fikir Geliştirme:**  
  * *"Otizmli bir çocuğun kelime dağarcığını geliştirmek için 5 farklı oyun mekaniği fikri öner. Her fikrin pedagojik faydasını açıkla."*  
* **İçerik Oluşturma:**  
  * *"Parkta sırasını beklemesi gereken bir çocuk hakkında, 4 adımdan oluşan basit bir sosyal öykü yaz. Her adım için basit bir görsel fikri de belirt."*  
* **Kodlama Yardımı (Next.js):**  
  * *"Next.js App Router kullanarak, 'Kıvılcım' tasarım sistemine (Tailwind CSS) uygun, içinde bir SVG ikonu ve metin olan, interaktif bir 'Modül Kartı' bileşeni oluştur. Bu bir Client Component olmalı ('use client'). Tıklandığında onSelect adında bir prop fonksiyonunu çağırmalıdır. Tüm proplar için TypeScript interface'i oluştur."*  
* **Test Yazma (Jest & RTL):**  
  * *"Aşağıdaki React bileşeni için Jest ve React Testing Library kullanarak bir test dosyası yaz. Test, bileşenin doğru metinle render edildiğini ve butona tıklandığında onClick fonksiyonunun çağrıldığını doğrulamalıdır."*  
* **Dokümantasyon (TSDoc):**  
  * *"Bu React bileşeninin props'larını ve amacını açıklayan TSDoc formatında bir dokümantasyon oluştur."*

### **5. Docs Klasöründeki Markdown Dosyaları**
*   C:\cursor\otizm-kivilcim\docs\todo.md
*   C:\cursor\otizm-kivilcim\docs\Anlam ve Kelime Dağarcığı modül.md
*   C:\cursor\otizm-kivilcim\docs\next.js ile olacak ona göre güncelle.md
*   C:\cursor\otizm-kivilcim\docs\prd-coding-standards.md
*   C:\cursor\otizm-kivilcim\docs\elevenlabs-setup.md
*   C:\cursor\otizm-kivilcim\docs\pages.md
*   C:\cursor\otizm-kivilcim\docs\veritabani.md
*   C:\cursor\otizm-kivilcim\docs\naming-conventions.md
*   C:\cursor\otizm-kivilcim\docs\prd.md
*   C:\cursor\otizm-kivilcim\docs\reference\referanslar-ve-kaynaklar.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-extras\translate-your-site.md
*   C:\cursor\otizm-kivilcim\docs\README.md
*   C:\cursor\otizm-kivilcim\docs\src\pages\markdown-page.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-extras\manage-docs-versions.md
*   C:\cursor\otizm-kivilcim\docs\docs\intro.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-basics\deploy-your-site.md
*   C:\cursor\otizm-kivilcim\docs\blog\2021-08-26-welcome\index.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-basics\create-a-page.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-basics\create-a-document.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-basics\create-a-blog-post.md
*   C:\cursor\otizm-kivilcim\docs\docs\tutorial-basics\congratulations.md
*   C:\cursor\otizm-kivilcim\docs\blog\2019-05-29-long-blog-post.md
*   C:\cursor\otizm-kivilcim\docs\blog\2019-05-28-first-blog-post.md
*   C:\cursor\otizm-kivilcim\docs\design\tasarim-kilavuzu.md
*   C:\cursor\otizm-kivilcim\docs\design\ekran-akisi-ve-ui.md
*   C:\cursor\otizm-kivilcim\docs\prd\yol-haritasi.md
*   C:\cursor\otizm-kivilcim\docs\prd\gorev-listesi.md
*   C:\cursor\otizm-kivilcim\docs\prd\urun-gereksinimleri.md
*   C:\cursor\otizm-kivilcim\docs\design\logo-tasarim-promptu.md
*   C:\cursor\otizm-kivilcim\docs\prd\kullanici-hikayeleri.md
*   C:\cursor\otizm-kivilcim\docs\design\yapay-zeka-icerik-kurallari.md
*   C:\cursor\otizm-kivilcim\docs\design\marka-kimligi-ve-logo.md
