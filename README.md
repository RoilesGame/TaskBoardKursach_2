# TaskBoard Manager

Современное веб-приложение для управления задачами и проектами. Комплексная система с frontend на JavaScript/PHP/CSS и backend на C# ASP.NET Core.

## 🏗️ Архитектура

```
TaskBoard/
├── backend/              (C# ASP.NET Core Web API)
│   ├── TaskBoard.Api/         - API Controllers
│   ├── TaskBoard.Data/        - EF Core DbContext
│   ├── TaskBoard.Models/      - Data Models
│   └── TaskBoard.sln          - Solution file
│
├── frontend/             (PHP + JavaScript + CSS)
│   ├── public/                - Static files (HTML, JS, CSS)
│   ├── src/                   - PHP source files
│   └── api/                   - PHP API proxy
│
└── database/
    └── schema.sql             - PostgreSQL schema
```

## 📋 Функциональность

### Основные возможности:
- ✅ Управление задачами (создание, редактирование, удаление)
- ✅ Управление компаниями
- ✅ Управление командами
- ✅ Комментарии к задачам
- ✅ Фильтрация и поиск
- ✅ Отслеживание статуса задач
- ✅ Приоритеты задач
- ✅ Дашборд с статистикой

## 🚀 Установка и запуск

### Требования:
- .NET 6.0+
- PostgreSQL 12+
- PHP 7.4+
- Node.js (опционально, для фронтенда)

### Backend (C#)

1. Установите .NET SDK с https://dotnet.microsoft.com/

2. Перейдите в папку backend:
   ```bash
   cd backend
   ```

3. Восстановите зависимости:
   ```bash
   dotnet restore
   ```

4. Обновите строку подключения в `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=taskboard;Username=postgres;Password=your_password;Port=5432"
   }
   ```

5. Создайте БД и примените миграции:
   ```bash
   dotnet ef database update
   ```

6. Запустите API:
   ```bash
   dotnet run --project TaskBoard.Api
   ```

API будет доступен на `http://localhost:5000`

### Frontend (PHP + JavaScript)

1. Убедитесь, что у вас установлен PHP:
   ```bash
   php -v
   ```

2. Запустите встроенный PHP сервер:
   ```bash
   php -S localhost:8000 -t frontend/public
   ```

3. Откройте браузер на `http://localhost:8000`

### База данных

1. Создайте БД PostgreSQL:
   ```bash
   psql -U postgres
   CREATE DATABASE taskboard;
   ```

2. Примените схему:
   ```bash
   psql -U postgres -d taskboard -f database/schema.sql
   ```

## 📚 API Endpoints

### Tasks
- `GET /api/tasks` - Получить все задачи
- `GET /api/tasks/{id}` - Получить задачу
- `POST /api/tasks` - Создать задачу
- `PUT /api/tasks/{id}` - Обновить задачу
- `DELETE /api/tasks/{id}` - Удалить задачу

### Companies
- `GET /api/companies` - Получить все компании
- `GET /api/companies/{id}` - Получить компанию
- `POST /api/companies` - Создать компанию
- `PUT /api/companies/{id}` - Обновить компанию
- `DELETE /api/companies/{id}` - Удалить компанию

### Teams
- `GET /api/teams` - Получить все команды
- `GET /api/teams/{id}` - Получить команду
- `POST /api/teams` - Создать команду
- `PUT /api/teams/{id}` - Обновить команду
- `DELETE /api/teams/{id}` - Удалить команду

### Users
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/{id}` - Получить пользователя
- `POST /api/users` - Создать пользователя
- `PUT /api/users/{id}` - Обновить пользователя
- `DELETE /api/users/{id}` - Удалить пользователя

### Comments
- `GET /api/comments?taskId={taskId}` - Получить комментарии к задаче
- `POST /api/comments` - Создать комментарий
- `DELETE /api/comments/{id}` - Удалить комментарий

## 🎨 Frontend структура

### HTML (index.html)
- Навигационная панель
- Динамическая загрузка контента
- Модальные окна для форм

### JavaScript (app.js)
- Управление представлениями
- Обработка событий
- Динамическое построение UI

### JavaScript (api-client.js)
- Клиент для работы с API
- Методы для CRUD операций
- Обработка ошибок

### CSS (styles.css)
- Адаптивный дизайн
- Темы и стили компонентов
- Мобильная оптимизация

## 🔧 Стек технологий

### Backend
- **Фреймворк**: ASP.NET Core 6.0
- **ORM**: Entity Framework Core 6.0
- **БД**: PostgreSQL
- **Язык**: C#

### Frontend
- **Язык разметки**: HTML5
- **Язык скриптов**: JavaScript ES6+
- **Стили**: CSS3
- **Backend язык**: PHP 7.4+
- **Proxy**: PHP API Proxy

### Database
- **СУБД**: PostgreSQL 12+
- **UUID**: pgcrypto extension

## 📝 Примеры использования

### Создание новой задачи (JavaScript)
```javascript
const task = {
    title: 'Новая задача',
    description: 'Описание задачи',
    status: 'backlog',
    priority: 'high',
    companyId: 'company-uuid',
    createdBy: 'user-uuid'
};

await apiClient.createTask(task);
```

### Получение всех задач (JavaScript)
```javascript
const tasks = await apiClient.getTasks();
console.log(tasks);
```

### Обновление задачи (C#)
```csharp
var task = await _context.Tasks.FindAsync(taskId);
task.Status = "in_progress";
task.UpdatedAt = DateTime.UtcNow;
await _context.SaveChangesAsync();
```

## 🔐 Безопасность

- JWT tokens для авторизации (готово к добавлению)
- CORS конфигурация
- SQL injection защита (EF Core parameterized queries)
- XSS защита (HTML escaping в PHP)

## 📦 Развертывание

### Deployment на Linux
```bash
# Build backend
cd backend
dotnet publish -c Release

# Copy to server
scp -r bin/Release/net6.0/publish user@server:/app/taskboard
```

### Docker (опционально)
Можно добавить Dockerfile для контейнеризации.

## 🐛 Известные проблемы

- Аутентификация требует реализации
- Авторизация по ролям требует реализации
- Websockets для real-time updates требуют реализации

## 📚 Дальнейшее развитие

- [ ] JWT аутентификация
- [ ] WebSocket поддержка
- [ ] Notifications система
- [ ] File attachments
- [ ] Activity logging
- [ ] Advanced reporting
- [ ] Mobile приложение
- [ ] Календарь задач

## 💬 Поддержка

Для вопросов и предложений, пожалуйста, создайте issue в репозитории.

## 📄 Лицензия

MIT License - см. файл LICENSE

---

**Версия**: 1.0.0  
**Последнее обновление**: 2024
