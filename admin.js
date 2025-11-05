document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо елементи з вашого HTML
    const builder = document.getElementById('accordion-builder');
    const addBtn = document.getElementById('add-item-btn'); // Ваш ID
    const saveBtn = document.getElementById('save-btn');     // Ваш ID
    const saveStatus = document.getElementById('save-status');

    let sectionCount = 0;

    // 1. Додавання нової секції
    addBtn.addEventListener('click', () => {
        sectionCount++;
        const sectionHTML = `
            <div class="builder-section" style="border: 1px solid #ccc; padding: 10px; margin-top: 10px; background: #f9f9f9;">
                <h4>Секція ${sectionCount}</h4>
                <input type="text" class="section-title" placeholder="Заголовок" style="width: 100%; padding: 8px; margin-bottom: 5px; box-sizing: border-box;">
                <textarea class="section-content" placeholder="Вміст" style="width: 100%; padding: 8px; min-height: 80px; box-sizing: border-box;"></textarea>
                <button class="remove-section" style="color: red; background: none; border: none; cursor: pointer; padding: 5px;">Видалити</button>
            </div>
        `;
        builder.insertAdjacentHTML('beforeend', sectionHTML);
    });

    // 2. Видалення секції (через делегування подій)
    builder.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-section')) {
            // .closest() знаходить найближчого батьківського елемента
            e.target.closest('.builder-section').remove();
        }
    });

    // 3. Збереження акордеону
    saveBtn.addEventListener('click', async () => {
        const sections = [];
        const sectionElements = builder.querySelectorAll('.builder-section');

        // Збираємо дані з усіх секцій
        sectionElements.forEach(el => {
            const title = el.querySelector('.section-title').value;
            const content = el.querySelector('.section-content').value;
            
            // Додаємо, тільки якщо обидва поля заповнені
            if (title && content) { 
                sections.push({ title, content });
            }
        });

        saveStatus.textContent = 'Збереження...';
        saveStatus.style.color = 'blue';

        try {
            // Відправляємо асинхронний запит на PHP скрипт
            const response = await fetch('save_accordion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sections) // Перетворюємо наш масив у JSON-рядок
            });

            if (response.ok) {
                const result = await response.json(); // Отримуємо відповідь від PHP
                
                if (result.status === 'success') {
                    saveStatus.textContent = 'Збережено успішно!';
                    saveStatus.style.color = 'green';
                } else {
                    saveStatus.textContent = 'Помилка збереження: ' + (result.message || 'Невідома помилка');
                    saveStatus.style.color = 'red';
                }
            } else {
                saveStatus.textContent = 'Помилка сервера. (Код: ' + response.status + ')';
                saveStatus.style.color = 'red';
            }
        } catch (error) {
            saveStatus.textContent = 'Помилка мережі. Перевірте консоль.';
            saveStatus.style.color = 'red';
            console.error('Fetch error:', error);
        }
    });
});