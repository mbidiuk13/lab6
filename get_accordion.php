<?php

$filename = 'accordion.json';

header('Content-Type: application/json');

$items = [];
$timestamp = 0;

if (file_exists($filename)) {
    $jsonData = file_get_contents($filename);
    $items = json_decode($jsonData, true);
    
    $timestamp = filemtime($filename);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $items = [];
    }
}

$response = [
    'timestamp' => $timestamp,
    'items' => $items
];

echo json_encode($response);
?>