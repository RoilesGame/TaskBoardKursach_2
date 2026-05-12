-- ============================================================
-- TASKBOARD SCHEMA
-- PostgreSQL
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ============================================================
-- ТАБЛИЦЫ
-- ============================================================
-- Пользователи
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Компании
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Участники компании + роль
CREATE TABLE company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'employee')),
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, user_id)
);
-- Команды внутри компании
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE
    SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Участники команды
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (team_id, user_id)
);
-- Задачи
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE
    SET NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'backlog' CHECK (
            status IN ('backlog', 'in_progress', 'review', 'done')
        ),
        priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (
            priority IN ('low', 'medium', 'high', 'critical')
        ),
        assignee_id UUID REFERENCES users(id) ON DELETE
    SET NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        due_date DATE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Комментарии к задачам
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- ============================================================
-- ИНДЕКСЫ
-- ============================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_company_members_company ON company_members(company_id);
CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_teams_company ON teams(company_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_tasks_company ON tasks(company_id);
CREATE INDEX idx_tasks_team ON tasks(team_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_task_comments_task ON task_comments(task_id);
CREATE INDEX idx_task_comments_author ON task_comments(author_id);