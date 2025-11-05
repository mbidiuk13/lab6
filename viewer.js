document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');
    
    let currentDataSignature = 0; 

    async function fetchAndUpdate() {
        try {
            const response = await fetch('get_accordion.php?t=' + new Date().getTime()); 
            
            if (!response.ok) {
                container.innerHTML = '<p style="color: red;">Помилка завантаження даних.</p>';
                return;
            }

            const responseObject = await response.json(); 
            
            const newDataSignature = responseObject.timestamp; 
            
            if (newDataSignature !== currentDataSignature) {
                console.log('Виявлено зміни! Оновлюю акордеон...');
                
                currentDataSignature = newDataSignature; 
                
                renderAccordion(responseObject.items); 
            } else {

            }

        } catch (error) {
            console.error('Не вдалося отримати дані:', error);
            container.innerHTML = '<p style="color: red;">Помилка обробки даних.</p>';
        }
    }

    function renderAccordion(data) {
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = '<p>Немає даних для відображення. Додайте їх на сторінці Admin.</p>';
            return;
        }

        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'accordion-item';

            const headerBtn = document.createElement('button');
            headerBtn.className = 'accordion-header';
            headerBtn.textContent = item.title;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'accordion-content';
            
            const contentP = document.createElement('p');
            contentP.textContent = item.content;
            
            contentDiv.appendChild(contentP);
            itemDiv.appendChild(headerBtn);
            itemDiv.appendChild(contentDiv);
            
            container.appendChild(itemDiv);
        });

        addAccordionLogic();
    }

    function addAccordionLogic() {
        const headers = container.querySelectorAll('.accordion-header');

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;

                header.classList.toggle('active');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                
                headers.forEach(otherHeader => {
                    if (otherHeader !== header) { 
                        otherHeader.classList.remove('active');
                        otherHeader.nextElementSibling.style.maxHeight = null;
                    }
                });
            });
        });
    }

    fetchAndUpdate();

    setInterval(fetchAndUpdate, 5000); 
});