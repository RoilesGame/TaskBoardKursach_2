<?php

/**
 * Frontend PHP Bootstrap
 * Handles authentication, session management, and template rendering
 */

session_start();

// Database configuration
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'taskboard');
define('DB_USER', 'postgres');
define('DB_PASS', 'your_password');

// API configuration
define('API_URL', 'http://localhost:5000/api');

// Create connection
try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
    $db = new PDO($dsn, DB_USER, DB_PASS);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection error: " . $e->getMessage());
}

// Helper functions
function isAuthenticated()
{
    return isset($_SESSION['user_id']);
}

function requireAuth()
{
    if (!isAuthenticated()) {
        header('Location: /login.php');
        exit();
    }
}

function getCurrentUser()
{
    if (isAuthenticated()) {
        global $db;
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    return null;
}

function apiCall($method, $endpoint, $data = null)
{
    $url = API_URL . $endpoint;

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $_SESSION['token'] ?? ''
    ]);

    if ($data && in_array($method, ['POST', 'PUT'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'status' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

function escape($str)
{
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
