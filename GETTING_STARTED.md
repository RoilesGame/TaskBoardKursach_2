# 🎯 GETTING STARTED - TaskBoard Manager

## First Time Setup (Первый запуск)

Следуйте этим шагам для запуска приложения на вашем компьютере.

## ⚙️ Шаг 1: Установка необходимого ПО

### Windows

#### 1.1 Установить .NET 6.0 SDK
```
Скачать: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
Установить: dotnet-sdk-6.0.xxx-win-x64.exe
Проверить: Откройте Command Prompt и выполните:
  dotnet --version
```

#### 1.2 Установить PostgreSQL 14
```
Скачать: https://www.postgresql.org/download/windows/
Установить: postgresql-14-x64.exe
При установке:
  - Username: postgres
  - Password: password (или ваш пароль)
  - Port: 5432
```

#### 1.3 Установить PHP 8.1
```
Скачать: https://windows.php.net/download/
Распаковать в: C:\php
Добавить в PATH:
  - Открыть System Properties → Environment Variables
  - Добавить: C:\php
Проверить: Откройте Command Prompt:
  php -v
```

### Linux/Mac

```bash
# macOS (using Homebrew)
brew install dotnet postgresql php

# Ubuntu/Debian
sudo apt install dotnet-sdk-6.0 postgresql postgresql-contrib php

# Verify
dotnet --version
psql --version
php -v
```

## 📦 Шаг 2: Подготовка базы данных

### Создание базы данных

#### Windows (Command Prompt):
```cmd
cd TaskBoardKursach
psql -U postgres -c "CREATE DATABASE taskboard;"
psql -U postgres -d taskboard -f database\schema.sql
```

#### Linux/Mac:
```bash
cd TaskBoardKursach
psql -U postgres -c "CREATE DATABASE taskboard;"
psql -U postgres -d taskboard -f database/schema.sql
```

Вы должны увидеть вывод без ошибок.

## 🚀 Шаг 3: Запуск Backend (C# API)

### Terminal 1 - Backend

```bash
cd TaskBoardKursach\backend
# или на Linux/Mac:
cd TaskBoardKursach/backend

dotnet restore
dotnet run --project TaskBoard.Api
```

**Ожидаемый вывод:**
```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to exit.
```

**Если вы видите ошибку:**
- ❌ "Cannot connect to database" → Проверьте PostgreSQL и credentials
- ❌ "Port 5000 already in use" → Использует другой порт или закройте процесс
- ❌ "Missing packages" → Выполните `dotnet restore`

## 🎨 Шаг 4: Запуск Frontend (PHP Server)

### Terminal 2 - Frontend (откройте новый терминал!)

```bash
cd TaskBoardKursach\frontend
# или на Linux/Mac:
cd TaskBoardKursach/frontend

php -S localhost:8000 -t public
```

**Ожидаемый вывод:**
```
[date time] PHP server started at localhost:8000
Listening on http://localhost:8000
```

## 🌐 Шаг 5: Открыть приложение

1. Откройте браузер
2. Перейдите на: **http://localhost:8000**
3. Вы должны увидеть **TaskBoard Dashboard**

## ✅ Проверка работы

### Dashboard
- [ ] Видны статистика и графики
- [ ] Показан список задач

### Создание новой задачи
1. Нажмите кнопку "+ New Task"
2. Заполните форму
3. Нажмите "Create Task"
4. Задача должна появиться в списке

### Работа с компаниями
1. Нажмите на "Companies" в меню
2. Нажмите "+ New Company"
3. Введите имя компании
4. Компания должна появиться в списке

## 🔍 Проверка API

Откройте терминал и выполните:

```bash
# Получить все задачи
curl http://localhost:5000/api/tasks

# Получить все компании
curl http://localhost:5000/api/companies

# Создать новую задачу
curl -X POST http://localhost:5000/api/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Task\",\"companyId\":\"00000000-0000-0000-0000-000000000000\",\"createdBy\":\"00000000-0000-0000-0000-000000000000\"}"
```

