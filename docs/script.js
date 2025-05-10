// script.js
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // --- Динамический год в футере ---
    const footerYearSpan = document.getElementById('footer-year');
    if (footerYearSpan) {
        footerYearSpan.textContent = `© ${new Date().getFullYear()}`;
    }

    // --- Пульсар Курсора ---
    const cursorTrail = document.querySelector('.cursor-trail');
    if (cursorTrail && !isMobile) { // Отключаем на мобильных
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorTrail.style.left = `${e.clientX}px`;
                cursorTrail.style.top = `${e.clientY}px`;
            });
        });
        // Небольшая задержка для скрытия, если курсор покинул окно
        document.addEventListener('mouseleave', () => {
            cursorTrail.style.opacity = '0';
            cursorTrail.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        document.addEventListener('mouseenter', () => { // Показываем при возвращении
             if (document.body.matches(':hover')) { // Убедимся что курсор действительно над body
                cursorTrail.style.opacity = '1';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
             }
        });
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
            setTimeout(() => {
                if (!document.querySelector('.modal.visible')) {
                    document.body.style.overflow = 'auto';
                }
            }, 500); // Соответствует анимации slideInModalContent
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
    const heroHeaderEl = document.getElementById('hero-header'); // Изменено имя переменной, чтобы не конфликтовать
    const mainHeader = document.getElementById('main-header');
    const heroHeight = heroHeaderEl ? heroHeaderEl.offsetHeight : 0; 
    const scrollThreshold = heroHeight * 0.75; // Порог чуть дальше

    function handleHeaderScroll() {
        if (!mainHeader || !heroHeaderEl) return;
        const scrolled = window.scrollY > scrollThreshold;
        mainHeader.classList.toggle('visible', scrolled);
        heroHeaderEl.classList.toggle('scrolled-past', scrolled);
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
        }, { rootMargin: "0px 0px -120px 0px" }); // Порог чуть раньше
        animatedSections.forEach(section => sectionObserver.observe(section));
    } else { // Fallback
        animatedSections.forEach(section => section.classList.add('is-visible'));
    }

    // --- ЭФФЕКТЫ HERO СЕКЦИИ ---

    // 1. Параллакс для звезд
    const stars = document.querySelectorAll('.stars-background .star');
    if (stars.length > 0 && !isMobile) {
        stars.forEach(star => {
            star.dataset.depth = Math.random() * 0.5 + 0.1; // от 0.1 до 0.6
            star.style.setProperty('--initial-top', star.offsetTop + 'px'); // Сохраняем начальную позицию
            star.style.setProperty('--initial-left', star.offsetLeft + 'px');
        });

        function handleStarParallax() {
            if (window.scrollY < heroHeight) {
                const scrollTop = window.scrollY;
                stars.forEach(star => {
                    const depth = parseFloat(star.dataset.depth) || 0.2;
                    const movementY = -(scrollTop * depth * 0.25); // Уменьшил силу эффекта
                    // Движение по X можно добавить для разнообразия, если курсор двигается
                    // const movementX = (mouseX - window.innerWidth / 2) * depth * 0.01;
                    star.style.transform = `translateY(${movementY}px)`; // translateX(${movementX}px)
                });
            }
        }
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleStarParallax);
        }, { passive: true });
    }

    // 2. 3D поворот для Hero Title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroHeaderEl && !isMobile) { 
        heroHeaderEl.addEventListener('mousemove', (e) => {
            const rect = heroHeaderEl.getBoundingClientRect();
            // Координаты курсора относительно центра hero-секции
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); 
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            const maxRotate = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-title-max-rotate')) || 6;

            requestAnimationFrame(() => {
                heroTitle.style.transform = `rotateX(${-y * maxRotate}deg) rotateY(${x * maxRotate}deg) translateZ(15px)`;
                // Динамическое изменение свечения (интенсивность)
                const baseShadow = `0 0 10px rgba(250, 221, 255, ${0.6 + Math.abs(y)*0.2}),
                                  0 0 20px rgba(255, 255, 255, ${0.3 + Math.abs(x)*0.15}),
                                  0 0 30px rgba(224, 39, 159, ${0.2 + Math.abs(y+x)*0.1})`;
                heroTitle.style.textShadow = baseShadow;
            });
        });

        heroHeaderEl.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                heroTitle.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
                heroTitle.style.textShadow = `0 0 10px rgba(250, 221, 255, 0.6),
                                            0 0 20px rgba(255, 255, 255, 0.3),
                                            0 0 30px rgba(224, 39, 159, 0.2)`;
            });
        });
    }
});
