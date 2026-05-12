# Development Setup Guide

## Структура проекта

```
TaskBoardKursach/
├── backend/
│   ├── TaskBoard.Api/          - ASP.NET Core Web API
│   │   ├── Controllers/        - API endpoints
│   │   ├── Startup.cs         - Конфигурация
│   │   ├── Program.cs         - Entry point
│   │   └── *.json             - Конфиги
│   ├── TaskBoard.Data/         - Entity Framework DbContext
│   ├── TaskBoard.Models/       - Data models
│   └── TaskBoard.Api.csproj   - Project file
│
├── frontend/
│   ├── public/
│   │   ├── index.html         - Главная страница
│   │   ├── login.html         - Страница входа
│   │   ├── app.js             - Основная логика
│   │   ├── api-client.js      - API клиент
│   │   └── styles.css         - Стили
│   ├── src/
│   │   ├── bootstrap.php      - PHP инициализация
│   │   └── config.php         - PHP конфиг
│   └── api/
│       └── proxy.php          - PHP API proxy
│
├── database/
│   └── schema.sql             - PostgreSQL schema
│
├── README.md                  - Основная документация
├── API_DOCUMENTATION.md       - Документация API
├── QUICKSTART.md             - Быстрый старт
├── DEVELOPMENT.md            - Этот файл
├── docker-compose.yml        - Docker конфигурация
├── install.bat / install.sh  - Установка
└── .env.example              - Пример конфигурации
```

## Рекомендуемая среда разработки

### IDE
- **Backend**: Visual Studio 2022 или VS Code
- **Frontend**: VS Code, WebStorm или Sublime Text
- **Database**: pgAdmin 4 или DBeaver

### Extensions (VS Code)
- C# Extension (ms-dotnettools.csharp)
- Prettier (esbenp.prettier-vscode)
- PHP IntelliSense (felixbecker.php-intellisense)
- SQLTools (mtxr.sqltools)

## Workflow разработки

### 1. Backend разработка

```bash
# Перейти в backend
cd backend

# Открыть в IDE
code .
# или
devenv TaskBoard.Api.sln

# Запустить в режиме отладки
dotnet run --project TaskBoard.Api --configuration Debug

# Просмотр логов
dotnet run --project TaskBoard.Api 2>&1 | tee app.log
```

### 2. Frontend разработка

```bash
# Перейти в frontend
cd frontend

# Запустить PHP сервер
php -S localhost:8000 -t public

# Открыть http://localhost:8000 в браузере
```

### 3. Database разработка

```bash
# Подключение к БД
psql -U postgres -d taskboard

# Просмотр таблиц
\dt

# Просмотр структуры таблицы
\d tasks

# Просмотр индексов
\di
```

## Добавление новой функциональности

### Backend (C#)

1. **Добавить модель** в `TaskBoard.Models/`:
```csharp
public class MyEntity
{
    public Guid Id { get; set; }
    // ... properties
}
```

2. **Добавить DbSet** в `TaskBoard.Data/TaskBoardDbContext.cs`:
```csharp
public DbSet<MyEntity> MyEntities { get; set; }
```

3. **Добавить контроллер** в `TaskBoard.Api/Controllers/`:
```csharp
[ApiController]
[Route("api/[controller]")]
public class MyEntitiesController : ControllerBase
{
    // ... CRUD methods
}
```

4. **Запустить** и протестировать

### Frontend (JavaScript)

1. **Добавить метод в ApiClient** в `api-client.js`:
```javascript
async getMyEntities() {
    return this.request('/myentities');
}
```

2. **Добавить UI обработчик** в `app.js`:
```javascript
async function loadMyEntities() {
    const entities = await apiClient.getMyEntities();
    // render UI
}
```

3. **Обновить стили** в `styles.css` если необходимо

### Database

1. **Создать миграцию** (SQL):
```sql
CREATE TABLE my_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- ... columns
);

CREATE INDEX idx_my_entities_column ON my_entities(column);
```

2. **Запустить скрипт**:
```bash
psql -U postgres -d taskboard -f migration.sql
```

## Тестирование

### Backend (C#)
```bash
# Юнит тесты (если будут добавлены)
dotnet test

# Интеграционное тестирование через Swagger
# http://localhost:5000/swagger
```

### Frontend (JavaScript)
```bash
# В консоли браузера
apiClient.getTasks().then(tasks => console.log(tasks));
```

### API (curl)
```bash
# Получить задачи
curl http://localhost:5000/api/tasks

# Создать задачу
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'
```

## Debugging

### Backend
1. Установить точки останова в Visual Studio
2. Запустить в режиме отладки: `dotnet run`
3. Использовать Output window для просмотра логов

### Frontend
1. Открыть Developer Tools (F12)
2. Установить точки останова в Sources tab
3. Использовать Console для отладки

### Database
1. Использовать pgAdmin для просмотра данных
2. Выполнять SQL запросы напрямую в psql

## Common Issues

### "Port already in use"
```bash
# Убить процесс на порту
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### "Cannot connect to database"
```bash
# Проверить статус PostgreSQL
pg_isready

# Проверить credentials в appsettings.json
```

### "CORS error"
- Убедитесь что backend запущен с правильными CORS headers
- Проверьте URL в api-client.js

## Performance Tips

### Backend
- Использовать async/await для IO операций
- Добавить индексы на часто используемые поля
- Профилировать с помощью dotnet-trace

### Frontend
- Минимизировать JS/CSS
- Кэшировать API responses
- Использовать lazy loading

### Database
- Анализировать explain plans
- Архивировать старые данные
- Регулярно обновлять статистику: `ANALYZE;`

## Best Practices

1. **Code Style**
   - Backend: Следовать C# conventions
   - Frontend: Использовать ESLint конфиг
   - Database: Используемые comments для объяснения

2. **Commits**
   - Делать atomic commits
   - Использовать descriptive messages
   - Один feature - один PR

3. **Documentation**
   - Документировать API endpoints
   - Добавлять code comments для complex logic
   - Обновлять README

4. **Testing**
   - Писать unit тесты
   - Тестировать edge cases
   - Проверять error handling

## Version Control

```bash
# Клонирование
git clone <repo-url>
cd TaskBoardKursach

# Создание feature branch
git checkout -b feature/new-feature

# Commit
git add .
git commit -m "Add new feature"

# Push
git push origin feature/new-feature

# Pull Request
# Создать PR на GitHub/GitLab
```

## Deployment

Смотрите README.md для инструкций по развертыванию.
