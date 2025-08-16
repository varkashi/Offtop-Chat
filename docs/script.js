document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. ПЕРЕКЛЮЧАТЕЛЬ ТЕМ (СВЕТЛАЯ/ТЕМНАЯ)
    // ========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        let theme = 'dark-theme'; // по умолчанию
        if (document.body.classList.contains('light-theme')) {
            theme = 'light-theme';
        }
        localStorage.setItem('theme', theme);
    });

    // ========================================================================
    // 2. МОБИЛЬНОЕ МЕНЮ (SIDE-DRAWER)
    // ========================================================================
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a, .nav-cta-header');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // ========================================================================
    // 3. ИНТЕРАКТИВНАЯ КАРУСЕЛЬ ПРЕИМУЩЕСТВ
    // ========================================================================
    const featuresData = [
        { icon: 'images/icon-freedom.png', title: 'Свобода общения', description: 'Обсуждайте любые темы, делитесь мыслями и мнениями без ограничений. Здесь нет запретов для вашей фантазии!' },
        { icon: 'images/icon-community.png', title: 'Дружелюбное комьюнити', description: 'Находите единомышленников и заводите новых друзей. Наше сообщество всегда радо новым лицам и открыто к общению.' },
        { icon: 'images/icon-activity.png', title: 'Активное общение', description: 'Чат всегда живой и наполнен интересными разговорами. Вы никогда не заскучаете – диалоги кипят круглосуточно!' }
    ];

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        featuresData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'feature-item';
            card.innerHTML = `
                <img src="${item.icon}" alt="Иконка" class="feature-icon">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            carouselWrapper.appendChild(card);
        });

        const cards = document.querySelectorAll('.feature-item');
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next');
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('next');
                }
            });
        }

        document.querySelector('.carousel-arrow.next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });

        document.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // ========================================================================
    // 4. ТАБЫ ДЛЯ ПРАВИЛ
    // ========================================================================
    const tabsContainer = document.querySelector('.rules-tabs-container');
    if (tabsContainer) {
        const tabLinks = tabsContainer.querySelectorAll('.tab-link');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.dataset.tab;

                tabLinks.forEach(item => item.classList.remove('active'));
                tabContents.forEach(item => item.classList.remove('active'));

                link.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // ========================================================================
    // 5. ГОРИЗОНТАЛЬНАЯ КАРУСЕЛЬ ПРОЕКТОВ
    // ========================================================================
    const projectsData = [
        { logo: 'images/easyapk-logo.png', name: 'EasyAPK', desc: 'Игры и программы на Android.', url: 'https://t.me/EasyAPK' },
        { logo: 'images/clowns-easyapk-logo.png', name: 'Клоуны EasyAPK', desc: 'Сборник смешных переписок в EasyAPK.', url: 'https://t.me/clownseasyapk' },
        { logo: 'images/agata-bot-logo.png', name: 'Чат-бот Агата', desc: 'ИИ-бот, созданный специально для Offtop Chat.', url: 'http://t.me/agata_offtop_bot', hint: 'Создан в конструкторе ИИ-ботов <a href="https://t.me/FlearyBot" target="_blank" rel="noopener noreferrer">@FlearyBot</a>.' },
        { logo: 'images/mguys-logo.png', name: 'MGuys', desc: 'Канал модераторов EasyAPK.', url: 'https://t.me/meaguys' },
        { logo: 'images/varkashis-logo.png', name: "varkashi's", desc: 'Канал основателя Offtop Chat.', url: 'https://t.me/pidarebuchi' }
    ];
    
    const projectsCarousel = document.querySelector('.projects-carousel');
    if (projectsCarousel) {
        projectsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'project-item';
            card.innerHTML = `
                <img src="${item.logo}" alt="Логотип ${item.name}" class="project-logo">
                <div>
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>
                    <p class="project-description">${item.desc}</p>
                    ${item.hint ? `<span class="small-text-hint">${item.hint}</span>` : ''}
                </div>
            `;
            projectsCarousel.appendChild(card);
        });
        
        // Клонируем элементы для "бесконечной" прокрутки
        projectsCarousel.innerHTML += projectsCarousel.innerHTML;
        
        // Управляем анимацией
        const container = document.querySelector('.projects-carousel-container');
        let animation;
        
        function startAnimation() {
            const elements = projectsCarousel.querySelectorAll('.project-item');
            const speed = 50; // pixels per second
            const totalWidth = Array.from(elements).reduce((acc, el) => acc + el.offsetWidth + 30, 0) / 2; // 30 is the gap
            
            projectsCarousel.style.animation = `scroll ${totalWidth / speed}s linear infinite`;
            animation = projectsCarousel.style.animation;
        }

        container.addEventListener('mouseenter', () => projectsCarousel.style.animationPlayState = 'paused');
        container.addEventListener('mouseleave', () => projectsCarousel.style.animationPlayState = 'running');

        // Добавляем CSS-анимацию в head
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        `;
        document.head.appendChild(style);
        
        startAnimation();
    }


    // ========================================================================
    // 6. POPUP ДЛЯ ПРАВИЛ ("ВАРН", "МУТ", "БАН")
    // ========================================================================
    const popupTriggers = document.querySelectorAll('.popup-trigger');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.querySelector('.close-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupDescription = document.getElementById('popup-description');

    const definitions = {
        'варн': { title: 'Варн (Предупреждение)', description: 'Это предупреждение от модератора за нарушение правил. Каждое предупреждение приближает вас к исключению из чата.' },
        'мут': { title: 'Мут (Блокировка ввода сообщений)', description: 'Временное ограничение, при котором вы можете читать сообщения в чате, но не можете отправлять свои. Длительность мута определяется модератором.' },
        'бан': { title: 'Бан (Блокировка доступа)', description: 'Полное исключение из чата. Вы не сможете ни читать сообщения, ни отправлять свои, а также повторно присоединиться к чату, если не будет произведен разбан.' }
    };

    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const term = trigger.dataset.term;
            if (definitions[term]) {
                popupTitle.textContent = definitions[term].title;
                popupDescription.textContent = definitions[term].description;
                popupOverlay.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    closePopupButton.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // ========================================================================
    // 7. АНИМАЦИИ ПРИ ПРОКРУТКЕ (SCROLL REVEAL)
    // ========================================================================
    const sectionsToAnimate = document.querySelectorAll('section:not(.hero-section)');
    const heroElementsToAnimate = document.querySelectorAll('.hero-title, .hero-slogan, .hero-cta, .hero-description, .hero-portal');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15
    });

    sectionsToAnimate.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    heroElementsToAnimate.forEach((el, index) => {
        el.classList.add('section-hidden');
        setTimeout(() => {
            el.classList.add('section-visible');
        }, 150 * (index + 1)); // Каскадная анимация
    });

});
