document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');
    let lastTimestamp = 0; // Зберігаємо час останнього оновлення

    // (d) Функція для рендерингу (формування коду) акордеону
    const renderAccordion = (items) => {
        // Очищуємо контейнер
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p>Немає даних для відображення.</p>';
            return;
        }

        items.forEach((item, index) => {
            // Створюємо HTML-структуру для кожного елемента
            const itemDiv = document.createElement('div');
            itemDiv.className = 'accordion-item';

            itemDiv.innerHTML = `
                <div class="accordion-header">
                    <button class="accordion-button" type="button">
                        ${item.title}
                    </button>
                </div>
                <div class="accordion-collapse">
                    <div class="accordion-body">
                        ${item.content.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    };

    // (d) Функція для додавання логіки (JS) акордеону
    const attachAccordionLogic = () => {
        container.addEventListener('click', (event) => {
            const target = event.target;
            // Шукаємо клік саме по кнопці
            if (target.classList.contains('accordion-button')) {
                const collapseElement = target.closest('.accordion-item').querySelector('.accordion-collapse');
                
                // Перемикаємо клас 'show' для анімації CSS
                collapseElement.classList.toggle('show');
            }
        });
    };

    // (d) Функція для завантаження даних з сервера
    const loadData = async () => {
        try {
            const response = await fetch('load.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // (e) Перевірка, чи дані на сервері новіші
            if (data.timestamp > lastTimestamp) {
                console.log('Дані оновлено. Рендеримо...');
                lastTimestamp = data.timestamp; // Оновлюємо час
                renderAccordion(data.items); // Перемальовуємо акордеон
            } else {
                console.log('Дані не змінилися.');
            }
        } catch (error) {
            console.error('Помилка завантаження даних:', error);
            container.innerHTML = '<p>Помилка завантаження. Перевірте консоль.</p>';
        }
    };

    // --- Запуск ---
    loadData(); // (d) Завантажуємо дані при першому відкритті
    attachAccordionLogic(); // (d) Вішаємо обробник кліків
    
    // (e) Організовуємо періодичний контроль змін (кожні 5 секунд)
    setInterval(loadData, 5000); 
});