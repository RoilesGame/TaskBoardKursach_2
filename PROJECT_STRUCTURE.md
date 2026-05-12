# Project Structure - Complete Overview

## 📁 Полная структура проекта TaskBoard Manager

```
TaskBoardKursach/
│
├── 📄 README.md                           # Основная документация
├── 📄 QUICKSTART.md                       # Быстрый старт (5 минут)
├── 📄 DEVELOPMENT.md                      # Гайд разработчика
├── 📄 API_DOCUMENTATION.md                # Полная документация API
├── 📄 package.json                        # NPM конфигурация
├── 📄 .env.example                        # Пример переменных окружения
├── 📄 .gitignore                          # Git ignore правила
├── 📄 docker-compose.yml                  # Docker Compose конфигурация
├── 📄 install.bat                         # Windows установка
├── 📄 install.sh                          # Linux/Mac установка
│
├── 📦 backend/                            # C# ASP.NET Core Backend
│   ├── TaskBoard.Api/                     # Web API проект
│   │   ├── Controllers/                   # API контроллеры
│   │   │   ├── TasksController.cs         # CRUD для задач
│   │   │   ├── CompaniesController.cs     # CRUD для компаний
│   │   │   ├── UsersController.cs         # CRUD для пользователей
│   │   │   ├── TeamsController.cs         # CRUD для команд
│   │   │   └── CommentsController.cs      # CRUD для комментариев
│   │   ├── Extensions/                    # Расширения
│   │   │   └── DatabaseExtensions.cs      # Работа с БД
│   │   ├── Helpers/                       # Вспомогательные классы
│   │   │   └── HelperClasses.cs           # Утилиты
│   │   ├── Startup.cs                     # Конфигурация сервиса
│   │   ├── Program.cs                     # Entry point приложения
│   │   ├── TaskBoard.Api.csproj           # Project file
│   │   ├── appsettings.json               # Production конфиг
│   │   ├── appsettings.Development.json   # Development конфиг
│   │   └── project.json                   # Project metadata
│   │
│   ├── TaskBoard.Models/                  # Data Models
│   │   ├── User.cs                        # Модель пользователя
│   │   ├── Company.cs                     # Модель компании
│   │   ├── Team.cs                        # Модель команды
│   │   ├── Task.cs                        # Модель задачи
│   │   ├── TaskComment.cs                 # Модель комментария
│   │   └── TaskBoard.Models.csproj        # Project file
│   │
│   ├── TaskBoard.Data/                    # Entity Framework Core
│   │   ├── TaskBoardDbContext.cs          # DbContext класс
│   │   ├── MigrationHelper.cs             # Миграции помощник
│   │   └── TaskBoard.Data.csproj          # Project file
│   │
│   ├── Dockerfile                         # Docker контейнер backend
│   └── TaskBoard.sln                      # Visual Studio solution
│
├── 📦 frontend/                           # JavaScript + PHP Frontend
│   ├── public/                            # Статические файлы
│   │   ├── index.html                     # Главная страница (Dashboard)
│   │   ├── login.html                     # Страница входа
│   │   ├── app.js                         # Основная логика приложения
│   │   ├── api-client.js                  # HTTP клиент для API
│   │   └── styles.css                     # Глобальные стили
│   │
│   ├── src/                               # PHP исходники
│   │   ├── bootstrap.php                  # PHP инициализация
│   │   └── config.php                     # PHP конфигурация
│   │
│   └── api/                               # PHP API Proxy
│       └── proxy.php                      # Proxy для API запросов
│
└── 📦 database/                           # Database Schema
    └── schema.sql                         # PostgreSQL DDL скрипты
```

## 📊 Статистика проекта

### Backend (C#)
- **Контроллеры**: 5 (Tasks, Companies, Users, Teams, Comments)
- **Модели**: 5 (User, Company, Team, Task, TaskComment)
- **DbContext**: 1 с автоматическими индексами
- **Миграции**: Полная поддержка
- **API endpoints**: 25+

### Frontend (JavaScript/PHP/CSS)
- **HTML страницы**: 2 (Dashboard, Login)
- **JavaScript модули**: 3 (app.js, api-client.js)
- **PHP файлы**: 2 (bootstrap, config)
- **CSS**: Адаптивный, modern design
- **Компоненты**: Dashboard, Tasks, Companies, Teams, Profile

