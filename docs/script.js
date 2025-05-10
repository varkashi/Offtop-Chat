// script.js
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    const mapViewPort = document.getElementById('map-viewport');
    const mapCamera = document.getElementById('map-camera');
    const mapObjects = document.querySelectorAll('.map-object');
    
    const contentPanel = document.getElementById('content-panel');
    const contentPanelBody = document.getElementById('content-panel-body');
    const closeContentPanelBtn = document.getElementById('close-content-panel');
    
    const navButtons = document.querySelectorAll('#map-navigation button[data-target-id]');
    const zoomOutButton = document.getElementById('zoom-out-button');

    let initialCameraX = 0;
    let initialCameraY = 0;
    let initialCameraScale = 0.3; // Начальный зум, чтобы видеть больше карты

    function setInitialCameraPosition() {
        // Центрируем камеру относительно вьюпорта
        // Размеры #map-camera заданы в CSS (2000x1500)
        // Мы хотим, чтобы центр #map-camera (1000, 750) совпал с центром вьюпорта
        // transform-origin для #map-camera по умолчанию 50% 50%
        // Для начального отображения, сфокусируемся на #object-hub
        const hub = document.getElementById('object-hub');
        if (hub) {
            const hubX = parseFloat(hub.dataset.targetX) || 0;
            const hubY = parseFloat(hub.dataset.targetY) || 0;
            const hubScale = parseFloat(hub.dataset.targetScale) || 1.5;
            
            // Расчет для центрирования хаба при начальном масштабе
            initialCameraX = -hubX * initialCameraScale + (mapCamera.offsetWidth / 2 - hub.offsetWidth / 2 * hubScale * initialCameraScale - hub.offsetLeft * initialCameraScale);
            initialCameraY = -hubY * initialCameraScale + (mapCamera.offsetHeight / 2 - hub.offsetHeight / 2 * hubScale * initialCameraScale - hub.offsetTop * initialCameraScale);

            // Более простой подход: просто общий вид
            initialCameraX = (mapViewPort.offsetWidth - mapCamera.offsetWidth * initialCameraScale) / 2;
            initialCameraY = (mapViewPort.offsetHeight - mapCamera.offsetHeight * initialCameraScale) / 2;
           
            // Сразу фокусируемся на Хабе при загрузке
            const targetX = parseFloat(hub.dataset.targetX) || 0;
            const targetY = parseFloat(hub.dataset.targetY) || 0;
            const targetScale = parseFloat(hub.dataset.targetScale) || 1;
            focusOnCoords(targetX, targetY, targetScale);

        } else {
             mapCamera.style.transform = `translate(${initialCameraX}px, ${initialCameraY}px) scale(${initialCameraScale})`;
        }
    }
    
    function focusOnCoords(x, y, scale) {
        if (isMobile) return; // На мобильных камера не двигается

        // x, y - это координаты ЦЕНТРА объекта относительно центра #map-camera
        // Нам нужно сдвинуть #map-camera так, чтобы эта точка (x,y) оказалась в центре #map-viewport
        // При этом учитываем масштаб scale
        
        const viewportCenterX = mapViewPort.offsetWidth / 2;
        const viewportCenterY = mapViewPort.offsetHeight / 2;

        // Координаты, на которые нужно сместить #map-camera
        // (mapCamera.width/2 + x) - это позиция объекта от левого края камеры
        // Умножаем на scale, чтобы получить позицию в масштабированном виде
        // Вычитаем viewportCenterX, чтобы эта точка стала центром вьюпорта
        const camX = -(x * scale) + viewportCenterX - (mapCamera.offsetWidth / 2 * scale);
        const camY = -(y * scale) + viewportCenterY - (mapCamera.offsetHeight / 2 * scale);

        mapCamera.style.transform = `translate(${camX}px, ${camY}px) scale(${scale})`;
    }

    function showContent(targetId) {
        const contentToShow = document.querySelector(`.hidden-content #${targetId}`);
        if (contentToShow) {
            contentPanelBody.innerHTML = contentToShow.innerHTML;
            contentPanel.classList.add('visible');
        }
    }

    function hideContentPanel() {
        contentPanel.classList.remove('visible');
        // Очищаем контент после скрытия, чтобы избежать мелькания при следующем открытии
        setTimeout(() => {
            if (!contentPanel.classList.contains('visible')) {
                contentPanelBody.innerHTML = '';
            }
        }, 400);
    }

    // Обработчики для объектов на карте
    mapObjects.forEach(obj => {
        const button = obj.querySelector('.map-object-button');
        if (button && button.getAttribute('href') && button.getAttribute('href').startsWith('#content-')) {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Предотвращаем переход по якорю
                e.stopPropagation(); // Остановка всплытия, чтобы не сработал клик на родительский .map-object для фокусировки
                
                const targetContentId = button.getAttribute('href').substring(1);
                showContent(targetContentId);

                // На мобильных просто показываем контент, не двигаем камеру
                if (isMobile) return;

                // Фокусировка камеры, если это не портал
                if (obj.id !== 'object-portal') {
                    const targetX = parseFloat(obj.dataset.targetX) || 0;
                    const targetY = parseFloat(obj.dataset.targetY) || 0;
                    const targetScale = parseFloat(obj.dataset.targetScale) || 1;
                    focusOnCoords(targetX, targetY, targetScale);
                }
            });
        }
        // Если клик на сам объект (не на кнопку внутри), и это не портал (у портала своя кнопка-ссылка)
        if (obj.id !== 'object-portal') {
             obj.addEventListener('click', (e) => {
                // Если кликнули не по внутренней кнопке
                if (e.target.closest('.map-object-button')) return;

                // Если это хаб, и у него есть кнопка, которая уже открывает контент
                if(obj.id === 'object-hub' && obj.querySelector('.map-object-button[href="#content-hub"]')) {
                    // Уже обработано кнопкой
                } else {
                     // Для других объектов или хаба без кнопки - пытаемся найти контент по ID объекта
                    const contentId = obj.id.replace('object-', 'content-');
                    const contentExists = document.getElementById(contentId);
                    if(contentExists) {
                        showContent(contentId);
                    }
                }
                
                if (isMobile) return;
                const targetX = parseFloat(obj.dataset.targetX) || 0;
                const targetY = parseFloat(obj.dataset.targetY) || 0;
                const targetScale = parseFloat(obj.dataset.targetScale) || 1;
                focusOnCoords(targetX, targetY, targetScale);
            });
        }
    });

    if (closeContentPanelBtn) {
        closeContentPanelBtn.addEventListener('click', hideContentPanel);
    }
    // Закрытие панели по клику вне ее (если нужно)
    // document.addEventListener('click', (e) => {
    //     if (contentPanel.classList.contains('visible') && !contentPanel.contains(e.target) && !e.target.closest('.map-object')) {
    //         hideContentPanel();
    //     }
    // });
     document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && contentPanel.classList.contains('visible')) {
            hideContentPanel();
        }
    });


    // Навигационные кнопки
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetObjectId = button.dataset.targetId;
            const targetObject = document.getElementById(targetObjectId);
            if (targetObject) {
                 // Показать контент, если это не портал
                if (targetObjectId !== 'object-portal') {
                    const contentId = targetObjectId.replace('object-', 'content-');
                    const contentExists = document.getElementById(contentId);
                     if(contentExists) {
                        showContent(contentId);
                    } else if (targetObjectId === 'object-hub') { // Особый случай для хаба
                        showContent('content-hub');
                    }
                }

                if (isMobile) { // На мобильных просто скроллим к элементу, если они в стеке
                    targetObject.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    const targetX = parseFloat(targetObject.dataset.targetX) || 0;
                    const targetY = parseFloat(targetObject.dataset.targetY) || 0;
                    const targetScale = parseFloat(targetObject.dataset.targetScale) || 1;
                    focusOnCoords(targetX, targetY, targetScale);
                }
            }
        });
    });

    if (zoomOutButton) {
        zoomOutButton.addEventListener('click', () => {
            if (isMobile) return;
            focusOnCoords(0, 0, initialCameraScale); // Возврат к общему виду
            hideContentPanel();
        });
    }

    // 3D поворот для Hero Title на карте
    const heroTitleMap = document.querySelector('.hero-title-map');
    const hubObject = document.getElementById('object-hub'); // Поворот относительно хаба

    if (heroTitleMap && hubObject && !isMobile) {
        hubObject.addEventListener('mousemove', (e) => {
            const rect = hubObject.getBoundingClientRect(); // Получаем позицию хаба на экране
            const parentRect = mapCamera.getBoundingClientRect(); // Позиция камеры
            
            // Координаты мыши относительно центра хаба (учитывая текущий scale камеры)
            const currentCameraScale = parseFloat(mapCamera.style.transform.match(/scale\((.*?)\)/)?.[1] || initialCameraScale);
            
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            const maxRotate = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-title-max-rotate')) || 5;

            requestAnimationFrame(() => {
                heroTitleMap.style.transform = `rotateX(${-y * maxRotate}deg) rotateY(${x * maxRotate}deg) translateZ(10px)`;
                // Динамическое свечение (можно усложнить)
                heroTitleMap.style.textShadow = `
                    ${x*1.5}px ${y*1.5}px 10px rgba(240, 230, 255, 0.7),
                    0 0 18px rgba(255, 255, 255, 0.5)
                `;
            });
        });

        hubObject.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                heroTitleMap.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
                heroTitleMap.style.textShadow = `
                    0 0 8px rgba(240, 230, 255, 0.6),
                    0 0 15px rgba(255, 255, 255, 0.4)
                `;
            });
        });
    }
    
    // Установка начального положения камеры
    if (!isMobile) {
       // setInitialCameraPosition(); // Вызываем после того как все элементы загружены
       // Или сразу фокусируемся на хабе
       const hub = document.getElementById('object-hub');
       if (hub) {
           const targetX = parseFloat(hub.dataset.targetX) || 0;
           const targetY = parseFloat(hub.dataset.targetY) || 0;
           const targetScale = parseFloat(hub.dataset.targetScale) || 1.5; // Начальный фокус на хабе
           focusOnCoords(targetX, targetY, targetScale);
           // Показать контент хаба при загрузке
           showContent('content-hub');
       }
    } else {
        // На мобильных, возможно, показать контент хаба по умолчанию
        showContent('content-hub');
        // И обеспечить видимость #map-camera если она была скрыта
        if (mapCamera) mapCamera.style.opacity = 1;
    }
});
