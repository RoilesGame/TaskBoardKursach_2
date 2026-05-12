#!/bin/bash

# TaskBoard Installation Script

echo "======================================"
echo "TaskBoard Project Installation"
echo "======================================"
echo ""

# Check .NET
echo "Checking .NET installation..."
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET is not installed. Please install .NET 6.0+ from https://dotnet.microsoft.com/"
    exit 1
fi
echo "✅ .NET is installed: $(dotnet --version)"
echo ""

# Check PostgreSQL
echo "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ from https://www.postgresql.org/"
    exit 1
fi
echo "✅ PostgreSQL is installed"
echo ""

# Check PHP
echo "Checking PHP installation..."
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 7.4+ from https://www.php.net/"
    exit 1
fi
echo "✅ PHP is installed: $(php -v | head -n 1)"
echo ""

# Backend setup
echo "Setting up Backend..."
cd backend

echo "Restoring NuGet packages..."
dotnet restore

echo "Building solution..."
dotnet build

echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "Setting up Frontend..."
cd ../frontend

echo "✅ Frontend setup complete!"
echo ""

# Database setup
echo "Setting up Database..."
echo "Please ensure PostgreSQL is running and configured."
echo "The database schema will be applied when you run the backend."
echo ""

echo "======================================"
echo "✅ Installation complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Backend:   cd backend && dotnet run --project TaskBoard.Api"
echo "2. Frontend:  cd frontend && php -S localhost:8000 -t public"
echo "3. Open:      http://localhost:8000 in your browser"