Вы должны получить JSON ответы.

## 📊 Тестовые данные

База данных создана пустой. Вы можете добавить данные через UI или через API.

Пример добавления через frontend:
1. Перейдите на Companies
2. Нажмите "+ New Company"
3. Введите: "My First Company"
4. Нажмите создать

## 🛑 Остановка приложения

### Остановить Backend
Нажмите `Ctrl+C` в Terminal 1

### Остановить Frontend  
Нажмите `Ctrl+C` в Terminal 2

## 🐛 Решение проблем

### Проблема: "Connection refused" для API

**Причина**: Backend не запущен
```
✅ Решение: Убедитесь что Terminal 1 с backend активна и показывает:
   "Now listening on: http://localhost:5000"
```

### Проблема: "Access denied" для БД

**Причина**: Неправильный пароль PostgreSQL
```
✅ Решение: 
   1. Запомните пароль который вы установили при установке PostgreSQL
   2. Обновите в файле: backend/TaskBoard.Api/appsettings.json
      "DefaultConnection": "Host=localhost;Database=taskboard;Username=postgres;Password=YOUR_PASSWORD;Port=5432"
   3. Перезапустите backend
```

### Проблема: "Port already in use"

**Причина**: Процесс уже использует порт
```
✅ Решение:
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -i :5000
   kill -9 <PID>
```

### Проблема: "PHP command not found"

**Причина**: PHP не установлена или не в PATH
```
✅ Решение:
   1. Установите PHP
   2. Добавьте PHP путь в PATH
   3. Проверьте: php -v
```

### Проблема: Приложение медленно работает

**Причины и решения**:
- Проверьте подключение к интернету
- Закройте другие приложения
- Очистите кэш браузера: Ctrl+Shift+Del
- Перезагрузите страницу: F5

## 📚 Следующие шаги

После успешного запуска:

1. **Ознакомьтесь с документацией**
   - Прочитайте README.md
   - Изучите API_DOCUMENTATION.md
   - Смотрите примеры в коде

2. **Добавьте данные**
   - Создайте компании
   - Создайте команды
   - Добавьте задачи

3. **Тестируйте функционал**
   - Создание/редактирование задач
   - Фильтрация и поиск
   - Статистика на Dashboard

4. **Начните разработку**
   - Изучите код в backend/ и frontend/
   - Добавьте новые функции
   - Расширьте API

## 💡 Советы

### Для разработки
- Используйте VS Code для редактирования
- Используйте pgAdmin для просмотра БД
- Используйте браузер DevTools для отладки (F12)

### Для продакшена
- Смотрите docker-compose.yml для контейнеризации
- Включите HTTPS
- Добавьте аутентификацию
- Настройте мониторинг

### Команды для быстрого старта

**Windows:**
```batch
@echo off
cd /d C:\Users\roile\Documents\TaskBoardKursach\backend
start "Backend" dotnet run --project TaskBoard.Api
timeout /t 3
cd /d C:\Users\roile\Documents\TaskBoardKursach\frontend
start "Frontend" cmd /k php -S localhost:8000 -t public
start http://localhost:8000
```

**Linux/Mac:**
```bash
#!/bin/bash
cd ~/TaskBoardKursach/backend &
dotnet run --project TaskBoard.Api &
sleep 3
cd ~/TaskBoardKursach/frontend &
php -S localhost:8000 -t public &
open http://localhost:8000
```

## ✨ Поздравляем!

Если вы видите приложение на http://localhost:8000 - 
**TaskBoard Manager успешно установлен и запущен!** 🎉

---

**Нужна помощь?**
- Проверьте DEVELOPMENT.md для разработки
- Смотрите API_DOCUMENTATION.md для API
- Читайте README.md для полной документации

**Удачи! 🚀**
