document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Навигация и Хедер (гамбургер-меню и sticky header)
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    // Все ссылки в меню, включая CTA в хедере (для закрытия меню по клику)
    const navLinks = document.querySelectorAll('.nav-list a, .nav-cta-header'); 

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Для блокировки прокрутки под меню
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Проверяем, активно ли мобильное меню
            if (nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // ----------------------------------------------------
    // Popup для правил (Варн, Мут, Бан)
    // ----------------------------------------------------
    const popupTriggers = document.querySelectorAll('.popup-trigger');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.querySelector('.close-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupDescription = document.getElementById('popup-description');

    const definitions = {
        'варн': {
            title: 'Варн (Предупреждение)',
            description: 'Это предупреждение от модератора за нарушение правил. Каждое предупреждение приближает вас к исключению из чата.'
        },
        'мут': {
            title: 'Мут (Блокировка ввода сообщений)',
            description: 'Временное ограничение, при котором вы можете читать сообщения в чате, но не можете отправлять свои. Длительность мута определяется модератором.'
        },
        'бан': {
            title: 'Бан (Блокировка доступа)',
            description: 'Полное исключение из чата. Вы не сможете ни читать сообщения, ни отправлять свои, а также повторно присоединиться к чату, если не будет произведен разбан.'
        }
    };

    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const term = trigger.dataset.term;
            if (definitions[term]) {
                popupTitle.textContent = definitions[term].title;
                popupDescription.textContent = definitions[term].description;
                popupOverlay.classList.add('active');
                document.body.classList.add('no-scroll'); // Блокировка прокрутки фона
            }
        });
    });

    closePopupButton.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) { // Закрыть попап при клике вне его содержимого
            popupOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // ----------------------------------------------------
    // Анимации при прокрутке (Scroll Reveal Animations)
    // ----------------------------------------------------
    // Выбираем все секции, кроме hero-section, а также отдельные элементы hero-section
    const sectionsToAnimate = document.querySelectorAll('section:not(.hero-section)');
    const heroElementsToAnimate = document.querySelectorAll('.hero-title, .hero-slogan, .hero-cta, .hero-description');

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target); // Остановить наблюдение после появления
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null, // viewport
        threshold: 0.15 // Появление, когда 15% элемента видно
    });

    // Наблюдаем за всеми секциями, кроме Hero, чтобы они появлялись при прокрутке
    sectionsToAnimate.forEach(section => {
        section.classList.add('section-hidden'); // Убедимся, что они изначально скрыты
        sectionObserver.observe(section);
    });

    // Анимация элементов Hero-секции при загрузке страницы (без Intersection Observer для них)
    heroElementsToAnimate.forEach((el, index) => {
        // Убедимся, что hero-элементы изначально скрыты (для CSS-анимации)
        el.classList.add('section-hidden'); 
        setTimeout(() => {
            el.classList.add('section-visible');
        }, 150 * index); // Staggered animation for hero elements
    });

});
