# Quick Start Guide

## 🚀 Быстрый старт за 5 минут

### Требования
- .NET 6.0+
- PostgreSQL 12+
- PHP 7.4+

### 1️⃣ Установка и запуск PostgreSQL

**Windows (с PostgreSQL установленной):**
```bash
# Откройте Command Prompt и создайте БД
psql -U postgres
CREATE DATABASE taskboard;
\q
```

**Linux/Mac:**
```bash
# Если PostgreSQL установлена
createdb taskboard
```

Или используйте Docker:
```bash
docker run --name taskboard-db -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:14
```

### 2️⃣ Создание схемы БД

```bash
# Windows
psql -U postgres -d taskboard -f database\schema.sql

# Linux/Mac
psql -U postgres -d taskboard -f database/schema.sql
```

### 3️⃣ Запуск Backend (C# API)

```bash
cd backend

# Восстановление зависимостей
dotnet restore

# Запуск
dotnet run --project TaskBoard.Api

# API будет доступен на http://localhost:5000
```

### 4️⃣ Запуск Frontend (JavaScript + PHP)

В другом окне терминала:

```bash
cd frontend

# Запуск PHP встроенного сервера
php -S localhost:8000 -t public

# Откройте браузер на http://localhost:8000
```

## ✅ Проверка

1. Откройте http://localhost:8000 в браузере
2. Вы должны увидеть Dashboard
3. Попробуйте:
   - Создать новую задачу
   - Добавить компанию
   - Просмотреть статистику

## 📚 Основные функции

### Dashboard
- Статистика (всего задач, завершено, компании, команды)
- Недавние задачи

### Tasks
- Список всех задач
- Фильтрация по статусу и приоритету
- Создание новой задачи
- Просмотр деталей

### Companies
- Список компаний
- Создание компании
- Удаление компании
- Выбор активной компании

### Profile
- Информация пользователя
- Логаут

## 🔌 API Examples

### Получить все задачи
```bash
curl http://localhost:5000/api/tasks
```

### Создать новую задачу
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "status": "backlog",
    "companyId": "00000000-0000-0000-0000-000000000000",
    "createdBy": "00000000-0000-0000-0000-000000000000"
  }'
```

### Получить компанию
```bash
curl http://localhost:5000/api/companies/{id}
```

## 🐛 Часто встречаемые проблемы

### "Connection refused" на port 5000
- Убедитесь, что backend запущен
- Проверьте firewall

### PostgreSQL connection error
- Проверьте, запущена ли PostgreSQL
- Проверьте credentials в `appsettings.json`

### PHP "Command not found"
- Убедитесь, что PHP установлен в PATH
- Проверьте: `php -v`

### CORS errors
- Это нормально при работе с localhost
- API настроен на `Access-Control-Allow-Origin: *`

## 📝 Следующие шаги

1. **Аутентификация**: Добавить JWT токены
2. **Авторизация**: Реализовать роли пользователей
3. **Валидация**: Добавить более полную валидацию
4. **Frontend**: Улучшить UI/UX
5. **Testing**: Добавить unit и integration тесты

## 📞 Помощь

Если возникли проблемы:
1. Проверьте логи backend: `dotnet run --project TaskBoard.Api`
2. Проверьте консоль браузера (F12)
3. Убедитесь в наличии интернета для первой загрузки
4. Очистите кэш браузера

## 🎯 Типичный рабочий поток

```
1. Запустить PostgreSQL
2. Запустить Backend (C#)
3. Запустить Frontend (PHP)
4. Открыть http://localhost:8000
5. Начать работать!
```

Приятного использования! 🎉
