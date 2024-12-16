document.addEventListener("DOMContentLoaded", () => {
    // Oturum Açmış Kullanıcıyı Al
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('Lütfen giriş yapınız.');
        window.location.href = 'login.html';
        return;
    }

    // Kullanıcı FIN Kodunu Göster
    document.getElementById('userFin').textContent = loggedInUser.fin;

    // Kart Detaylarını Göster
    displayCardDetails(loggedInUser.cardDetails);

    // Ödemeleri Yükle
    loadPayments(loggedInUser);

    // Tab İşlevselliği
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif Olanı Kaldır
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Tıklananı Aktif Yap
            button.classList.add('active');
            document.getElementById(button.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Modal İşlevselliği
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closeButton = document.querySelector('.close-button');

    addPaymentBtn.addEventListener('click', () => {
        paymentModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        paymentModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.classList.add('hidden');
        }
    });

    // Ödeme Formunu İşleme
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const paymentDate = document.getElementById('paymentDate').value;
        const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
        const paymentRecipient = document.getElementById('paymentRecipient').value.trim();
        const paymentNote = document.getElementById('paymentNote').value.trim();

        if (!paymentDate || !paymentAmount || !paymentRecipient) {
            alert('Lütfen tüm gerekli alanları doldurunuz.');
            return;
        }

        const newPayment = {
            id: Date.now(),
            date: paymentDate,
            recipient: paymentRecipient,
            amount: paymentAmount.toFixed(2),
            status: 'Bekliyor',
            note: paymentNote
        };

        // Pending Ödemelere Ekle
        loggedInUser.payments.pending.push(newPayment);
        updateUser(loggedInUser);

        // Tabloyu Güncelle
        addPendingPaymentToTable(newPayment);

        // Formu Sıfırla ve Modalı Kapat
        paymentForm.reset();
        paymentModal.classList.add('hidden');
    });

    function displayCardDetails(cardDetails) {
        const maskedCardNumber = maskCardNumber(cardDetails.cardNumber);
        document.getElementById('cardNumberDisplay').textContent = maskedCardNumber;
        document.getElementById('expiryDateDisplay').textContent = cardDetails.expiryDate;
        document.getElementById('cvvDisplay').textContent = '***'; // Güvenlik için gizli tutuyoruz
        document.getElementById('cardValidityDisplay').textContent = getCardValidity(cardDetails.expiryDate);
    }

    function maskCardNumber(cardNumber) {
        return '**** **** **** ' + cardNumber.slice(-4);
    }

    function getCardValidity(expiryDate) {
        const [month, year] = expiryDate.split('/').map(num => parseInt(num, 10));
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Son iki hane
        const currentMonth = currentDate.getMonth() + 1; // Aylar 0-11 arası

        if (year > currentYear || (year === currentYear && month >= currentMonth)) {
            return `Kartınız ${month.toString().padStart(2, '0')}/${year} ayının son gününe kadar aktif.`;
        } else {
            return `Kartınız ${month.toString().padStart(2, '0')}/${year} tarihinde sona erdi.`;
        }
    }

    function loadPayments(user) {
        // Geçmiş Ödemeler
        const completedBody = document.getElementById('completedPaymentsBody');
        completedBody.innerHTML = '';

        user.payments.completed.slice(-5).reverse().forEach(payment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(payment.date)}</td>
                <td>${payment.recipient}</td>
                <td>${payment.amount} AZN</td>
            `;
            completedBody.appendChild(tr);
        });

        // Bekleyen Ödemeler
        const pendingBody = document.getElementById('pendingPaymentsBody');
        pendingBody.innerHTML = '';

        user.payments.pending.slice(-5).reverse().forEach(payment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(payment.date)}</td>
                <td>${payment.recipient}</td>
                <td>${payment.amount} AZN</td>
                <td>${payment.status}</td>
                <td>
                    <button class="complete-btn" data-id="${payment.id}">Tamamla</button>
                    <button class="delete-btn" data-id="${payment.id}">Sil</button>
                </td>
            `;
            pendingBody.appendChild(tr);
        });

        // Silme Butonlarına Olay Ekle
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const paymentId = parseInt(btn.getAttribute('data-id'));
                deletePayment(paymentId, user);
            });
        });

        // Tamamla Butonlarına Olay Ekle
        const completeButtons = document.querySelectorAll('.complete-btn');
        completeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const paymentId = parseInt(btn.getAttribute('data-id'));
                completePayment(paymentId, user);
            });
        });
    }

    function addPendingPaymentToTable(payment) {
        const pendingBody = document.getElementById('pendingPaymentsBody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(payment.date)}</td>
            <td>${payment.recipient}</td>
            <td>${payment.amount} AZN</td>
            <td>${payment.status}</td>
            <td>
                <button class="complete-btn" data-id="${payment.id}">Tamamla</button>
                <button class="delete-btn" data-id="${payment.id}">Sil</button>
            </td>
        `;
        pendingBody.prepend(tr);

        // Yeni Silme Butonuna Olay Ekle
        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const paymentId = parseInt(deleteBtn.getAttribute('data-id'));
            deletePayment(paymentId, loggedInUser);
        });

        // Yeni Tamamla Butonuna Olay Ekle
        const completeBtn = tr.querySelector('.complete-btn');
        completeBtn.addEventListener('click', () => {
            const paymentId = parseInt(completeBtn.getAttribute('data-id'));
            completePayment(paymentId, loggedInUser);
        });
    }

    function deletePayment(paymentId, user) {
        const confirmDelete = confirm('Bu ödemeyi silmek istediğinizden emin misiniz?');
        if (confirmDelete) {
            user.payments.pending = user.payments.pending.filter(p => p.id !== paymentId);
            updateUser(user);
            loadPayments(user);
        }
    }

    function completePayment(paymentId, user) {
        const paymentIndex = user.payments.pending.findIndex(p => p.id === paymentId);
        if (paymentIndex !== -1) {
            const payment = user.payments.pending[paymentIndex];
            payment.status = 'Tamamlandı';
            user.payments.completed.push(payment);
            user.payments.pending.splice(paymentIndex, 1);
            updateUser(user);
            loadPayments(user);
            alert('Ödeme tamamlandı.');
        }
    }

    function updateUser(updatedUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.fin === updatedUser.fin);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        }
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', options);
    }
});
