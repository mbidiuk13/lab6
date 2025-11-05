document.addEventListener('DOMContentLoaded', () => {
    const builder = document.getElementById('accordion-builder');
    const addBtn = document.getElementById('add-item-btn');
    const saveBtn = document.getElementById('save-btn');
    const saveStatus = document.getElementById('save-status');

    let sectionCount = 0;

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

    builder.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-section')) {
            e.target.closest('.builder-section').remove();
        }
    });

    saveBtn.addEventListener('click', async () => {
        const sections = [];
        const sectionElements = builder.querySelectorAll('.builder-section');

        sectionElements.forEach(el => {
            const title = el.querySelector('.section-title').value;
            const content = el.querySelector('.section-content').value;
            
            if (title && content) { 
                sections.push({ title, content });
            }
        });

        saveStatus.textContent = 'Збереження...';
        saveStatus.style.color = 'blue';

        try {
            const response = await fetch('save_accordion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sections)
            });

            if (response.ok) {
                const result = await response.json();
                
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