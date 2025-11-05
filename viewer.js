document.addEventListener('DOMContentLoaded', () => {
    // Елемент з вашого HTML
    const container = document.getElementById('accordion-container');
    
    // Початкова "сигнатура" даних. Ми будемо порівнювати з нею
    // час останньої зміни файлу (timestamp) з сервера.
    let currentDataSignature = 0; 

    // --- ФУНКЦІЯ 1: Завантаження та оновлення (Завдання 2d + 2e) ---
    async function fetchAndUpdate() {
        try {
            // Додаємо ?t=... (поточний час) щоб уникнути кешування запиту браузером
            const response = await fetch('get_accordion.php?t=' + new Date().getTime()); 
            
            if (!response.ok) {
                container.innerHTML = '<p style="color: red;">Помилка завантаження даних.</p>';
                return;
            }

            // Отримуємо відповідь від PHP
            const responseObject = await response.json(); 
            
            // Нова "сигнатура" - це час модифікації файлу
            const newDataSignature = responseObject.timestamp; 
            
            // **Завдання 2e: Періодичний контроль змін**
            // Оновлюємо HTML, тільки якщо час на сервері новіший за той, що ми бачили
            if (newDataSignature !== currentDataSignature) {
                console.log('Виявлено зміни! Оновлюю акордеон...');
                
                // Зберігаємо новий час як "поточний"
                currentDataSignature = newDataSignature; 
                
                // Передаємо в функцію рендерингу тільки масив 'items'
                renderAccordion(responseObject.items); 
            } else {
                // console.log('Змін немає.'); // Можна розкоментувати для перевірки
            }

        } catch (error) {
            console.error('Не вдалося отримати дані:', error);
            container.innerHTML = '<p style="color: red;">Помилка обробки даних.</p>';
        }
    }

    // --- ФУНКЦІЯ 2: Генерація HTML та JS (Завдання 2d) ---
    // (Ця функція відповідає CSS-стилям з .accordion-header та .accordion-content)
    function renderAccordion(data) {
        // 1. Очищуємо контейнер
        container.innerHTML = '';

        // Перевіряємо, чи є взагалі дані
        if (!data || data.length === 0) {
            container.innerHTML = '<p>Немає даних для відображення. Додайте їх на сторінці Admin.</p>';
            return;
        }

        // 2. Створюємо HTML елементи для кожного об'єкта в масиві
        data.forEach(item => {
            // <div class="accordion-item">
            const itemDiv = document.createElement('div');
            itemDiv.className = 'accordion-item';

            // <button class="accordion-header">
            const headerBtn = document.createElement('button');
            headerBtn.className = 'accordion-header';
            headerBtn.textContent = item.title; // Безпечна вставка тексту

            // <div class="accordion-content">
            const contentDiv = document.createElement('div');
            contentDiv.className = 'accordion-content';
            
            // <p> (всередині .accordion-content)
            const contentP = document.createElement('p');
            contentP.textContent = item.content; // Безпечна вставка тексту
            
            // Збираємо все разом
            contentDiv.appendChild(contentP);
            itemDiv.appendChild(headerBtn);
            itemDiv.appendChild(contentDiv);
            
            // Додаємо готовий елемент в контейнер
            container.appendChild(itemDiv);
        });

        // 3. Додаємо JS-функціонал (логіку кліків) до щойно створених елементів
        // (Це виконує вимогу "функціонування без JS-фреймворків")
        addAccordionLogic();
    }

    // --- ФУНКЦІЯ 3: Додавання логіки кліків (Частина завдання 2d) ---
    function addAccordionLogic() {
        const headers = container.querySelectorAll('.accordion-header');

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling; // .accordion-content

                // Перемикаємо клас 'active' на заголовку (для CSS)
                header.classList.toggle('active');

                // Перевіряємо, чи блок ВЖЕ відкритий (чи є у нього max-height)
                if (content.style.maxHeight) {
                    // Якщо так - закриваємо його
                    content.style.maxHeight = null;
                } else {
                    // Якщо ні - відкриваємо
                    // Встановлюємо max-height рівним повній висоті вмісту (scrollHeight)
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                
                // (Опціонально) Закриваємо всі ІНШІ елементи
                headers.forEach(otherHeader => {
                    if (otherHeader !== header) { 
                        otherHeader.classList.remove('active');
                        otherHeader.nextElementSibling.style.maxHeight = null;
                    }
                });
            });
        });
    }

    // --- ЗАПУСК ---
    
    // 1. Завантажуємо дані одразу при відкритті сторінки
    fetchAndUpdate();

    // 2. Встановлюємо періодичну перевірку (Завдання 2e)
    // Інтервал у 5000 мілісекунд = 5 секунд
    setInterval(fetchAndUpdate, 5000); 
});