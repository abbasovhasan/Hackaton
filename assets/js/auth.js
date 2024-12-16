// auth.js

// Kullanıcı kaydetme
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fin = document.getElementById('fin').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    
    // Validasyon kontrolleri
    if (!validateFIN(fin)) {
        alert('Geçersiz FIN Kodu. FIN Kodu 7 karakter olmalı ve sadece İngilizce harfler (İ ve O hariç) ile rakamlardan oluşmalıdır.');
        return;
    }
    
    if (!validatePassword(password)) {
        alert('Şifre en az 6 karakter uzunluğunda olmalıdır.');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // FIN kodunun benzersiz olup olmadığını kontrol et
    if (users.some(user => user.fin === fin)) {
        alert('Bu FIN Kodu zaten kayıtlı.');
        return;
    }
    
    users.push({ fin, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
    window.location.href = 'login.html';
});

// Kullanıcı giriş yapma
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fin = document.getElementById('fin').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(user => user.fin === fin && user.password === password);
    
    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('FIN Kodu veya Şifre yanlış.');
    }
});

// FIN kodu validasyonu
function validateFIN(fin) {
    const finRegex = /^[A-HJ-NP-Z0-9]{7}$/; // "İ" ve "O" hariç, 7 karakter
    return finRegex.test(fin);
}

// Şifre validasyonu
function validatePassword(password) {
    return password.length >= 6;
}
