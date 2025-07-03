# **Ürün Gereksinimleri Dokümanı (PRD): Kıvılcım**

Doküman Sürümü: 3.0  
Tarih: 02.07.2025  
Yazar: \[Adınız/Kurumunuz\]

### **1\. Giriş ve Vizyon**

1.1. Problem:  
Otizm spektrum bozukluğu (OSB) olan çocuklar, dikkat, motivasyon, sosyal etkileşim ve duyusal işleme farklılıkları gibi nedenlerle gelişimsel süreçlerde benzersiz zorluklarla karşılaşmaktadır. Piyasada bulunan eğitim araçları genellikle tek bir beceri alanına odaklanmakta veya bu çocukların bireysel, duyusal ve pedagojik ihtiyaçlarını bütünsel olarak karşılamakta yetersiz kalmaktadır. Aileler ve eğitimciler, her çocuğun özgün potansiyelini ortaya çıkaracak, güvenli, kanıta dayalı ve kişiselleştirilebilir bir dijital platforma ihtiyaç duymaktadır.  
1.2. Çözüm: "Kıvılcım" Platformu  
"Kıvılcım", otizmli çocukların bilişsel, sosyal ve iletişimsel gelişimlerini bütünsel olarak desteklemek amacıyla tasarlanmış, yapay zeka destekli, modüler bir dijital gelişim platformudur. Sadece bir okuma uygulaması olmanın ötesinde, her çocuğun içindeki potansiyel "kıvılcımı" ateşlemeyi hedefler.  
1.3. Vizyon:  
Otizmli çocukların bireysel gelişim yolculuklarında onlara ve ailelerine eşlik eden, kanıta dayalı, kişiselleştirilebilir ve en etkili dijital yoldaş olmak.

### **2\. Pedagojik Çerçeve: Bütünsel Gelişim Modeli**

"Kıvılcım" platformunun metodolojisi, tek bir yaklaşıma bağlı kalmak yerine, uluslararası kabul görmüş, kanıta dayalı yöntemlerin dijital bir sentezini sunar:

* **MEB Müfredatı & Yerel Pratikler:** Platformun içeriği ("Ne" öğretilecek), Türkiye'deki eğitim standartları ve öğretmenlerin sahadaki uygulamalarıyla uyumludur.  
* **Uygulamalı Davranış Analizi (ABA):** Temel etkileşim mekaniklerini şekillendirir (Anında ve pozitif pekiştirme, ayrık denemelerle öğretim, yanlışsız öğretim).  
* **TEACCH:** Arayüz (UI) ve kullanıcı deneyimi (UX) tasarımına rehberlik eder (Yapılandırılmış ve öngörülebilir ortam, görsel iş sistemleri).  
* **DIR/Floortime:** Uyarlanabilir öğrenme algoritmasına ilham verir (Çocuğun liderliğini ve ilgisini takip etme, ilişki temelli etkileşim).  
* **Montessori:** Öğrenme deneyimini zenginleştirir (Çoklu duyusal öğrenme \- haptic feedback, somut dijital materyaller, "Dijital Hareketli Alfabe").

### **3\. Platformun Modüler Yapısı**

"Kıvılcım", zamanla genişleyecek modüler bir yapı üzerine kurulmuştur. Bu, geliştirme sürecini yönetilebilir kılarken, platformun çocuğun farklı gelişim ihtiyaçlarına cevap vermesini sağlar.

* **Modül 1: Okuryazarlık Becerileri (MVP Odaklı):** Ses, hece, kelime ve cümle okuma becerilerini öğretir.  
* **Modül 2: Anlam ve Kelime Dağarcığı (Gelecek Faz):** Kelime-resim eşleştirme, hafıza oyunları gibi etkinliklerle kelime dağarcığını geliştirir.  
* **Modül 3: Sosyal İletişim (Gelecek Faz):** Yapılandırılmış yapay zeka sohbetleri ve sosyal öykülerle iletişim becerilerini destekler.  
* **Modül 4: Yazma ve İfade (Gelecek Faz):** "Dijital Hareketli Alfabe" ve cümle kurma yapbozları ile yazma becerilerini geliştirir.  
* **Modül 5: Temel Kavramlar (Gelecek Faz):** Okumanın önkoşulu olan renk, şekil, sayı gibi temel kavramları öğretir.

### **4\. Temel Özellikler ve Gereksinimler**

**4.1. Uyarlanabilir Yapay Zeka Motoru:**

* Çocuğun performansına (doğruluk, hız) ve ilgisine (tercih ettiği oyun türleri) göre bir sonraki aktivitenin zorluğunu ve temasını dinamik olarak ayarlar.

**4.2. Duyusal Kontrol Paneli:**

* Platformun en yenilikçi özelliklerinden biridir. Ebeveynlerin/eğitimcilerin, çocuğun duyusal profiline göre arayüzü tamamen kişiselleştirmesine olanak tanır.  
* **Kontroller:** Görsel temalar (sakin, odak), ses seviyeleri (müzik, efekt, asistan), animasyon yoğunluğu, dokunsal geri bildirim (açık/kapalı), pekiştirme türü seçimi.

**4.3. Analitik Kontrol Paneli (Çift Katmanlı):**

* **B2C (Aile) Paneli:** Basit, görsel ve motive edici ilerleme göstergeleri (çalışma süresi, başarı oranı, "Yeni Maceralar" ve "Süper Güçler" kartları).  
* **B2B (Eğitimci) Paneli (Gelecek Faz):** Çoklu öğrenci yönetimi, detaylı performans analizi, BEP hedef takibi ve PDF raporlama özellikleri.

**4.4. Gelişmiş Oyunlaştırma ve Motivasyon:**

* ABA tabanlı anlık pekiştirme sistemi (görsel, işitsel, dokunsal ödüller).  
* "Kıvılcım" karakteri merkezli bir anlatı ve kişiselleştirilebilir avatar.  
* Görsel ilerleme takibi ve dijital rozet/başarı koleksiyonu.

### **5\. Teknik Strateji ve Altyapı**

* **Platform:** Flutter ile geliştirilmiş, tablet öncelikli mobil uygulama.  
* **Telaffuz Değerlendirme Motoru:**  
  * **MVP (Faz 1):** Hız ve doğrulama için **Azure AI Speech Pronunciation Assessment**.  
  * **Ölçeklenme (Faz 2/3):** Maliyet ve performans avantajı için, toplanan tescilli veri setiyle ince ayarlanmış **OpenAI Whisper** modeline geçiş.  
* **Veri Yönetimi:** Firebase (Authentication, Firestore) üzerinde, KVKK ile tam uyumlu, güvenli ve ölçeklenebilir veri mimarisi.

### **6\. Başarı Metrikleri (MVP için)**

* **Etkileşim:** Pilot gruptaki çocukların %70'inin uygulamayı haftada en az 3 kez, seans başına ortalama 10 dakika kullanması.  
* **Öğrenme:** Pilot gruptaki çocukların %60'ının, 1 aylık kullanım sonunda MVP içerik setindeki (ilk ses grubu) harf ve hecelerde %80 ve üzeri doğruluk oranına ulaşması.  
* **Kullanıcı Memnuniyeti:** Pilot gruptaki ebeveyn ve eğitimcilerden toplanan geri bildirimlerde, uygulamanın faydalı ve kullanımı kolay olarak değerlendirilmesi (NPS \> 40).