@echo off
REM TaskBoard Installation Script for Windows

echo.
echo ======================================
echo TaskBoard Project Installation
echo ======================================
echo.

REM Check .NET
echo Checking .NET installation...
dotnet --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo X .NET is not installed. Please install .NET 6.0+ from https://dotnet.microsoft.com/
    exit /b 1
)
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo [OK] .NET is installed: %DOTNET_VERSION%
echo.

REM Check PostgreSQL
echo Checking PostgreSQL installation...
psql --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo X PostgreSQL is not installed. Please install PostgreSQL 12+ from https://www.postgresql.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('psql --version') do set PG_VERSION=%%i
echo [OK] PostgreSQL is installed: %PG_VERSION%
echo.

REM Check PHP
echo Checking PHP installation...
php -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo X PHP is not installed. Please install PHP 7.4+ from https://www.php.net/
    exit /b 1
)
for /f "tokens=1-2" %%i in ('php -v') do (
    echo [OK] PHP is installed: %%i %%j
    goto php_ok
)
:php_ok
echo.

REM Backend setup
echo Setting up Backend...
cd backend

echo Restoring NuGet packages...
dotnet restore

echo Building solution...
dotnet build

echo [OK] Backend setup complete!
echo.

REM Frontend setup
echo Setting up Frontend...
cd ..\frontend

echo [OK] Frontend setup complete!
echo.

REM Database setup
echo Setting up Database...
echo Please ensure PostgreSQL is running and configured.
echo The database schema will be applied when you run the backend.
echo.

echo ======================================
echo [OK] Installation complete!
echo ======================================
echo.
echo Next steps:
echo 1. Backend:   cd backend ^&^& dotnet run --project TaskBoard.Api
echo 2. Frontend:  cd frontend ^&^& php -S localhost:8000 -t public
echo 3. Open:      http://localhost:8000 in your browser
echo.
pause