### Database
- **Таблицы**: 7 (users, companies, company_members, teams, team_members, tasks, task_comments)
- **Индексы**: 14 оптимизированных индексов
- **Связи**: Полная поддержка CASCADE/RESTRICT
- **Расширения**: pgcrypto для UUID

## 🔧 Технологический стек

### Backend
- **.NET**: 6.0
- **Framework**: ASP.NET Core
- **ORM**: Entity Framework Core 6.0
- **Database Driver**: Npgsql (PostgreSQL)
- **Documentation**: Swagger/OpenAPI

### Frontend
- **HTML**: HTML5
- **JavaScript**: ES6+ (Vanilla JS)
- **CSS**: CSS3 с Flexbox/Grid
- **PHP**: 7.4+
- **HTTP Client**: Fetch API

### Database
- **DBMS**: PostgreSQL 12+
- **Extensions**: pgcrypto
- **Indexing**: B-Tree индексы

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Scripts**: Batch/Bash

## 📚 Файлы конфигурации

| Файл | Назначение |
|------|-----------|
| appsettings.json | Production конфиг backend |
| appsettings.Development.json | Development конфиг backend |
| TaskBoard.Api.csproj | .NET проект конфиг |
| config.php | PHP конфиг фронтенда |
| docker-compose.yml | Docker сервисы |
| .env.example | Переменные окружения |
| package.json | NPM метаданные |

## 🚀 Запуск проекта

```bash
# 1. Установка
bash install.sh  # Linux/Mac
install.bat      # Windows

# 2. Backend
cd backend
dotnet run --project TaskBoard.Api

# 3. Frontend (новый терминал)
cd frontend
php -S localhost:8000 -t public

# 4. Откройте браузер
http://localhost:8000
```

## 📝 Основные API endpoints

### Tasks API
```
GET    /api/tasks                    # Все задачи
GET    /api/tasks/{id}               # Одна задача
POST   /api/tasks                    # Создать
PUT    /api/tasks/{id}               # Обновить
DELETE /api/tasks/{id}               # Удалить
```

### Companies API
```
GET    /api/companies                # Все компании
GET    /api/companies/{id}           # Одна компания
POST   /api/companies                # Создать
PUT    /api/companies/{id}           # Обновить
DELETE /api/companies/{id}           # Удалить
```

### Users, Teams, Comments
- Подобная структура для всех ресурсов
- Полная поддержка CRUD операций

## 💡 Ключевые особенности

✅ **Готовая структура** - Сразу начать разработку
✅ **Полная документация** - README, API Docs, Quick Start
✅ **Адаптивный дизайн** - Работает на всех устройствах
✅ **Docker поддержка** - Легкое развертывание
✅ **Безопасность** - CORS, SQL Injection защита
✅ **Масштабируемость** - Модульная архитектура
✅ **Современный стек** - .NET 6, ES6, PostgreSQL 12+

## 📦 Зависимости

### C# NuGet Packages
- Microsoft.EntityFrameworkCore
- Npgsql.EntityFrameworkCore.PostgreSQL
- Swashbuckle.AspNetCore (Swagger)

### PHP Extensions
- PDO PostgreSQL

### System Requirements
- .NET 6.0 SDK
- PostgreSQL 12+
- PHP 7.4+
- Node.js (опционально)

## 🔐 Безопасность

- SQL Injection защита через параметризованные запросы
- XSS защита через HTML escaping
- CORS конфигурация
- Готовность к JWT реализации

## 📈 Возможности расширения

- [ ] JWT/OAuth аутентификация
- [ ] WebSocket для real-time updates
- [ ] Уведомления и напоминания
- [ ] Прикрепление файлов
- [ ] Логирование активности
- [ ] Advanced reporting
- [ ] Mobile приложение
- [ ] CI/CD pipeline

## 📞 Поддержка и контакты

Для вопросов и сообщений об ошибках создавайте issues в репозитории.

---

**Версия**: 1.0.0  
**Последнее обновление**: Май 2024  
**Лицензия**: MIT
