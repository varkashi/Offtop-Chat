// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Логика для модального окна (Pop-up) ---
    const modal = document.getElementById('rulesModal');
    const openBtn = document.getElementById('openRulesBtn');
    const closeBtn = modal.querySelector('.close-btn'); // Ищем внутри modal

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
            }, 300); 
        }
    }

    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
            }
        });
    }


    // --- Логика для анимации хедера при скролле ---
    const heroHeader = document.getElementById('hero-header');
    const mainHeader = document.getElementById('main-header');
    // Убедимся, что heroHeader существует перед получением offsetHeight
    const heroHeight = heroHeader ? heroHeader.offsetHeight : 0; 
    const scrollThreshold = heroHeight * 0.7; 

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
    handleHeaderScroll(); 


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
        }, {
            rootMargin: "0px 0px -100px 0px" 
        });

        animatedSections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        animatedSections.forEach(section => {
            section.classList.add('is-visible'); 
        });
    }

});
