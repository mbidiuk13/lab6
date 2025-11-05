<?php

$jsonData = file_get_contents('php://input');

if ($jsonData) {
    $filename = 'accordion.json';
    
    if (file_put_contents($filename, $jsonData) !== false) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Data saved.']);
    } else {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to file. Check permissions.']);
    }
} else {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No data received.']);
}
?>