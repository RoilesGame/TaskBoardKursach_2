using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using System;
using System.Data.Common;
using System.Linq;
using TaskBoard.Data;

namespace TaskBoard.Api.Extensions
{
    public static class DatabaseExtensions
    {
        /// <summary>
        /// Создать базу данных и таблицы, если они отсутствуют
        /// </summary>
        public static void ApplyMigrations(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<TaskBoardDbContext>();
                var connection = dbContext.Database.GetDbConnection();
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    // Check if users table exists
                    command.CommandText = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users');";
                    var exists = (bool?)command.ExecuteScalar() ?? false;
                    if (!exists)
                    {
                        foreach (var migration in TaskBoard.Data.Migrations.MigrationHelper.GetMigrations())
                        {
                            var sql = TaskBoard.Data.Migrations.MigrationHelper.GetMigrationScript(migration);
                            command.CommandText = sql;
                            try
                            {
                                command.ExecuteNonQuery();
                            }
                            catch (Npgsql.PostgresException ex) when (ex.SqlState == "42P07" || ex.SqlState == "42P01")
                            {
                                // Ignore "already exists" (42P07) and "does not exist" (42P01) errors
                            }
                        }
                    }

                    command.CommandText = TaskBoard.Data.Migrations.MigrationHelper.GetSchemaAlignmentScript();
                    command.ExecuteNonQuery();
                }
            }
        }

        /// <summary>
        /// Проверить подключение к БД
        /// </summary>
        public static bool CheckDatabaseConnection(this WebApplication app)
        {
            try
            {
                using (var scope = app.Services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<TaskBoardDbContext>();
                    return dbContext.Database.CanConnect();
                }
            }
            catch (Exception ex)
            {
                var logger = app.Services.GetRequiredService<ILogger<object>>();
                logger.LogError($"Database connection failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Инициализировать БД с тестовыми данными
        /// </summary>
        public static void SeedDatabase(this WebApplication app)
        {
            // Автоматическое заполнение тестовыми данными отключено.
            // Пользователи должны регистрироваться через API.
        }
    }
}
