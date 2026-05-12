# API Documentation

## Overview
TaskBoard API - RESTful веб-API для управления задачами, компаниями, командами и пользователями.

**Base URL**: `http://localhost:5000/api`

## Аутентификация

На данный момент API открыт. В будущих версиях будет добавлена аутентификация через JWT токены.

## Response Format

Все ответы в формате JSON.

### Success Response
```json
{
  "id": "uuid",
  "status": "success",
  "data": {}
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Endpoints

### Tasks

#### Get All Tasks
```
GET /tasks
```

Query Parameters:
- `companyId` (optional): UUID компании
- `teamId` (optional): UUID команды
- `status` (optional): backlog, in_progress, review, done
- `priority` (optional): low, medium, high, critical

Response:
```json
[
  {
    "id": "uuid",
    "companyId": "uuid",
    "teamId": "uuid",
    "title": "Task Title",
    "description": "Task Description",
    "status": "backlog",
    "priority": "medium",
    "assigneeId": "uuid",
    "createdBy": "uuid",
    "dueDate": "2024-12-31",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Task by ID
```
GET /tasks/{id}
```

Response: Task object

#### Create Task
```
POST /tasks
```

Request Body:
```json
{
  "companyId": "uuid",
  "teamId": "uuid",
  "title": "New Task",
  "description": "Description",
  "priority": "medium",
  "assigneeId": "uuid",
  "createdBy": "uuid",
  "dueDate": "2024-12-31"
}
```

Response: Task object with generated ID

#### Update Task
```
PUT /tasks/{id}
```

Request Body:
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "in_progress",
  "priority": "high",
  "assigneeId": "uuid",
  "dueDate": "2024-12-31"
}
```

Response: HTTP 204 No Content

#### Delete Task
```
DELETE /tasks/{id}
```

Response: HTTP 204 No Content

---

### Companies

#### Get All Companies
```
GET /companies
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "Company Name",
    "description": "Description",
    "logoUrl": "https://example.com/logo.png",
    "ownerId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Company by ID
```
GET /companies/{id}
```

Response: Company object

#### Create Company
```
POST /companies
```

Request Body:
```json
{
  "name": "New Company",
  "description": "Description",
  "logoUrl": "https://example.com/logo.png",
  "ownerId": "uuid"
}
```

Response: Company object with generated ID

#### Update Company
```
PUT /companies/{id}
```

Request Body:
```json
{
  "name": "Updated Name",
  "description": "Updated Description",
  "logoUrl": "https://example.com/logo.png"
}
```

Response: HTTP 204 No Content

#### Delete Company
```
DELETE /companies/{id}
```

Response: HTTP 204 No Content

---

### Users

#### Get All Users
```
GET /users
```

Response:
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Full Name",
    "avatarUrl": "https://example.com/avatar.png",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get User by ID
```
GET /users/{id}
```

Response: User object

#### Create User
```
POST /users
```

Request Body:
```json
{
  "email": "user@example.com",
  "passwordHash": "hashed_password",
  "fullName": "Full Name",
  "avatarUrl": "https://example.com/avatar.png"
}
```

Response: User object with generated ID

#### Update User
```
PUT /users/{id}
```

Request Body:
```json
{
  "fullName": "Updated Name",
  "avatarUrl": "https://example.com/avatar.png"
}
```

Response: HTTP 204 No Content

#### Delete User
```
DELETE /users/{id}
```

Response: HTTP 204 No Content

---

### Teams

#### Get All Teams
```
GET /teams
```

Query Parameters:
- `companyId` (optional): UUID компании

Response:
```json
[
  {
    "id": "uuid",
    "companyId": "uuid",
    "name": "Team Name",
    "description": "Description",
    "createdBy": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Team by ID
```
GET /teams/{id}
```

Response: Team object

#### Create Team
```
POST /teams
```

Request Body:
```json
{
  "companyId": "uuid",
  "name": "New Team",
  "description": "Description",
  "createdBy": "uuid"
}
```

Response: Team object with generated ID

#### Update Team
```
PUT /teams/{id}
```

Request Body:
```json
{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

Response: HTTP 204 No Content

#### Delete Team
```
DELETE /teams/{id}
```

Response: HTTP 204 No Content

---

### Comments

#### Get Task Comments
```
GET /comments?taskId={taskId}
```

Query Parameters:
- `taskId` (required): UUID задачи

Response:
```json
[
  {
    "id": "uuid",
    "taskId": "uuid",
    "authorId": "uuid",
    "content": "Comment text",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Comment
```
POST /comments
```

Request Body:
```json
{
  "taskId": "uuid",
  "authorId": "uuid",
  "content": "Comment text"
}
```

Response: Comment object with generated ID

#### Delete Comment
```
DELETE /comments/{id}
```

Response: HTTP 204 No Content

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful request with no content |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Error Examples

### Invalid Request
```
GET /tasks/invalid-uuid

Response:
HTTP 400
{
  "error": "Invalid UUID format",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Resource Not Found
```
GET /tasks/00000000-0000-0000-0000-000000000000

Response:
HTTP 404
{
  "error": "Task not found"
}
```

---

## Rate Limiting

На текущий момент rate limiting не применяется. Будет добавлено в будущих версиях.

## CORS

API поддерживает CORS для всех источников:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Pagination

На текущий момент не реализована. Планируется добавить в v1.1.

## Versioning

API версия в URL пока не используется. В будущем будет `/api/v1/`.

## Changelog

### v1.0.0
- Базовые CRUD операции для Tasks, Companies, Teams, Users
- Комментарии к задачам
- Фильтрация по статусу и приоритету
