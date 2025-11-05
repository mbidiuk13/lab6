document.addEventListener('DOMContentLoaded', () => {
    const builderContainer = document.getElementById('accordion-builder');
    const addItemBtn = document.getElementById('add-item-btn');
    const saveBtn = document.getElementById('save-btn');
    const saveStatus = document.getElementById('save-status');

    let itemCounter = 0;

    // (b) Функція для додавання нового елемента в конструктор
    const createBuilderItem = () => {
        itemCounter++;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'builder-item';
        
        itemDiv.innerHTML = `
            <h4>Елемент ${itemCounter}</h4>
            <label for="title-${itemCounter}">Заголовок:</label>
            <input type="text" id="title-${itemCounter}" class="item-title" placeholder="Введіть заголовок">
            
            <label for="content-${itemCounter}" style="margin-top: 10px; display: block;">Вміст:</label>
            <textarea id="content-${itemCounter}" class="item-content" placeholder="Введіть вміст..."></textarea>
        `;
        builderContainer.appendChild(itemDiv);
    };

    // (c) Функція для збереження даних на сервері
    const saveAccordion = async () => {
        saveStatus.textContent = 'Збереження...';
        const items = [];
        const builderItems = document.querySelectorAll('.builder-item');

        // Збираємо дані з усіх полів
        builderItems.forEach(item => {
            const title = item.querySelector('.item-title').value;
            const content = item.querySelector('.item-content').value;
            if (title && content) {
                items.push({ title, content });
            }
        });

        // (c) Асинхронний запит за допомогою Fetch та PHP
        try {
            const response = await fetch('save.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(items), // Перетворюємо масив об'єктів в JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                saveStatus.textContent = 'Успішно збережено!';
                saveStatus.style.color = 'green';
            } else {
                saveStatus.textContent = 'Помилка збереження на сервері.';
                saveStatus.style.color = 'red';
            }
        } catch (error) {
            console.error('Помилка Fetch:', error);
            saveStatus.textContent = 'Помилка з\'єднання. Перевірте консоль.';
            saveStatus.style.color = 'red';
        }
    };

    // Прив'язка подій
    addItemBtn.addEventListener('click', createBuilderItem);
    saveBtn.addEventListener('click', saveAccordion);

    // Створюємо перший елемент при завантаженні
    createBuilderItem();
});