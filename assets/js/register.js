document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form Değerlerini Al
        const fin = document.getElementById('fin').value.trim();
        const password = document.getElementById('password').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        // Hata Elemanlarını Temizle
        clearErrors();

        // Validasyon
        let isValid = true;

        // FIN Kodu Validasyonu
        const finRegex = /^[A-HJ-NP-Z0-9]{7}$/; // 'İ' ve 'O' hariç
        if (!finRegex.test(fin)) {
            isValid = false;
            showError('finError', 'Geçerli bir FIN kodu giriniz (7 karakter, İngilizce harf ve rakamlar, İ ve O hariç).');
        }

        // Şifre Validasyonu
        if (password.length < 6) {
            isValid = false;
            showError('passwordError', 'Şifre en az 6 karakter olmalıdır.');
        }

        // Kart Numarası Validasyonu
        const cardRegex = /^[0-9]{16}$/;
        if (!cardRegex.test(cardNumber)) {
            isValid = false;
            showError('cardNumberError', 'Kart numarası 16 haneli olmalıdır.');
        }

        // Son Kullanma Tarihi Validasyonu 
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

        if (!expiryRegex.test(expiryDate)) {
            isValid = false;
            showError('expiryDateError', 'Son kullanma tarihi MM/YY formatında olmalıdır.');
        } else {
            // Geçmiş tarih kontrolü
            const [inputMonth, inputYear] = expiryDate.split('/').map(num => parseInt(num, 10));
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Aylar 0-11 arası, bu yüzden 1 əlavə edirik
            const currentDay = currentDate.getDate(); // Cari gün
        
            // Şu anki yıl ve ayı kontrol et
            if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
                isValid = false;
                showError('expiryDateError', 'Son kullanma tarihi geçmiş olamaz.');
            } else if (inputYear === currentYear && inputMonth === currentMonth && inputDay < currentDay) {
                // Eğer aynı ay ve yıl ise, gün kontrolü
                isValid = false;
                showError('expiryDateError', 'Son kullanma tarihi geçmiş olamaz.');
            }
        }
        

        // CVV Kodu Validasyonu
        const cvvRegex = /^[0-9]{3}$/;
        if (!cvvRegex.test(cvv)) {
            isValid = false;
            showError('cvvError', 'CVV kodu 3 haneli olmalıdır.');
        }

        if (isValid) {
            // Kullanıcı Verilerini LocalStorage'a Kaydet
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // FIN kodunun benzersiz olması gerektiğini kontrol et
            const existingUser = users.find(user => user.fin === fin);
            if (existingUser) {
                alert('Bu FIN kodu ile kayıtlı bir kullanıcı zaten mevcut.');
                return;
            }

            const newUser = {
                fin,
                password,
                cardDetails: {
                    cardNumber,
                    expiryDate,
                    cvv
                },
                payments: {
                    completed: [],
                    pending: []
                }
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            window.location.href = 'login.html';
        }
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(elem => elem.textContent = '');
    }

    
});
