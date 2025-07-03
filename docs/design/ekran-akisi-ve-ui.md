# **Kıvılcım \- Ekran Tasarımı ve Kullanıcı Akışı**

**Doküman Amacı:** Bu kılavuz, "Kıvılcım" platformunun temel ekranlarının tasarımını, modüler yapısını ve kullanıcı etkileşim akışını, duyusal dostu tasarım ilkelerine uygun olarak detaylandırmaktadır.

### **Tasarım Felsefesi: Yapılandırılmış ve Öngörülebilir Bir Dünya**

Tasarımımız, TEACCH yaklaşımının "Yapılandırılmış Öğretim" felsefesini dijital ortama taşır. Amaç, çocuğun "Ne yapacağım?", "Ne kadar yapacağım?" ve "Sonra ne olacak?" sorularına her zaman görsel ve net cevaplar bularak kendini güvende hissettiği, öngörülebilir bir deneyim yaratmaktır.

* **"Tek Seferde Tek Görev":** Her ekranın tek bir amacı ve tek bir ana eylemi olacaktır.  
* **Görsel Netlik:** Arayüz, gereksiz tüm unsurlardan arındırılmış, sakin ve nettir.  
* **Tutarlılık:** Navigasyon elemanları ve temel işlevler her zaman aynı yerde ve aynı şekilde çalışır.  
* **"Kıvılcım" Her Zaman Yanında:** Sesli asistan ve sevimli "Kıvılcım" karakteri, her adımda çocuğa yoldaşlık eder.

### **Ekran 1: Karşılama Ekranı (Splash Screen)**

* **Amaç:** Uygulamayı sakin ve sıcak bir başlangıçla açmak, çocuğa tanıdık bir "merhaba" demek.  
* **Tasarım:**  
  * **Arka Plan:** Projenin ana renk paletinden yumuşak bir pastel renk (örn: sakin mavi).  
  * **Merkezde:** Gülen yüzüyle "Kıvılcım" karakteri logosu.  
  * **Animasyon:** Logo, ekranın ortasına çok yavaş bir şekilde süzülerek gelir ve hafifçe nefes alıp verir gibi bir animasyon yapar.  
  * **Metin:** Logonun altında, yuvarlak hatlı Nunito fontu ile "**Kıvılcım**" yazar.  
* **Akış:** Bu ekran 3-4 saniye kalır ve otomatik olarak Ana Menü'ye geçer. Ani geçişler olmaz.

### **Ekran 2: Ana Menü (Modüler Gelişim Platformu)**

* **Amaç:** Çocuğun, üzerinde çalışmak istediği gelişim alanını (modülü) kolayca seçmesini sağlamak ve gelecekteki öğrenme maceralarını göstermek.  
* **Tasarım:**  
  * **Başlık:** "Gelişim Modülleri"  
  * **Yerleşim:** Ekranda, her biri bir gelişim alanını temsil eden, dokunması kolay, büyük ve birbirinden ayrık "modül kartları" bulunur.  
  * **Aktif Modül (MVP için):**  
    * **Kart 1: Okuryazarlık Becerileri 📖**  
    * **Görünüm:** Canlı renklerde (örn: başarı yeşili), interaktif olduğu belirgin ve üzerinde "BAŞLA" etiketi bulunur.  
  * **Pasif Modüller (Gelecek Fazlar için):**  
    * **Kart 2: Anlam ve Kelime Dağarcığı 🎨**  
    * **Kart 3: Sosyal İletişim 💬**  
    * **Kart 4: Yazma ve İfade Etme ✍️**  
    * **Görünüm:** Bu kartlar daha soluk renklerdedir, üzerlerinde bir "kilit" ikonu veya "YAKINDA" etiketi bulunur. Tıklanabilir değildirler. Bu, çocuğa gelecekte yeni maceraların onu beklediğini gösterir.  
  * **Ebeveyn Erişimi:** Sağ üst köşede, sadece ebeveynlerin fark edeceği küçük bir "dişli" ikonu ile Ebeveyn Paneli'ne erişim sağlanır.  
* **Sesli Asistan:**  
  * *"Tekrar hoş geldin\! Hadi, okuma maceramıza başlayalım. Okuryazarlık Becerileri modülüne dokun."*  
* **Akış:** Çocuk, aktif olan "Okuryazarlık Becerileri" kartına dokunarak egzersiz ekranına geçer.

### **Ekran 3: Egzersiz Ekranı ("Okuryazarlık" Modülü)**

Bu, öğrenmenin gerçekleştiği en temel etkileşim ekranıdır. TEACCH ve ABA ilkeleri burada birleşir.

* **Adım 3a: Görev Tanımı (Ne yapacağım?)**  
  * **Görsel:** Ekranın üst kısmında, o anki görevi basitçe gösteren bir ilerleme çubuğu bulunur (örn: 5 heceden 1.'si).  
  * **Sesli Asistan:** *"Harika\! Şimdi seninle hece yapacağız. Hazır mısın?"*  
* **Adım 3b: Etkileşim**  
  * **Görsel:** Ekranda iki harf ("e" ve "l") belirir. Çocuk, harfleri sürükleyerek birleştirir ve "el" hecesini oluşturur.  
  * **Dokunsal Geri Bildirim:** Çocuk harfin üzerinden parmağıyla geçerken, cihaz hafifçe titrer (haptic feedback).  
* **Adım 3c: Anında Pekiştirme (Sonuç)**  
  * **Görsel:** "el" hecesi doğru oluştuğunda, ekranın ortasında büyür. Ekranda sakin ve ödüllendirici bir animasyon (parlayan yıldızlar) belirir. İlerleme çubuğundaki ilk kutu dolar.  
  * **Sesli Asistan (Google TTS):** *"Harikasın\! Bu hece 'el'... el\!"*  
* **Adım 3d: Çocuğun Sırası (Telaffuz)**  
  * **Görsel:** Ekranın altında büyük bir mikrofon ikonu belirir.  
  * **Sesli Asistan:** *"Şimdi sıra sende. Benden sonra tekrar et: el"*  
  * **Akış:** Çocuk mikrofona konuşur. Azure servisi sesi analiz eder. Başarılıysa, yeni bir ödül animasyonu belirir. Başarısızsa, asistan sakince tekrar denemeyi teşvik eder.  
* **Adım 3e: Döngü ve Bitiş (Sonra ne olacak?)**  
  * **Akış:** 5 hece tamamlandığında, ilerleme çubuğu tamamen dolar.  
  * **Görsel:** Büyük bir "Tebrikler\!" ekranı ve "Kıvılcım" karakterinin sevinçli bir animasyonu belirir.  
  * **Sesli Asistan:** *"Tüm heceleri tamamladın\! Harika bir iş çıkardın. Ana menüye dönmek için butona dokun."*

### **Ekran 4: Ebeveyn Paneli**

* **Erişim:** Ana menüdeki "dişli" ikonuna, basit bir ebeveyn kilidi (örn: "İki parmağınla aynı anda bas") ile erişilir.  
* **İçerik:** Bu panel, daha önce detaylandırdığımız gibi, çocuğun gelişimini gösteren basit grafikler, "Odak Alanları" ve en önemlisi, uygulamanın deneyimini kişiselleştirmeyi sağlayan "Duyusal Kontrol Paneli"ni içerir.

Bu akış, çocuğa her adımda ne yapacağını net bir şekilde göstererek, başarılarını anında ödüllendirerek ve bir sonraki adımı öngörülebilir kılarak, öğrenme sürecini güvenli ve motive edici bir maceraya dönüştürür.