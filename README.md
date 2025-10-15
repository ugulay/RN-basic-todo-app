
# BasicNotes - Açık Kaynak Kodlu Yapılacaklar Uygulaması

BasicNotes, günlük görevlerinizi kolayca yönetmenizi sağlayan modern ve açık kaynak kodlu bir yapılacaklar listesi uygulamasıdır. Google Play Store üzerinden indirilebilir ve tüm özellikleriyle ücretsiz olarak kullanılabilir.

[Google Play Store'dan İndir](https://play.google.com/store/apps/details?id=com.basicnotes)

## Özellikler

## Kullanılan Teknolojiler

Bu proje aşağıdaki temel teknolojiler ve kütüphaneler kullanılarak geliştirilmiştir:

-   **React Native:** Mobil uygulama geliştirmek için kullanılan açık kaynaklı bir çerçeve.
-   **TypeScript:** Geliştirme sürecini daha güvenli ve ölçeklenebilir hale getiren JavaScript'in tip güvenli bir üst kümesi.
-   **Node.js:** JavaScript çalışma zamanı ortamı.
-   **Yarn:** Hızlı, güvenli ve güvenilir bir paket yöneticisi.
-   **Android SDK:** Android platformu için uygulama geliştirme araçları.
-   **iOS SDK:** iOS platformu için uygulama geliştirme araçları.

## Kurulum ve Geliştirme

Bu projeyi yerel makinenizde kurmak ve geliştirmeye başlamak için aşağıdaki adımları izleyin:

### Önkoşullar

*   Node.js (LTS sürümü önerilir)
*   Yarn
*   React Native CLI (global olarak yüklü olması önerilir: `npm install -g react-native-cli`)
*   Android Studio ve Android SDK (Android geliştirme için)
*   Xcode ve CocoaPods (iOS geliştirme için)

### Adımlar

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/your-username/BasicNotesNew.git
    cd BasicNotesNew
    ```
    *(Not: `your-username` kısmını projenin gerçek GitHub kullanıcı adıyla değiştirmeniz gerekecek.)*

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    yarn install
    ```

3.  **iOS Podlarını Yükleyin (Sadece iOS için):**
    ```bash
    cd ios
    pod install
    cd ..
    ```

## Uygulamayı Çalıştırın:

    *   **Android için:**
        ```bash
        yarn android
        ```
        veya
        ```bash
        react-native run-android
        ```

    *   **iOS için:**
        ```bash
        yarn ios
        ```
        veya
        ```bash
        react-native run-ios
        ```

### Uygulama İmzalama ve Google Play'e Yükleme

Uygulamanızı Google Play Store'a yüklemek için bir yayın anahtarı ile imzalamanız ve bir Android App Bundle (AAB) oluşturmanız gerekmektedir.

#### 1. Keystore Oluşturma (Eğer Mevcut Değilse)

Eğer daha önce bir yayın anahtarı (keystore) oluşturmadıysanız veya mevcut anahtarınızı kaybettiyseniz, yeni bir tane oluşturmanız gerekmektedir.

```bash
keytool -genkeypair -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Bu komut, `my-upload-key.keystore` adında bir keystore dosyası oluşturacak ve `my-key-alias` adında bir anahtar içerecektir. Komutu çalıştırdığınızda sizden şifreler ve diğer bilgiler istenecektir. Bu bilgileri güvenli bir yerde saklayın.

#### 2. `secrets.properties` Dosyasını Yapılandırma

Oluşturduğunuz veya mevcut olan keystore bilgilerini Gradle'ın okuyabilmesi için `android/secrets.properties` dosyasını oluşturmanız veya güncellemeniz gerekmektedir. Bu dosya hassas bilgileri içerdiğinden `git`'e commit edilmemelidir. `.gitignore` dosyanızda `/android/secrets.properties` satırının bulunduğundan emin olun.

`android/secrets.properties` dosyası aşağıdaki gibi olmalıdır:

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

*   `MYAPP_UPLOAD_STORE_FILE`: Keystore dosyanızın adı (örneğin, `my-upload-key.keystore`). Bu dosya `android/` dizininde bulunmalıdır.
*   `MYAPP_UPLOAD_KEY_ALIAS`: Keystore içindeki anahtarınızın takma adı (örneğin, `my-key-alias`).
*   `MYAPP_UPLOAD_STORE_PASSWORD`: Keystore dosyanızın şifresi.
*   `MYAPP_UPLOAD_KEY_PASSWORD`: Keystore içindeki anahtarınızın şifresi.

#### 3. Android App Bundle (AAB) Oluşturma

Uygulamanızın yayın sürümünü oluşturmak için `android` dizinine gidin ve aşağıdaki komutu çalıştırın:

```bash
cd android
./gradlew bundleRelease
```

Bu komut, `android/app/build/outputs/bundle/release/app-release.aab` yolunda bir AAB dosyası oluşturacaktır.

#### 4. Google Play Console'a Yükleme

Oluşturulan `app-release.aab` dosyasını Google Play Console'a yükleyebilirsiniz. Eğer uygulamanız daha önce yayınlandıysa ve farklı bir anahtarla imzalandığı hatasını alırsanız, Google Play App Signing hizmetini kullanıyorsanız Google Play Destek ile iletişime geçerek anahtarınızı sıfırlamanız gerekebilir. Yeni bir uygulama yüklüyorsanız, bu adımı atlayabilirsiniz.

## Katkıda Bulunma

BasicNotes projesine katkıda bulunmaktan mutluluk duyarız! Her türlü katkı, projenin daha iyi hale gelmesine yardımcı olur.

### Nasıl Katkıda Bulunulur?

1.  **Depoyu Fork'layın:** Kendi GitHub hesabınıza projenin bir kopyasını (fork) oluşturun.
2.  **Dal Oluşturun:** Yeni özelliğiniz veya hata düzeltmeniz için ana daldan (genellikle `main` veya `master`) yeni bir dal oluşturun:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  **Değişikliklerinizi Yapın:** Kodunuzu yazın ve değişikliklerinizi test edin.
4.  **Değişikliklerinizi Commit'leyin:** Anlamlı commit mesajları kullanarak değişikliklerinizi kaydedin:
    ```bash
    git commit -m "feat: Yeni özellik eklendi"
    ```
    veya
    ```bash
    git commit -m "fix: Hata düzeltildi"
    ```
5.  **Değişikliklerinizi Push'layın:** Değişikliklerinizi kendi fork'unuza gönderin:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Pull Request (Çekme İsteği) Oluşturun:** Orijinal depoya bir Pull Request oluşturun. Lütfen Pull Request açıklamasında yaptığınız değişiklikleri ve nedenlerini detaylı bir şekilde belirtin.

### Hata Bildirme ve Öneri Sunma (Issues)

Eğer bir hata bulursanız veya yeni bir özellik önermek isterseniz, lütfen GitHub Issues sayfamızı kullanın.

*   **Hata Bildirirken:** Lütfen hatayı mümkün olduğunca detaylı bir şekilde açıklayın. Hatanın nasıl tekrar üretilebileceğini (adım adım), beklenen davranışı ve mevcut davranışı belirtin. Ekran görüntüleri veya video kayıtları da çok yardımcı olacaktır.
*   **Özellik Önerirken:** Önerdiğiniz özelliğin ne olduğunu, hangi sorunu çözdüğünü veya hangi iyileştirmeyi sağladığını açıklayın.

Lütfen Issue oluşturmadan önce mevcut Issue'ları kontrol ederek benzer bir konunun zaten açılıp açılmadığını kontrol edin.

- **Görev Yönetimi:** Görev ekleme, düzenleme, tamamlama ve silme.
- **Önceliklendirme:** Önemli görevleri işaretleme.
- **Çoklu Seçim Modu:** Birden fazla görevi aynı anda yönetme (silme, tamamlama).
- **Yerelleştirme:** Uygulama metinleri cihaz diline göre otomatik olarak değişir (Türkçe ve İngilizce desteği).
- **Modern Kullanıcı Arayüzü:** Yenilenmiş renk paleti ve geliştirilmiş aralıklarla şık tasarım.
- **Görev Paylaşımı:** Görev metinlerini diğer uygulamalarla kolayca paylaşma.
- **Kaydırma Hareketleri:** Görevleri tamamlamak veya silmek için sezgisel kaydırma hareketleri.

