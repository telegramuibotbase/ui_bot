const tg = window.Telegram.WebApp;

tg.expand();

tg.setHeaderColor('#0e1621');
tg.setBackgroundColor('#0e1621');

const user = tg.initDataUnsafe.user;

if (user) {
    console.log('Пользователь:', user);
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        openPage(page);
    });
});

function openPage(page) {
    const pages = {
        'subscriptions': {
            title: 'Мои подписки',
            content: 'Здесь будут отображаться ваши активные подписки и их статус.'
        },
        'catalog': {
            title: 'Каталог',
            content: 'Просмотрите все доступные товары и услуги.'
        },
        'history': {
            title: 'История',
            content: 'История ваших покупок и активностей.'
        },
        'tutorials': {
            title: 'Туториалы',
            content: 'Обучающие материалы и инструкции по использованию.'
        },
        'referral': {
            title: 'Реферальная система',
            content: 'Приглашайте друзей и получайте бонусы! Ваша ссылка: https://t.me/ui_shop_bot?start=ref_' + (user?.id || 'unknown')
        },
        'news': {
            title: 'Новости',
            content: 'Последние обновления и новости проекта.'
        },
        'support': {
            title: 'Техническая поддержка',
            content: 'Связаться с поддержкой: @your_support_username'
        }
    };

    const pageData = pages[page];
    if (pageData) {
        showModal(pageData.title, pageData.content);
    }
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            <p>${content}</p>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

console.log('Mini App загружен!');