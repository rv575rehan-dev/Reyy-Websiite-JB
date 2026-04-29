// Mengambil data dari localStorage saat pertama kali load, 
// jika kosong, gunakan data default.
let accounts = JSON.parse(localStorage.getItem('ffstore_db')) || [
    { id: 1, category: "FreeFire", title: "Akun Old S1 S2", description: "SG OPM MAX 4, Full Skin Senjata", loginVia: "Facebook", price: 1400000, owner: 'admin' },
    { id: 2, category: "FreeFire", title: "Akun Sultan Full EP", description: "Elite Pass S1-S10, Bundle Langka", loginVia: "Google", price: 2000000, owner: 'admin' },
    { id: 3, category: "Promo", title: "Akun Semi Old", description: "SG Metal, Diamond 2000+", loginVia: "Facebook", price: 750000, owner: 'admin' }
];

// Fungsi untuk menyimpan data ke "Database" (localStorage)
function saveToDatabase() {
    localStorage.setItem('ffstore_db', JSON.stringify(accounts));
}

// --- User Management (Database Lokal) ---
let users = JSON.parse(localStorage.getItem('ffstore_users')) || [
    { username: 'admin', password: '123' } // Default admin user
];

function saveUsersToDatabase() {
    localStorage.setItem('ffstore_users', JSON.stringify(users));
}

let loggedInUser = JSON.parse(localStorage.getItem('ffstore_loggedInUser')) || null;

const productGrid = document.getElementById('productGrid');
const navSellAccount = document.getElementById('nav-sell-account');
const navRegister = document.getElementById('nav-register');
const navAuthLink = document.getElementById('nav-auth-link');
const loginError = document.getElementById('login-error');

function displayProducts(filter) {
    if (!productGrid) return;

    // Smooth Fade Transition
    productGrid.style.opacity = "0";
    productGrid.style.transform = "translateY(10px)";

    setTimeout(() => {
        productGrid.innerHTML = "";
        const filtered = filter === "all" ? accounts : accounts.filter(item => item.category === filter); // Filter by category

        filtered.forEach((acc, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="card-content">
                    <span class="category-badge">${acc.category === 'Promo' ? '🔥 PROMO' : '💎 ELITE'}</span>
                    <h3 class="card-title">${acc.title}</h3>
                    <p class="card-desc">${acc.description}</p>
                    <div class="card-meta">VIA LOGIN: <span>${acc.loginVia}</span></div>
                    <div class="card-divider">
                        <p class="card-price">Rp ${acc.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button class="buy-btn" onclick="alert('Lanjut ke WhatsApp untuk akun ${acc.title} seharga Rp ${acc.price.toLocaleString('id-ID')}')">Detail</button>
                </div>`;
            productGrid.appendChild(card);
        });
        productGrid.style.opacity = "1";
        productGrid.style.transform = "translateY(0)";
        productGrid.style.transition = "all 0.4s ease";
    }, 300); // Delay for fade transition
}

// --- Login/Logout Functions ---
function loginUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = { username: user.username };
        localStorage.setItem('ffstore_loggedInUser', JSON.stringify(loggedInUser));
        updateNavAndPage();
        showPage('home'); // Redirect to home after successful login
        return true;
    }
    return false;
}

function logoutUser() {
    loggedInUser = null;
    localStorage.removeItem('ffstore_loggedInUser');
    updateNavAndPage();
    showPage('home'); // Redirect to home after logout
}

function updateNavAndPage() {
    // Navigation for SELL ACCOUNT and REGISTER are now handled dynamically
    if (loggedInUser) {
        navRegister.classList.add('hidden');
        navAuthLink.innerHTML = `<li><a href="#" onclick="logoutUser()" class="nav-cta">LOGOUT (${loggedInUser.username.toUpperCase()})</a></li>`;
    } else {
        navRegister.classList.remove('hidden');
        navAuthLink.innerHTML = `<li><a href="#" onclick="showPage('login')" class="nav-cta">LOGIN</a></li>`;
    }
}

function showPage(page) {
    document.getElementById('home-page').style.display = (page === 'home') ? 'block' : 'none';
    document.getElementById('jual-page').style.display = (page === 'jual') ? 'block' : 'none';
    document.getElementById('login-page').style.display = (page === 'login') ? 'block' : 'none';
    document.getElementById('register-page').style.display = (page === 'register') ? 'block' : 'none';

    if (page === 'jual') {
        const loggedInView = document.getElementById('jual-logged-in');
        const loggedOutView = document.getElementById('jual-logged-out');
        if (loggedInUser) {
            loggedInView.style.display = 'block';
            loggedOutView.style.display = 'none';
        } else {
            loggedInView.style.display = 'none';
            loggedOutView.style.display = 'block';
        }
    }
    if (page === 'home') {
        displayProducts('all');
    }
    if (page === 'login') {
        loginError.classList.add('hidden'); // Hide error message on page load
    }
}

// --- Event Listeners ---
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (loginUser(username, password)) {
        loginError.classList.add('hidden');
    } else {
        loginError.classList.remove('hidden');
    }
}); // Fixed: Added closing parenthesis and semicolon

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const regMsg = document.getElementById('reg-msg');

    if (users.find(u => u.username === username)) {
        regMsg.textContent = "Username sudah terdaftar!";
        regMsg.style.color = "red";
    } else {
        users.push({ username, password });
        saveUsersToDatabase();
        regMsg.textContent = "Registrasi Berhasil! Silakan Login.";
        regMsg.style.color = "#FFD700";
        this.reset();
    }
    regMsg.classList.remove('hidden');
});

document.getElementById('formJual').addEventListener('submit', function(e) {
    e.preventDefault();
    const newAcc = {
        id: Date.now(),
        category: document.getElementById('kategori').value,
        title: document.getElementById('judul').value,
        description: document.getElementById('keterangan').value,
        loginVia: document.getElementById('loginVia').value,
        price: parseInt(document.getElementById('harga').value),
        owner: loggedInUser ? loggedInUser.username : 'guest' // Assign owner to the account
    };
    accounts.unshift(newAcc);
    saveToDatabase(); // Simpan ke database lokal
    alert("Iklan Berhasil Terpasang!");
    this.reset();
    showPage('home');
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        displayProducts(this.getAttribute('data-filter'));
    });
});

// --- Initial Setup ---
saveUsersToDatabase(); // Ensure default admin user is saved
updateNavAndPage(); // Update navigation based on initial login status
displayProducts("all"); // Display products on initial load