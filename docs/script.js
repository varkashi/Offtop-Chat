document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Навигация и Хедер (гамбургер-меню и sticky header)
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta'); // Все ссылки в меню, включая CTA

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
            }
        });
    });

    closePopupButton.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
    });

    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });

    // ----------------------------------------------------
    // Анимации при прокрутке (Scroll Reveal Animations)
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section, .hero-title, .hero-slogan, .hero-cta, .hero-description');

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

    sections.forEach(section => {
        sectionObserver.observe(section);
        // Дополнительно: некоторые элементы hero секции уже скрыты по умолчанию в CSS
        // Мы добавляем 'section-hidden' для всех элементов для единообразия
        // и 'section-visible' будет убирать это
        if (!section.classList.contains('hero-title') &&
            !section.classList.contains('hero-slogan') &&
            !section.classList.contains('hero-cta') &&
            !section.classList.contains('hero-description')) {
            section.classList.add('section-hidden');
        }
    });

    // Initial check for hero section elements on load
    const heroElements = document.querySelectorAll('.hero-title, .hero-slogan, .hero-cta, .hero-description');
    // For Hero section elements, we want them to animate immediately on page load,
    // so we trigger the 'section-visible' class after a small delay.
    // The initial CSS for these elements should set their opacity to 0 and transform.
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('section-visible');
        }, 100 * index); // Staggered animation for hero elements
    });

});
