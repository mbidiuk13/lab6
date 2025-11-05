<?php
// (d, e) Скрипт для завантаження даних з сервера

$filename = 'accordion.json';

// Встановлюємо заголовок, що відповідь буде у форматі JSON
header('Content-Type: application/json');

$items = [];
$timestamp = 0;

// Перевіряємо, чи існує файл
if (file_exists($filename)) {
    // Читаємо вміст файлу
    $jsonData = file_get_contents($filename);
    // Декодуємо JSON в масив PHP
    $items = json_decode($jsonData, true);
    
    // (e) Отримуємо час останньої модифікації файлу
    // Це потрібно для контролю змін
    $timestamp = filemtime($filename);
    
    // Перевірка, чи JSON був валідним
    if (json_last_error() !== JSON_ERROR_NONE) {
        $items = []; // Скидаємо, якщо JSON пошкоджений
    }
}

// Формуємо фінальну відповідь
$response = [
    'timestamp' => $timestamp,
    'items' => $items
];

// Відправляємо JSON-відповідь клієнту
echo json_encode($response);
?>