# **Kıvılcım \- Kapsamlı Proje Görev Listesi (Next.js)**

**Amaç:** Bu görev listesi, "Kıvılcım" platformunun MVP fazından başlayarak, gelecekteki tüm modüllerin geliştirme süreçlerini içeren kapsamlı bir eylem planı sunar.

### **Faz 1: MVP \- Okuryazarlık Modülü (Sprint 1-6)**

Bu faz, uygulamanın temelini atmaya ve çekirdek işlevselliği kanıtlamaya odaklanır.

* **Aşama 1: Proje Kurulumu ve Altyapı**  
  * \[ \] **Next.js Projesi Oluşturma:** create-next-app ile TypeScript ve Tailwind CSS destekli yeni bir proje başlatmak.  
  * \[ \] **Firebase Entegrasyonu:** Firebase JS SDK'sını kullanarak projeye Firebase'i (Auth, Firestore) entegre etmek.  
  * \[ \] **API Servislerini Ayarlama:** Azure AI Speech API anahtarlarını .env.local dosyasına güvenli bir şekilde eklemek.  
  * \[ \] **Veritabanı Modeli Oluşturma:** Firestore'da users koleksiyonunu ve temel yapıyı oluşturmak.  
  * \[ \] **Güvenlik Kurallarını Yazma:** Kullanıcıların sadece kendi verilerine erişebilmesini sağlayan temel Firestore güvenlik kurallarını deploy etmek.  
* **Aşama 2: Çekirdek Kullanıcı Arayüzü (UI) Geliştirme**  
  * \[ \] **Tasarım Sistemi Entegrasyonu:** tailwind.config.js dosyasını proje renkleri ve fontları ile yapılandırmak.  
  * \[ \] **Layout ve Sayfa Yapısı:** Ana layout.tsx ve page.tsx dosyalarını oluşturmak.  
  * \[ \] **Bileşen Geliştirme:** Ana Menü, Modül Kartları ve Egzersiz Ekranı iskeletini React bileşenleri olarak oluşturmak.  
* **Aşama 3: Yapay Zeka ve Öğrenme Mantığı**  
  * \[ \] **Telaffuz Değerlendirme Servisi:** Mikrofonla alınan ses kaydını Azure'a gönderip fonem bazlı doğruluk sonucunu alacak PronunciationService sınıfını yazmak.  
  * \[ \] **Okuryazarlık Modülü Mantığı:** MVP için belirlenen ilk ses grubu içeriğini, harf birleştirme etkileşimini ve ilerleme takibini yöneten React hook'larını ve bileşenlerini yazmak.  
  * \[ \] **Pekiştirme Sistemi:** Her doğru etkileşim sonrası görsel ve işitsel ödülleri tetikleyecek merkezi bir RewardService oluşturmak.  
* **Aşama 4: Veri Yönetimi ve Ebeveyn Özellikleri**  
  * \[ \] **Kullanıcı Yönetimi:** Firebase Authentication ile anonim kullanıcı oluşturma ve oturum yönetimi sistemini entegre etmek.  
  * \[ \] **Veri Kaydetme ve Okuma:** Ebeveyn panelinde, Firestore'dan okunan temel verileri (çalışma süresi, başarı oranı vb.) ilgili kartlarda göstermek.  
  * \[ \] **Geri Bildirim Formu:** Ebeveyn panelindeki geri bildirim formunu oluşturmak ve gönderilen metinleri Firestore'a kaydetmek.  
* **Aşama 5: Test ve Dağıtım**  
  * \[ \] **Test Yazımı:** Jest ve React Testing Library ile temel bileşenler ve hook'lar için testler yazmak.  
  * \[ \] **Pilot Çalışma Hazırlığı:** Projeyi Vercel veya benzeri bir platforma deploy ederek pilot grup için hazır hale getirmek.  
  * \[ \] **Geri Bildirim Toplama:** Pilot gruptan gelen geri bildirimleri toplayarak analiz etmek ve sonraki faz için öncelikleri belirlemek.

### **Faz 2: Gelecek Fazlar \- Yeni Modüllerin Geliştirilmesi**

Bu faz, platformu yeni yeteneklerle zenginleştirmeye odaklanır. Her modül kendi içinde mini bir proje olarak ele alınabilir.

