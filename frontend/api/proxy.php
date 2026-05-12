<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
define('API_BASE_URL', 'http://localhost:5000/api');

class ApiProxy
{
    private $baseUrl;

    public function __construct($baseUrl = API_BASE_URL)
    {
        $this->baseUrl = $baseUrl;
    }

    public function request($method, $endpoint, $data = null)
    {
        $url = $this->baseUrl . $endpoint;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
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
}

// Route handling
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/proxy.php', '', $path);

if (empty($path)) {
    $path = '/';
}

// Parse query string
$query = $_GET;
$body = null;

if (in_array($method, ['POST', 'PUT'])) {
    $body = json_decode(file_get_contents('php://input'), true);
}

$proxy = new ApiProxy();

// Route handling
switch (true) {
    case strpos($path, '/tasks') === 0:
        handleTasks($proxy, $method, $path, $body, $query);
        break;

    case strpos($path, '/companies') === 0:
        handleCompanies($proxy, $method, $path, $body, $query);
        break;

    case strpos($path, '/users') === 0:
        handleUsers($proxy, $method, $path, $body, $query);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        break;
}

function handleTasks($proxy, $method, $path, $body, $query)
{
    $id = extractId($path, '/tasks');

    if ($id) {
        // Single task
        if ($method == 'GET') {
            $result = $proxy->request('GET', '/tasks/' . $id);
        } elseif ($method == 'PUT') {
            $result = $proxy->request('PUT', '/tasks/' . $id, $body);
        } elseif ($method == 'DELETE') {
            $result = $proxy->request('DELETE', '/tasks/' . $id);
        }
    } else {
        // All tasks with filters
        $endpoint = '/tasks';
        if (!empty($query)) {
            $endpoint .= '?' . http_build_query($query);
        }

        if ($method == 'GET') {
            $result = $proxy->request('GET', $endpoint);
        } elseif ($method == 'POST') {
            $result = $proxy->request('POST', '/tasks', $body);
        }
    }

    http_response_code($result['status']);
    echo json_encode($result['data']);
}

function handleCompanies($proxy, $method, $path, $body, $query)
{
    $id = extractId($path, '/companies');

    if ($id) {
        if ($method == 'GET') {
            $result = $proxy->request('GET', '/companies/' . $id);
        } elseif ($method == 'PUT') {
            $result = $proxy->request('PUT', '/companies/' . $id, $body);
        } elseif ($method == 'DELETE') {
            $result = $proxy->request('DELETE', '/companies/' . $id);
        }
    } else {
        if ($method == 'GET') {
            $result = $proxy->request('GET', '/companies');
        } elseif ($method == 'POST') {
            $result = $proxy->request('POST', '/companies', $body);
        }
    }

    http_response_code($result['status']);
    echo json_encode($result['data']);
}

function handleUsers($proxy, $method, $path, $body, $query)
{
    $id = extractId($path, '/users');

    if ($id && $method == 'GET') {
        $result = $proxy->request('GET', '/users/' . $id);
    } else {
        $result = $proxy->request('GET', '/users');
    }

    http_response_code($result['status']);
    echo json_encode($result['data']);
}

function extractId($path, $prefix)
{
    $path = str_replace($prefix, '', $path);
    $parts = array_filter(explode('/', $path));
    return !empty($parts) ? reset($parts) : null;
}
