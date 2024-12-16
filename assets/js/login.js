document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form Değerlerini Al
        const fin = document.getElementById('fin').value.trim();
        const password = document.getElementById('password').value.trim();

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

        if (isValid) {
            // Kullanıcı Verilerini LocalStorage'dan Al
            const users = JSON.parse(localStorage.getItem('users')) || [];

            const user = users.find(user => user.fin === fin && user.password === password);

            if (user) {
                // Oturum Açma Bilgilerini SessionStorage'a Kaydet
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('FIN kodu veya şifre yanlış.');
            }
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
