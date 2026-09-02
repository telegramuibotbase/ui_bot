const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#0e1621');
tg.setBackgroundColor('#0e1621');

const user = tg.initDataUnsafe.user;

// Данные каталога (хардкод)
const catalog = {
    categories: [
        { id: 'soft', name: 'Софт', icon: '' },
        { id: 'accounts', name: 'Аккаунты', icon: '' },
        { id: 'courses', name: 'Курсы', icon: '📚' },
        { id: 'subscriptions', name: 'Подписки', icon: '⭐' },
    ],
    products: {
        soft: [
            { id: 1, name: 'PyCleaner Pro', desc: 'Аналог CCleaner на Python. Полная очистка системы.', price: 500, icon: '🧹' },
            { id: 2, name: 'Telegram Bot Template', desc: 'Готовый шаблон бота с Mini App и оплатой.', price: 300, icon: '🤖' },
            { id: 3, name: 'AutoClicker', desc: 'Автоматизация кликов с гибкими настройками.', price: 200, icon: '️' },
        ],
        accounts: [
            { id: 4, name: 'Steam Аккаунт', desc: 'Аккаунт с 50+ играми, полный доступ.', price: 1500, icon: '' },
            { id: 5, name: 'Discord Nitro', desc: 'Nitro на 1 месяц, моментальная выдача.', price: 350, icon: '💬' },
        ],
        courses: [
            { id: 6, name: 'Python с нуля', desc: 'Полный курс Python: от основ до профи.', price: 2000, icon: '' },
            { id: 7, name: 'Telegram Боты', desc: 'Создание ботов на aiogram 3.x.', price: 1500, icon: '🤖' },
        ],
        subscriptions: [
            { id: 8, name: 'Netflix Premium', desc: 'Личный аккаунт Netflix на 30 дней.', price: 400, icon: '🎬' },
            { id: 9, name: 'Spotify Premium', desc: 'Spotify без рекламы на месяц.', price: 250, icon: '🎵' },
            { id: 10, name: 'YouTube Premium', desc: 'YouTube без рекламы + Music.', price: 300, icon: '▶️' },
        ],
    }
};

// Корзина (в памяти, пока без БД)
let cart = [];

// Инициализация
function init() {
    // Показываем username
    if (user) {
        document.getElementById('username').textContent = '@' + (user.username || 'user');
        document.getElementById('profile-name').textContent = user.first_name || '—';
        document.getElementById('profile-username').textContent = '@' + (user.username || '—');
        document.getElementById('profile-id').textContent = user.id || '—';
    }

    renderCategories();
    setupTabs();
    setupModal();
    updateCartBadge();
}

// Рендер категорий
function renderCategories() {
    const container = document.getElementById('categories-list');
    container.innerHTML = '';
    
    catalog.categories.forEach(cat => {
        const count = catalog.products[cat.id]?.length || 0;
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">${cat.icon}</div>
            <div class="category-name">${cat.name}</div>
            <div class="category-count">${count} товаров</div>
        `;
        card.onclick = () => showProducts(cat.id);
        container.appendChild(card);
    });
}

// Показать товары категории
function showProducts(categoryId) {
    const category = catalog.categories.find(c => c.id === categoryId);
    const products = catalog.products[categoryId] || [];
    
    document.getElementById('categories-list').style.display = 'none';
    const productsList = document.getElementById('products-list');
    productsList.style.display = 'block';
    
    productsList.innerHTML = `
        <div class="products-header">
            <button class="back-btn" onclick="backToCategories()">◀</button>
            <h2>${category.icon} ${category.name}</h2>
        </div>
        <div class="products-list">
            ${products.map(p => `
                <div class="product-card" onclick="openProduct(${p.id}, '${categoryId}')">
                    <div class="product-icon">${p.icon}</div>
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-desc">${p.desc}</div>
                    </div>
                    <div class="product-price">${p.price} ₽</div>
                </div>
            `).join('')}
        </div>
    `;
}

function backToCategories() {
    document.getElementById('categories-list').style.display = 'grid';
    document.getElementById('products-list').style.display = 'none';
}

// Открыть товар
function openProduct(productId, categoryId) {
    const product = catalog.products[categoryId].find(p => p.id === productId);
    const category = catalog.categories.find(c => c.id === categoryId);
    
    document.getElementById('modal-icon').textContent = product.icon;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-category').textContent = category.name;
    document.getElementById('modal-desc').textContent = product.desc;
    document.getElementById('modal-price').textContent = product.price + ' ₽';
    
    const buyBtn = document.getElementById('modal-buy');
    buyBtn.onclick = () => addToCart(product);
    
    document.getElementById('product-modal').classList.add('active');
}

function setupModal() {
    document.getElementById('modal-close').onclick = closeModal;
    document.getElementById('product-modal').onclick = (e) => {
        if (e.target.id === 'product-modal') closeModal();
    };
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

// Корзина
function addToCart(product) {
    cart.push(product);
    updateCartBadge();
    renderCart();
    closeModal();
    tg.HapticFeedback.notificationOccurred('success');
    tg.showPopup({ title: 'Добавлено!', message: `${product.name} в корзине`, buttons: [{type: 'ok'}] });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    // Удаляем старые бейджи
    document.querySelectorAll('.cart-badge').forEach(b => b.remove());
    
    if (cart.length > 0) {
        const cartTab = document.querySelector('[data-tab="cart"]');
        const badge = document.createElement('div');
        badge.className = 'cart-badge';
        badge.textContent = cart.length;
        cartTab.appendChild(badge);
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalBlock = document.getElementById('cart-total');
    const emptyBlock = document.getElementById('cart-empty');
    
    if (cart.length === 0) {
        container.innerHTML = '';
        totalBlock.style.display = 'none';
        emptyBlock.style.display = 'block';
        return;
    }
    
    emptyBlock.style.display = 'none';
    totalBlock.style.display = 'block';
    
    container.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-sum').textContent = total;
}

// Табы
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const pageId = 'page-' + tab.dataset.tab;
            document.getElementById(pageId).classList.add('active');
            
            if (tab.dataset.tab === 'cart') renderCart();
        };
    });
    
    document.getElementById('checkout-btn').onclick = checkout;
}

function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const items = cart.map(i => i.name).join(', ');
    
    // Пока заглушка - на следующем этапе подключим оплату
    tg.showPopup({
        title: 'Оформление заказа',
        message: `Сумма: ${total} ₽\nТовары: ${items}\n\n⚠️ Оплата пока в тестовом режиме. На следующем этапе подключим ЮMoney.`,
        buttons: [{type: 'ok', text: 'Понятно'}]
    });
}

// Запуск
init();
