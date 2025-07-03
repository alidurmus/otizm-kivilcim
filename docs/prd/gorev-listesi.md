# **Kıvılcım \- Proje Görev Listesi (MVP Fazı)**

**Amaç:** Bu görev listesi, "Kıvılcım" platformunun **Faz 1: MVP (Minimum Uygulanabilir Ürün)** aşamasında tamamlanması gereken tüm teknik ve idari adımları içermektedir.

### **Aşama 1: Proje Kurulumu ve Altyapı (Sprint 1\)**

* \[ \] **Flutter Projesi Oluşturma:** Yeni bir Flutter projesi başlatmak ve temel klasör yapısını (lib/screens, lib/widgets, lib/services vb.) oluşturmak.  
* \[ \] **Firebase Projesi Oluşturma:** Google Firebase konsolunda yeni bir proje oluşturmak ve Flutter projesine entegre etmek (Core, Auth, Firestore).  
* \[ \] **API Servislerini Ayarlama:** Azure AI Speech servisi için API anahtarlarını almak ve .env dosyası aracılığıyla projeye güvenli bir şekilde eklemek.  
* \[ \] **Veritabanı Modeli Oluşturma:** Firestore'da users koleksiyonunu ve kivilcim\_veri\_mimarisi dokümanında tanımlanan temel yapıyı (profile, sensory\_settings, modules) oluşturmak.  
* \[ \] **Güvenlik Kurallarını Yazma:** Kullanıcıların sadece kendi verilerine erişebilmesini sağlayan temel Firestore güvenlik kurallarını deploy etmek.  
* \[ \] **Versiyon Kontrolü:** Projeyi bir Git deposuna (GitHub, GitLab vb.) yüklemek ve ana dalları (main, develop) oluşturmak.

### **Aşama 2: Çekirdek Kullanıcı Arayüzü (UI) Geliştirme (Sprint 2\)**

* \[ \] **Tasarım Sistemi Entegrasyonu:** kivilcim\_design\_guide dokümanındaki renk paletini, yazı tipi stillerini ve temel sabitleri lib/core/theme altında tanımlamak.  
* \[ \] **Karşılama Ekranı (Splash Screen):** "Kıvılcım" logosunun yer aldığı ve otomatik olarak ana menüye yönlendiren ekranı oluşturmak.  
* \[ \] **Ana Menü Ekranı:** kivilcim\_kullanici\_akisi dokümanında tanımlanan modüler yapıyı (aktif ve pasif kartlar) ve ebeveyn kilidi ikonunu içeren ekranı tasarlamak.  
* \[ \] **Egzersiz Ekranı İskeleti:** Geri butonu, başlık, ilerleme göstergesi ve mikrofon butonunu içeren temel egzersiz ekranını (scaffold) oluşturmak.  
* \[ \] **Ebeveyn Paneli İskeleti:** Ebeveyn kilidi arkasına gizlenmiş, temel bilgi kartlarını ve ayar butonlarını içerecek boş paneli oluşturmak.

### **Aşama 3: Yapay Zeka ve Öğrenme Mantığı (Sprint 3-4)**

* \[ \] **Sesli Asistan Servisi:** Google TTS veya benzeri bir servisle, metinleri seslendirecek merkezi bir AssistantService sınıfı yazmak.  
* \[ \] **Telaffuz Değerlendirme Servisi:** Mikrofonla alınan ses kaydını Azure'a gönderip fonem bazlı doğruluk sonucunu alacak PronunciationService sınıfını yazmak.  
* \[ \] **Okuryazarlık Modülü Mantığı:**  
  * \[ \] MVP için belirlenen ilk ses grubu içeriğini (assets/content/literacy\_mvp.json) oluşturmak.  
  * \[ \] Harf birleştirme ve kelime oluşturma etkileşimini yöneten LiteracyProvider veya Bloc sınıfını yazmak.  
  * \[ \] Dokunsal geri bildirim (haptic feedback) fonksiyonunu entegre etmek.  
* \[ \] **Pekiştirme Sistemi:** Her doğru etkileşim sonrası görsel (animasyon) ve işitsel (ses efekti) ödülleri tetikleyecek merkezi bir RewardService oluşturmak.

### **Aşama 4: Veri Yönetimi ve Ebeveyn Özellikleri (Sprint 5\)**

* \[ \] **Kullanıcı Yönetimi:** Firebase Authentication ile anonim kullanıcı oluşturma ve oturum yönetimi sistemini entegre etmek.  
* \[ \] **Veri Kaydetme:** Her egzersiz sonunda kullanıcının ilerlemesini (modules/okuryazarlik dokümanı) Firestore'a kaydetmek.  
* \[ \] **Veri Okuma ve Gösterme:** Ebeveyn panelinde, Firestore'dan okunan temel verileri (çalışma süresi, başarı oranı, zorlanılan sesler) ilgili kartlarda göstermek.  
* \[ \] **Geri Bildirim Formu:** Ebeveyn panelindeki geri bildirim formunu oluşturmak ve gönderilen metinleri analiz için Firestore'a kaydetmek.

### **Aşama 5: Test, Dağıtım ve Pilot Çalışma (Sprint 6\)**

* \[ \] **Birim ve Widget Testleri:** Servis sınıfları ve ana widget'lar için testler yazarak temel işlevselliği doğrulamak.  
* \[ \] **Hata Yönetimi ve Loglama:** Uygulama genelinde olası hataları yakalayan ve bir servise (örn: Sentry, Firebase Crashlytics) loglayan mekanizmayı kurmak.  
* \[ \] **Gizlilik Politikası:** KVKK uyumluluğu için basit bir gizlilik politikası metni hazırlamak ve uygulama içine bağlantısını eklemek.  
* \[ \] **Pilot Çalışma Hazırlığı:**  
  * \[ \] Test edilecek cihazlar için APK (Android) ve IPA (iOS) derlemelerini hazırlamak.  
  * \[ \] Pilot gruba (eğitimciler, aileler) dağıtımı yapmak.  
* \[ \] **Geri Bildirim Toplama ve Analiz:** Pilot çalışmadan gelen nitel ve nicel verileri sistematik olarak toplamak ve analiz etmek.  
* \[ \] **MVP Sonrası İyileştirmeler:** Toplanan geri bildirimlere göre kritik hataları düzeltmek ve bir sonraki faz için öncelikleri belirlemek.