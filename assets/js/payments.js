// payments.js

document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcının giriş yapıp yapmadığını kontrol et
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Başlangıçta Ödemelerim sekmesini göster
    showPayments();
    
    // Sekme butonları
    document.getElementById('paymentsTab')?.addEventListener('click', showPayments);
    document.getElementById('pendingPaymentsTab')?.addEventListener('click', showPendingPayments);
    
    // Otomatik Ödeme Ekle butonu ve modal
    const modal = document.getElementById('paymentModal');
    const btn = document.getElementById('addPaymentBtn');
    const span = modal?.querySelector('.close');
    
    if (btn && span) {
        btn.onclick = function() {
            modal.style.display = 'block';
        }
        
        span.onclick = function() {
            modal.style.display = 'none';
        }
        
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
    
    // Ödeme ekleme formu
    document.getElementById('addPaymentForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const paymentDate = document.getElementById('paymentDate').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const recipient = document.getElementById('recipient').value.trim();
        const note = document.getElementById('note').value.trim();
        
        // Validasyon kontrolleri
        if (!validatePaymentDate(paymentDate)) {
            alert('Geçersiz tarih seçimi. Lütfen geleceğe dönük bir tarih seçin.');
            return;
        }
        
        if (!validateAmount(amount)) {
            alert('Tutar pozitif bir sayı olmalıdır.');
            return;
        }
        
        if (!validateRecipient(recipient)) {
            alert('Alıcı adı boş olamaz ve en az 2 karakter uzunluğunda olmalıdır.');
            return;
        }
        
        let payments = JSON.parse(localStorage.getItem('payments')) || [];
        
        const newPayment = {
            id: Date.now(),
            date: paymentDate,
            recipient,
            amount,
            status: 'Bekliyor',
            note
        };
        
        payments.push(newPayment);
        localStorage.setItem('payments', JSON.stringify(payments));
        
        alert('Ödeme eklendi.');
        modal.style.display = 'none';
        showPendingPayments();
    });
    
    // "Daha Fazla Göster" butonları
    document.getElementById('showMorePayments')?.addEventListener('click', function() {
        // Daha fazla ödeme gösterme mantığı
        alert('Daha fazla ödeme gösterme özelliği henüz eklenmedi.');
    });
    
    document.getElementById('showMorePendingPayments')?.addEventListener('click', function() {
        // Daha fazla bekleyen ödeme gösterme mantığı
        alert('Daha fazla bekleyen ödeme gösterme özelliği henüz eklenmedi.');
    });
    
    // İlk yüklemede ödemeleri göster
    showPayments();
});

// Ödemelerim sekmesini göster
function showPayments() {
    document.getElementById('paymentsSection').classList.add('active');
    document.getElementById('pendingPaymentsSection').classList.remove('active');
    
    let payments = JSON.parse(localStorage.getItem('payments')) || [];
    let paymentsList = payments.filter(p => p.status === 'Tamamlandı');
    
    const paymentsContainer = document.getElementById('paymentsList');
    paymentsContainer.innerHTML = '';
    
    if (paymentsList.length === 0) {
        paymentsContainer.innerHTML = '<p>Geçmiş ödeme bulunmamaktadır.</p>';
        return;
    }
    
    paymentsList.slice(0, 5).forEach(payment => {
        const paymentDiv = document.createElement('div');
        paymentDiv.classList.add('payment-item');
        paymentDiv.innerHTML = `
            <p><strong>Tarih:</strong> ${formatDate(payment.date)}</p>
            <p><strong>Alıcı:</strong> ${payment.recipient}</p>
            <p><strong>Tutar:</strong> ₼${payment.amount.toFixed(2)}</p>
            ${payment.note ? `<p><strong>Not:</strong> ${payment.note}</p>` : ''}
        `;
        paymentsContainer.appendChild(paymentDiv);
    });
}

// Bekleyen ödemeler sekmesini göster
function showPendingPayments() {
    document.getElementById('paymentsSection').classList.remove('active');
    document.getElementById('pendingPaymentsSection').classList.add('active');
    
    let payments = JSON.parse(localStorage.getItem('payments')) || [];
    let pendingPayments = payments.filter(p => p.status === 'Bekliyor');
    
    const pendingPaymentsContainer = document.getElementById('pendingPaymentsList');
    pendingPaymentsContainer.innerHTML = '';
    
    if (pendingPayments.length === 0) {
        pendingPaymentsContainer.innerHTML = '<p>Bekleyen ödeme bulunmamaktadır.</p>';
        return;
    }
    
    pendingPayments.slice(0, 5).forEach(payment => {
        const paymentDiv = document.createElement('div');
        paymentDiv.classList.add('payment-item');
        paymentDiv.innerHTML = `
            <p><strong>Planlanan Tarih:</strong> ${formatDate(payment.date)}</p>
            <p><strong>Alıcı:</strong> ${payment.recipient}</p>
            <p><strong>Tutar:</strong> ₼${payment.amount.toFixed(2)}</p>
            <p><strong>Durum:</strong> ${payment.status}</p>
            <button onclick="deletePayment(${payment.id})">Sil</button>
            ${payment.note ? `<p><strong>Not:</strong> ${payment.note}</p>` : ''}
        `;
        pendingPaymentsContainer.appendChild(paymentDiv);
    });
}

// Ödeme silme fonksiyonu
function deletePayment(id) {
    if (!confirm('Ödemeyi silmek istediğinizden emin misiniz?')) return;

    let payments = JSON.parse(localStorage.getItem('payments')) || [];
    payments = payments.filter(payment => payment.id !== id);
    localStorage.setItem('payments', JSON.stringify(payments));
    alert('Ödeme silindi.');
    showPendingPayments();
}

// Ödeme tarihi validasyonu
function validatePaymentDate(date) {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    // Tarih geçmiş olamaz
    return selectedDate >= today;
}

// Tutar validasyonu
function validateAmount(amount) {
    return !isNaN(amount) && amount > 0;
}

// Alıcı adı validasyonu
function validateRecipient(recipient) {
    return recipient.length >= 2;
}

// Tarihi okunabilir formata çevirme
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', options);
}
