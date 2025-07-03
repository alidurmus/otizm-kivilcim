# **Kullanıcı Hikayeleri: Kıvılcım**

**Doküman Amacı:** Bu belge, "Kıvılcım" platformu için geliştirilecek özelliklerin, kullanıcıların bakış açısından anlatıldığı hikayelerden oluşur. Her hikaye, bir ihtiyacı, bu ihtiyacın nedenini ve geliştirme için kabul kriterlerini tanımlar.

### **Persona 1: Arda (Çocuk \- Birincil Kullanıcı)**

Arda'nın temel motivasyonu, öğrenme sürecini bir oyun gibi deneyimlemek, başardığını hissetmek ve kendini güvende hissettiği bir ortamda olmaktır.

#### **MVP (Okuryazarlık Modülü) için Kullanıcı Hikayeleri**

| Hikaye ID | Kullanıcı Hikayesi | Kabul Kriterleri |
| :---- | :---- | :---- |
| **ARDA-01** | **Bir çocuk olarak,** ana menüde farklı gelişim alanlarını (modülleri) gösteren büyük ve basit resimler görmek istiyorum, **böylece** kafam karışmadan istediğim etkinliği başlatabilirim. | \- Ana menüde her modül için (Okuryazarlık, Sosyal İletişim vb.) ayrı bir kart bulunur.\<br\>- Sadece aktif olan "Okuryazarlık" modülü tıklanabilir durumdadır.\<br\>- Diğer modüller "Yakında" etiketiyle pasif görünür. |
| **ARDA-02** | **Bir çocuk olarak,** heceleme etkinliğinde harfleri birleştirmem söylendiğinde, onları parmağımla sürükleyebilmek istiyorum, **böylece** heceyi kendi ellerimle oluşturduğumu hissedebilirim. | \- Ekranda iki ayrı harf belirir.\<br\>- Harflerden birini diğerinin yanına sürükleyebilirim.\<br\>- Harf doğru yere geldiğinde, birleşir ve tek bir hece olarak görünür. |
| **ARDA-03** | **Bir çocuk olarak,** bir heceyi veya kelimeyi doğru söylediğimde, anında güzel bir ses ve ekranda parlayan yıldızlar görmek istiyorum, **böylece** başardığımı anlar ve devam etmek için motive olurum. | \- Doğru telaffuzdan sonra 1 saniye içinde pozitif sesli geri bildirim ("Harikasın\!") duyulur.\<br\>- Ekranda 2-3 saniye süren, sakin bir ödül animasyonu belirir.\<br\>- Animasyon bittikten sonra otomatik olarak yeni bir egzersize geçilir. |
| **ARDA-04** | **Bir çocuk olarak,** yanlış bir şey söylediğimde ceza veya kötü bir ses duymak istemiyorum, **böylece** denemekten korkmam. | \- Yanlış telaffuz durumunda "X" işareti, kırmızı renk veya olumsuz bir ses kullanılmaz.\<br\>- Sesli asistan "Sorun değil, tekrar deneyelim" gibi sakin ve teşvik edici bir ifade kullanır. |
| **ARDA-05** | **Bir çocuk olarak,** ekrandaki harflerin üzerinden parmağımla geçtiğimde hafif bir titreşim hissetmek istiyorum, **böylece** harfleri sadece görmekle kalmayıp dokunarak da öğrenebilirim. | \- Destekleyen cihazlarda, parmak harf ile temas ettiğinde hafif bir dokunsal geri bildirim (haptic feedback) tetiklenir. |

#### **Gelecek Modüller için Kullanıcı Hikayeleri**

| Hikaye ID | Kullanıcı Hikayesi | İlgili Modül |
| :---- | :---- | :---- |
| **ARDA-06** | **Bir çocuk olarak,** ekrandaki "kedi" yazısını kedi resmiyle eşleştirmek istiyorum, **böylece** okuduğum kelimenin ne anlama geldiğini daha iyi anlayabilirim. | Anlam ve Kelime Dağarcığı |
| **ARDA-07** | **Bir çocuk olarak,** uygulamadaki Kıvılcım karakteri ile "Merhaba" veya "Nasılsın?" gibi basit konuşmalar yapmak istiyorum, **böylece** insanlarla nasıl konuşacağımı öğrenebilirim. | Sosyal İletişim |
| **ARDA-08** | **Bir çocuk olarak,** harfleri bir kutuya sürükleyerek kendi ismimi veya sevdiğim kelimeleri yazmak istiyorum, **böylece** yazmanın ne kadar eğlenceli olduğunu görebilirim. | Yazma ve İfade Etme |

### **Persona 2: Zeynep Hanım (Ebeveyn \- İkincil Kullanıcı)**

Zeynep Hanım'ın önceliği, çocuğunun güvenli ve onun ihtiyaçlarına özel bir ortamda, etkili bir şekilde öğrendiğinden emin olmak ve gelişimini kolayca takip edebilmektir.

| Hikaye ID | Kullanıcı Hikayesi | Kabul Kriterleri / İlgili Faz |
| :---- | :---- | :---- |
| **ZEYNEP-01** | **Bir ebeveyn olarak,** çocuğumun o gün ne kadar çalıştığını ve genel başarı oranını basit bir ekranda görmek istiyorum, **böylece** gelişimini karmaşık verilerle boğulmadan takip edebilirim. | MVP |
| **ZEYNEP-02** | **Bir ebeveyn olarak,** çocuğumun en çok hangi sesleri söylerken zorlandığını net bir şekilde görmek istiyorum, **böylece** hangi alanlarda desteğe ihtiyacı olduğunu bilir ve terapistiyle bu bilgiyi paylaşabilirim. | MVP |
| **ZEYNEP-03** | **Bir ebeveyn olarak,** çocuğumun duyusal profiline en uygun deneyimi sunmak için uygulamanın renk temasını, animasyon yoğunluğunu ve ses seviyelerini ayarlayabildiğim bir "Duyusal Kontrol Paneli" istiyorum, **böylece** öğrenme ortamını onun için en konforlu hale getirebilirim. | Gelecek Faz (Faz 2\) |
| **ZEYNEP-04** | **Bir ebeveyn olarak,** ebeveyn paneline sadece benim erişebileceğimden emin olmak istiyorum, **böylece** çocuğumun yanlışlıkla ayarları değiştirmesini engelleyebilirim. | MVP |

### **Persona 3: Ahmet Bey (Özel Eğitim Uzmanı \- Üçüncül Kullanıcı)**

Ahmet Bey, uygulamayı seanslarında bir araç olarak kullanmak ve öğrencilerinin gelişimi hakkında veriye dayalı, profesyonel raporlar almak ister.

| Hikaye ID | Kullanıcı Hikayesi | İlgili Faz |
| :---- | :---- | :---- |
| **AHMET-01** | **Bir özel eğitim uzmanı olarak,** sınıfımdaki tüm öğrencilerin ilerlemesini tek bir panelden yönetmek ve karşılaştırmak istiyorum, **böylece** grup ve bireysel eğitim planlarımı daha verimli yapabilirim. | Gelecek Faz (B2B Paneli) |
| **AHMET-02** | **Bir özel eğitim uzmanı olarak,** her bir öğrencimin BEP'sinde (Bireyselleştirilmiş Eğitim Programı) yer alan okuma hedeflerini uygulamaya girmek ve ilerlemesini bu hedeflere göre takip etmek istiyorum, **böylece** yasal raporlama süreçlerimi kolaylaştırabilirim. | Gelecek Faz (B2B Paneli) |

