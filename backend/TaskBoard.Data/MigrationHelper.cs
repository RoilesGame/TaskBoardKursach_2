using System;
using System.Collections.Generic;

namespace TaskBoard.Data.Migrations
{
    /// <summary>
    /// Migration helper for database initialization
    /// </summary>
    public class MigrationHelper
    {
        public static List<string> GetMigrations()
        {
            return new List<string>
            {
                "CreateExtension",
                "CreateUsersTable",
                "CreateCompaniesTable",
                "CreateCompanyMembersTable",
                "CreateTeamsTable",
                "CreateTeamMembersTable",
                "CreateTasksTable",
                "CreateTaskCommentsTable",
                "CreateIndexes"
            };
        }

        public static string GetMigrationScript(string migrationName)
        {
            return migrationName switch
            {
                "CreateExtension" => @"
                    CREATE EXTENSION IF NOT EXISTS ""pgcrypto"";",

                "CreateUsersTable" => @"
                    CREATE TABLE IF NOT EXISTS users (
                        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        email         VARCHAR(255) NOT NULL UNIQUE,
                        password_hash VARCHAR(255) NOT NULL,
                        full_name     VARCHAR(255) NOT NULL,
                        avatar_url    VARCHAR(500),
                        created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
                    );",

                "CreateCompaniesTable" => @"
                    CREATE TABLE IF NOT EXISTS companies (
                        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name        VARCHAR(255) NOT NULL,
                        description TEXT,
                        logo_url    VARCHAR(500),
                        owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                        created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
                    );",

                "CreateCompanyMembersTable" => @"
                    CREATE TABLE IF NOT EXISTS company_members (
                        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        role       VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'employee')),
                        joined_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                        UNIQUE (company_id, user_id)
                    );",

                "CreateTeamsTable" => @"
                    CREATE TABLE IF NOT EXISTS teams (
                        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                        name        VARCHAR(255) NOT NULL,
                        description TEXT,
                        created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
                        created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
                    );",

                "CreateTeamMembersTable" => @"
                    CREATE TABLE IF NOT EXISTS team_members (
                        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        team_id   UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                        user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
                        UNIQUE (team_id, user_id)
                    );",

                "CreateTasksTable" => @"
                    CREATE TABLE IF NOT EXISTS tasks (
                        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
                        team_id     UUID REFERENCES teams(id) ON DELETE SET NULL,
                        title       VARCHAR(500) NOT NULL,
                        description TEXT,
                        status      VARCHAR(20) NOT NULL DEFAULT 'backlog'
                                        CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
                        priority    VARCHAR(20) NOT NULL DEFAULT 'medium'
                                        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
                        assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
                        created_by  UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                        due_date    DATE,
                        created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                        updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
                    );",

                "CreateTaskCommentsTable" => @"
                    CREATE TABLE IF NOT EXISTS task_comments (
                        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
                        author_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        content    TEXT NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                    );",

                "CreateIndexes" => @"
                    CREATE INDEX IF NOT EXISTS idx_users_email             ON users(email);
                    CREATE INDEX IF NOT EXISTS idx_companies_owner         ON companies(owner_id);
                    CREATE INDEX IF NOT EXISTS idx_company_members_company ON company_members(company_id);
                    CREATE INDEX IF NOT EXISTS idx_company_members_user    ON company_members(user_id);
                    CREATE INDEX IF NOT EXISTS idx_teams_company           ON teams(company_id);
                    CREATE INDEX IF NOT EXISTS idx_team_members_team       ON team_members(team_id);
                    CREATE INDEX IF NOT EXISTS idx_team_members_user       ON team_members(user_id);
                    CREATE INDEX IF NOT EXISTS idx_tasks_company           ON tasks(company_id);
                    CREATE INDEX IF NOT EXISTS idx_tasks_team              ON tasks(team_id);
                    CREATE INDEX IF NOT EXISTS idx_tasks_assignee          ON tasks(assignee_id);
                    CREATE INDEX IF NOT EXISTS idx_tasks_created_by        ON tasks(created_by);
                    CREATE INDEX IF NOT EXISTS idx_tasks_status            ON tasks(status);
                    CREATE INDEX IF NOT EXISTS idx_task_comments_task      ON task_comments(task_id);
                    CREATE INDEX IF NOT EXISTS idx_task_comments_author    ON task_comments(author_id);",

                _ => throw new ArgumentException($"Unknown migration: {migrationName}")
            };
        }

        /// <summary>
        /// Добавляет недостающие колонки к уже существующим таблицам (CREATE TABLE IF NOT EXISTS их не обновляет).
        /// </summary>
        public static string GetSchemaAlignmentScript()
        {
            // CREATE TABLE IF NOT EXISTS не добавляет новые колонки к старым таблицам — только это выравнивает схему с моделью EF.
            return @"
                ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
                ALTER TABLE IF EXISTS companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
                ALTER TABLE IF EXISTS teams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
                ALTER TABLE IF EXISTS tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
            ";
        }
    }
}
