<?php

/**
 * Frontend Configuration File
 */

return [
    'app_name' => 'TaskBoard Manager',
    'app_version' => '1.0.0',

    'api' => [
        'base_url' => getenv('API_URL') ?: 'http://localhost:5000/api',
        'timeout' => 30,
    ],

    'database' => [
        'host' => getenv('DB_HOST') ?: 'localhost',
        'port' => getenv('DB_PORT') ?: '5432',
        'name' => getenv('DB_NAME') ?: 'taskboard',
        'user' => getenv('DB_USER') ?: 'postgres',
        'password' => getenv('DB_PASS') ?: 'password',
    ],

    'auth' => [
        'session_timeout' => 3600,
        'remember_me_duration' => 604800, // 7 days
    ],

    'pagination' => [
        'items_per_page' => 20,
    ],
];
