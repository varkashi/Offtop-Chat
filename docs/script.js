// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Логика для модального окна (Pop-up) ---
    const modal = document.getElementById('rulesModal');
    const openBtn = document.getElementById('openRulesBtn');
    const closeBtn = modal.querySelector('.close-btn');

    function openModal() {
        if (modal) {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Запретить скролл фона
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('visible');
            // Небольшая задержка перед восстановлением скролла, чтобы анимация закрытия успела
            setTimeout(() => {
                // Проверяем, не открыто ли другое модальное окно (если их будет больше)
                if (!document.querySelector('.modal.visible')) {
                    document.body.style.overflow = 'auto';
                }
            }, 300); // Время должно совпадать с анимацией закрытия (если есть)
        }
    }

    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        // Закрытие по клику на фон
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
        // Закрытие по Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
            }
        });
    }


    // --- Логика для анимации хедера при скролле ---
    const heroHeader = document.getElementById('hero-header');
    const mainHeader = document.getElementById('main-header');
    const heroHeight = heroHeader ? heroHeader.offsetHeight : 0; // Высота hero секции
    const scrollThreshold = heroHeight * 0.7; // Порог скролла (например, 70% высоты hero)

    function handleHeaderScroll() {
        if (!mainHeader || !heroHeader) return;

        if (window.scrollY > scrollThreshold) {
            mainHeader.classList.add('visible');
            heroHeader.classList.add('scrolled-past');
        } else {
            mainHeader.classList.remove('visible');
            heroHeader.classList.remove('scrolled-past');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Проверить состояние при загрузке


    // --- Анимация появления контента при скролле (Intersection Observer) ---
    const animatedSections = document.querySelectorAll('.animated-section');

    if (animatedSections.length > 0 && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Отключить наблюдение после анимации
                }
            });
        }, {
            rootMargin: "0px 0px -100px 0px" // Анимация начнется чуть раньше, чем секция полностью видна
        });

        animatedSections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        // Фоллбэк для старых браузеров или если нет секций
        animatedSections.forEach(section => {
            section.classList.add('is-visible'); // Просто показать
        });
    }

});
