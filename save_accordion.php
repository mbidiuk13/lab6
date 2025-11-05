<?php
// (c) Скрипт для збереження даних на сервері

// Отримуємо JSON-дані з тіла POST-запиту
$jsonData = file_get_contents('php://input');

// Перевіряємо, чи дані отримано
if ($jsonData) {
    // Назва файлу для збереження
    $filename = 'accordion.json';
    
    // Записуємо дані у файл
    // file_put_contents поверне false у разі помилки (напр. немає прав)
    if (file_put_contents($filename, $jsonData) !== false) {
        // Успіх
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Data saved.']);
    } else {
        // Помилка запису
        header('Content-Type: application/json');
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to file. Check permissions.']);
    }
} else {
    // Дані не надійшли
    header('Content-Type: application/json');
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'No data received.']);
}
?>