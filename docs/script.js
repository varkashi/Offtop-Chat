// script.js

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // --- Динамический год в футере ---
    const footerYearSpan = document.getElementById('footer-year');
    if (footerYearSpan) {
        footerYearSpan.textContent = `© ${new Date().getFullYear()}`;
    }

    // --- Логика для модального окна (Pop-up) ---
    const modal = document.getElementById('rulesModal');
    const openBtn = document.getElementById('openRulesBtn');
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;

    function openModal() {
        if (modal) {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden'; 
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('visible');
            // Даем время анимации закрытия модального окна завершиться
            setTimeout(() => {
                // Проверяем, нет ли других открытых модальных окон (на будущее)
                if (!document.querySelector('.modal.visible')) {
                    document.body.style.overflow = 'auto';
                }
            }, 400); // Соответствует анимации slideInModal + fadeInBg
        }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('visible')) closeModal();
        });
    }

    // --- Логика для анимации хедера при скролле ---
    const heroHeader = document.getElementById('hero-header');
    const mainHeader = document.getElementById('main-header');
    const heroHeight = heroHeader ? heroHeader.offsetHeight : 0; 
    const scrollThreshold = heroHeight * 0.7; 

    function handleHeaderScroll() {
        if (!mainHeader || !heroHeader) return;
        const scrolled = window.scrollY > scrollThreshold;
        mainHeader.classList.toggle('visible', scrolled);
        heroHeader.classList.toggle('scrolled-past', scrolled);
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check

    // --- Анимация появления контента при скролле (Intersection Observer) ---
    const animatedSections = document.querySelectorAll('.animated-section');
    if (animatedSections.length > 0 && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, { rootMargin: "0px 0px -100px 0px" });
        animatedSections.forEach(section => sectionObserver.observe(section));
    } else {
        animatedSections.forEach(section => section.classList.add('is-visible'));
    }

    // --- НОВЫЕ ЭФФЕКТЫ ---

    // 1. Параллакс для звезд в Hero
    const stars = document.querySelectorAll('.stars-background .star');
    if (stars.length > 0 && !isMobile) { // Отключаем параллакс на мобильных
        // Присваиваем каждой звезде случайную "глубину" для параллакса
        stars.forEach(star => {
            star.dataset.depth = Math.random() * 0.4 + 0.1; // от 0.1 до 0.5
        });

        function handleStarParallax() {
            if (window.scrollY < heroHeight) { // Работает только пока виден hero
                const scrollTop = window.scrollY;
                stars.forEach(star => {
                    const depth = parseFloat(star.dataset.depth) || 0.2;
                    const movement = -(scrollTop * depth * 0.3); // Множитель для уменьшения силы эффекта
                    star.style.transform = `translateY(${movement}px)`;
                });
            }
        }
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleStarParallax);
        }, { passive: true });
    }

    // 2. 3D поворот для Hero Title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !isMobile) { // Отключаем на мобильных
        const heroSection = document.getElementById('hero-header');
        
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = heroSection;

            // Координаты курсора относительно центра секции hero
            const x = (clientX - offsetLeft - offsetWidth / 2) / (offsetWidth / 2); 
            const y = (clientY - offsetTop - offsetHeight / 2) / (offsetHeight / 2);

            const maxRotate = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-title-max-rotate')) || 7;

            requestAnimationFrame(() => {
                heroTitle.style.transform = `rotateX(${-y * maxRotate}deg) rotateY(${x * maxRotate}deg) translateZ(20px)`;
                heroTitle.style.textShadow = `${x*2}px ${y*2}px 10px rgba(0,0,0,0.3)`; // Динамическая тень
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                heroTitle.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
                heroTitle.style.textShadow = '0px 1px 5px rgba(0, 0, 0, 0.2)'; // Возврат тени
            });
        });
    }
});
