# Ödeme Yönetim Sistemi

Bu proje, kullanıcıların ödeme yönetimi yapabileceği basit bir web uygulamasıdır. Kullanıcılar FIN kodu ve şifre ile giriş yaparak geçmiş ve bekleyen ödemelerini görüntüleyebilirler.

## Özellikler

- **Kullanıcı Kayıt ve Giriş İşlemleri:**
  - FIN kodu ve şifre ile kayıt olma ve giriş yapma.
  - FIN kodu validasyonu.
  
- **Ödeme Yönetimi:**
  - Geçmiş ödemeleri görüntüleme.
  - Bekleyen ödemeleri görüntüleme ve silme.
  - Otomatik ödeme ekleme.

- **UI Özellikleri:**
  - Minimalist ve mobil uyumlu tasarım.
  - Pashabank renk tonlarına uygun tasarım.
  - Modal pencereler ile kullanıcı dostu arayüz.

## Teknolojiler

- HTML, CSS, JavaScript
- LocalStorage ve SessionStorage
- Fetch API (bileşen yükleme için)

## Kurulum

1. **Proje Klasörünü İndirin:**
   - Projeyi [buradan](#) indirebilirsiniz.

2. **Visual Studio Code veya Herhangi Bir Kod Editörü ile Açın:**
   - VS Code önerilir.

3. **Gerekli Dosyaların Oluşturulduğundan Emin Olun:**
   - `index.html`, `login.html`, `register.html`, `dashboard.html`
   - `assets/` klasörü içinde `css/`, `js/`, `images/`
   - `components/` klasörü içinde `header.html`, `footer.html`, `modal.html`
   - `data/` klasörü (isteğe bağlı)

4. **Uygulamayı Çalıştırın:**
   - `index.html` dosyasını tarayıcınızda açarak uygulamayı kullanmaya başlayabilirsiniz.

## Kullanım

1. **Kayıt Ol:**
   - `register.html` sayfasına giderek FIN kodu ve şifre ile kayıt olun.

2. **Giriş Yap:**
   - `login.html` sayfasından FIN kodu ve şifrenizle giriş yapın.

3. **Dashboard:**
   - Giriş yaptıktan sonra ödemelerinizi yönetebileceğiniz dashboard sayfasına yönlendirileceksiniz.
   - Geçmiş ödemeleri görüntüleyebilir, bekleyen ödemeleri görüntüleyebilir ve yeni otomatik ödemeler ekleyebilirsiniz.

## Renk Tonları ve Tasarım

Pashabank'ın renk tonlarına benzer şekilde, mavi (#003366) ve beyaz renkleri ana renkler olarak kullanıldı. İsteğe bağlı olarak, CSS dosyasını düzenleyerek renkleri ve tasarımı daha da özelleştirebilirsiniz.

## Sonraki Adımlar

Projeyi daha işlevsel hale getirmek için aşağıdaki adımları takip edebilirsiniz:

1. **Ödeme Güncelleme:**
   - Bekleyen ödemelerin durumunu güncelleme (Tamamlandı olarak işaretleme).

2. **Daha Fazla Göster:**
   - "Daha Fazla Göster" butonlarına işlev ekleyerek daha fazla ödeme görüntüleme.

3. **Validasyonları Geliştirme:**
   - FIN kodu ve diğer form alanları için daha kapsamlı validasyonlar ekleme.

4. **Responsive Tasarım:**
   - Mobil uyumluluğu artırmak için CSS'i optimize etme.

5. **Bonus Özellikler:**
   - PDF/Excel çıktısı alma ve çoklu dil desteği ekleme.

## Destek

Herhangi bir sorunuz veya öneriniz olursa, lütfen [iletişim](mailto:email@example.com) sayfasından bana ulaşın.

---

**Not:** Bu proje, frontend üzerinde `localStorage` kullanılarak basit bir ödeme yönetim sistemi olarak tasarlanmıştır. Gerçek bir üretim ortamında, güvenlik ve veri yönetimi için backend ve veritabanı entegrasyonu gereklidir.