* **Anlam ve Kelime Dağarcığı Modülü Geliştirme**  
  * \[ \] **İçerik Planlama:** Resim-Kelime eşleştirme ve Hafıza Oyunu için kelime/görsel listelerini ve zorluk seviyelerini oluşturmak.  
  * \[ \] **Bileşen Geliştirme (KelimeEsleştirmeOyunu.tsx):** Kelimeyi ve çoktan seçmeli resimleri gösteren interaktif bileşeni oluşturmak.  
  * \[ \] **Bileşen Geliştirme (HafizaKarti.tsx):** Hafıza oyunu için açılıp kapanabilen, animasyonlu kart bileşenini oluşturmak.  
  * \[ \] **Oyun Mantığı:** Eşleştirme ve hafıza oyunlarının kurallarını, puanlamasını ve durum yönetimini (seçilen kartlar, eşleşmeler) implemente etmek.  
  * \[ \] **Firestore Entegrasyonu:** Bu modüldeki başarıları ve tamamlanan kelimeleri kullanıcının modules/anlam\_ve\_kelime dokümanına kaydetmek.  
* **Sosyal İletişim Modülü Geliştirme**  
  * \[ \] **Senaryo Geliştirme:** "Güvenli Sohbet" asistanı için temel diyalog akışlarını (selamlaşma, soru-cevap) ve sosyal öyküleri bir pedagog ile birlikte yazmak.  
  * \[ \] **Bileşen Geliştirme (SohbetArayuzu.tsx):** Konuşma balonlarını, kullanıcı girdi alanını ve karakter animasyonlarını içeren sohbet arayüzünü oluşturmak.  
  * \[ \] **Yapay Zeka Servisi (Chat):** Basit, kural tabanlı bir yanıt sistemi veya Gemini API ile etkileşim kuracak bir backend servisi (Next.js API Route) oluşturmak.  
  * \[ \] **Bileşen Geliştirme (SosyalOykuOkuyucu.tsx):** Sayfa sayfa ilerleyen, resimli ve interaktif sorular içeren sosyal öykü okuyucusunu geliştirmek.  
  * \[ \] **Firestore Entegrasyonu:** Tamamlanan sohbet senaryolarını ve sosyal öyküleri kullanıcının modules/sosyal\_iletisim dokümanına kaydetmek.  
* **Yazma ve İfade Etme Modülü Geliştirme**  
  * \[ \] **Bileşen Geliştirme (DijitalAlfabeKutusu.tsx):** dnd-kit gibi bir kütüphane kullanarak sürüklenebilir harfleri ve harflerin bırakılacağı alanı içeren "kum havuzu" bileşenini oluşturmak.  
  * \[ \] **Bileşen Geliştirme (CumleYapbozu.tsx):** Karışık kelime kartlarını ve sıralanacakları alanı içeren yapboz bileşenini oluşturmak.  
  * \[ \] **Etkileşim Mantığı:** Sürükle-bırak işlevselliğini ve doğru sıralama kontrolünü implemente etmek.  
  * \[ \] **TTS Entegrasyonu:** Oluşturulan kelimenin veya cümlenin sesli okunması için TTS servisini bağlamak.  
  * \[ \] **Firestore Entegrasyonu:** Oluşturulan kelime/cümle sayısını ve başarıları modules/yazma\_ve\_ifade dokümanına kaydetmek.  
* **Temel Kavramlar Modülü Geliştirme**  
  * \[ \] **İçerik Geliştirme:** Renkler, şekiller, sayılar ve zıt kavramlar için görsel ve metinsel içerikleri hazırlamak.  
  * \[ \] **Bileşen Geliştirme (KavramKarti.tsx):** Kavramları (örn: kırmızı renk, kare şekli) öğreten interaktif kart bileşenini oluşturmak.  
  * \[ \] **Oyun Mantığı (AyniFarkliOyunu.tsx):** "Aynı olanı bul" veya "Farklı olanı göster" oyunlarının mantığını ve arayüzünü geliştirmek.  
  * \[ \] **Firestore Entegrasyonu:** Öğrenilen kavramları ve oyunlardaki başarıyı modules/temel\_kavramlar dokümanına kaydetmek.