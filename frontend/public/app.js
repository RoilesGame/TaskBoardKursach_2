// Main Application Logic

const STATUS_LABELS = {
    backlog: 'Бэклог',
    in_progress: 'В работе',
    review: 'На проверке',
    done: 'Готово'
};

const PRIORITY_LABELS = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический'
};

let currentView = 'dashboard';
let currentCompanyId = null;
let currentCompanyName = null;
let currentTeamId = null;
let tasksCache = [];
let companiesCache = [];
let teamsCache = [];

const LS_COMPANY_ID = 'taskboard_currentCompanyId';
const LS_COMPANY_NAME = 'taskboard_currentCompanyName';

/** Компания, для которой открыт полноэкранный канбан на вкладке «Компании» */
let companyKanbanCompanyId = null;

const KANBAN_STATUSES = ['backlog', 'in_progress', 'review', 'done'];

function getCurrentUserId() {
    return localStorage.getItem('userId');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (!getCurrentUserId()) {
        window.location.href = 'login.html';
        return;
    }
    restoreCurrentCompanyFromStorage();
    updateNavContextBar();
    loadDashboard();
});

// Navigation
function loadDashboard() {
    currentView = 'dashboard';
    updateActiveNav('dashboard');
    renderDashboard();
}

function loadTasks() {
    currentView = 'tasks';
    updateActiveNav('tasks');
    renderTasks();
}

function loadCompanies() {
    currentView = 'companies';
    updateActiveNav('companies');
    renderCompanies();
}

function loadTeams() {
    currentView = 'teams';
    updateActiveNav('teams');
    renderTeams();
}

function loadMyTasks() {
    currentView = 'myTasks';
    updateActiveNav('myTasks');
    renderMyTasksView();
}

function loadProfile() {
    currentView = 'profile';
    updateActiveNav('profile');
    renderProfile();
}

function restoreCurrentCompanyFromStorage() {
    const id = localStorage.getItem(LS_COMPANY_ID);
    const name = localStorage.getItem(LS_COMPANY_NAME);
    if (id) {
        currentCompanyId = id;
        currentCompanyName = name || null;
    }
}

function updateNavContextBar() {
    const el = document.getElementById('nav-context');
    if (!el) return;
    if (currentCompanyId && currentCompanyName) {
        el.hidden = false;
        el.innerHTML = `<strong>Текущая компания</strong><span>${escapeHtml(currentCompanyName)}</span>`;
    } else if (currentCompanyId) {
        el.hidden = false;
        el.innerHTML = `<strong>Текущая компания</strong><span>ID: ${escapeHtml(String(currentCompanyId).slice(0, 8))}…</span>`;
    } else {
        el.hidden = true;
        el.innerHTML = '';
    }
}

/**
 * Сохраняет компанию для новых задач и команд; name подставляется из кэша, если не передан.
 */
function setCurrentCompany(id, name) {
    currentCompanyId = id || null;
    if (!id) {
        currentCompanyName = null;
        localStorage.removeItem(LS_COMPANY_ID);
        localStorage.removeItem(LS_COMPANY_NAME);
        updateNavContextBar();
        return;
    }
    const resolvedName =
        name ||
        (companiesCache || []).find(c => String(c.id) === String(id))?.name ||
        currentCompanyName ||
        null;
    currentCompanyName = resolvedName;
    localStorage.setItem(LS_COMPANY_ID, id);
    if (resolvedName) localStorage.setItem(LS_COMPANY_NAME, resolvedName);
    updateNavContextBar();
}

function updateActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const selector = `[onclick="load${page.charAt(0).toUpperCase() + page.slice(1)}()"]`;
    const activeLink = document.querySelector(selector);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Dashboard
function renderDashboard() {
    const content = document.getElementById('content-area');
    content.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <div>
                    <h2>Панель управления</h2>
                    <p>Обзор текущего состояния задач, компаний и команд</p>
                </div>
            </div>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Всего задач</h3>
                    <p id="total-tasks">Загрузка...</p>
                </div>
                <div class="stat-card">
                    <h3>Выполнено</h3>
                    <p id="completed-tasks">Загрузка...</p>
                </div>
                <div class="stat-card">
                    <h3>Компаний</h3>
                    <p id="total-companies">Загрузка...</p>
                </div>
                <div class="stat-card">
                    <h3>Команд</h3>
                    <p id="total-teams">Загрузка...</p>
                </div>
            </div>

            <div class="dashboard-section">
                <h3>Последние задачи</h3>
                <div id="recent-tasks" class="tasks-list">
                    Загрузка задач...
                </div>
            </div>
        </div>
    `;

    loadDashboardData();
}

async function loadDashboardData() {
    try {
        const [tasks, companies, teams] = await Promise.all([
            apiClient.getTasks(),
            apiClient.getCompanies(),
            apiClient.getTeams()
        ]);

        const completedTasks = tasks.filter(t => t.status === 'done').length;

        document.getElementById('total-tasks').textContent = tasks.length;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('total-companies').textContent = companies.length;
        document.getElementById('total-teams').textContent = teams.length;

        const recentTasksHtml = tasks.slice(0, 5).map(task => `
            <div class="task-card small">
                <div class="task-header">
                    <h4>${task.title}</h4>
                    <span class="badge status-${task.status}">${STATUS_LABELS[task.status] || task.status}</span>
                </div>
                <p class="task-desc">${task.description || 'Описание отсутствует'}</p>
                <div class="task-meta">
                    <span class="badge priority-${task.priority}">${PRIORITY_LABELS[task.priority] || task.priority}</span>
                    ${task.dueDate ? `<span class="badge badge-date">${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
            </div>
        `).join('');

        document.getElementById('recent-tasks').innerHTML = recentTasksHtml || '<p>Задач пока нет</p>';
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('content-area').innerHTML = '<p class="error">Ошибка загрузки панели управления</p>';
    }
}

// Tasks View
async function renderTasks() {
    const content = document.getElementById('content-area');
    content.innerHTML = `
        <div class="tasks-container">
            <div class="tasks-header">
                <div>
                    <h2>Задачи</h2>
                    <p>Создавайте, фильтруйте и отслеживайте рабочие задачи</p>
                </div>
                <button class="btn btn-primary" onclick="showCreateTaskForm()">+ Новая задача</button>
            </div>

            <div class="tasks-filters">
                <input type="text" id="task-search" placeholder="Поиск задач..." onkeyup="filterTasks()">
                <select id="status-filter" onchange="filterTasks()">
                    <option value="">Все статусы</option>
                    <option value="backlog">Бэклог</option>
                    <option value="in_progress">В работе</option>
                    <option value="review">На проверке</option>
                    <option value="done">Готово</option>
                </select>
                <select id="priority-filter" onchange="filterTasks()">
                    <option value="">Все приоритеты</option>
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="critical">Критический</option>
                </select>
            </div>

            <div id="tasks-list" class="tasks-board">
                Загрузка задач...
            </div>

            <div id="create-task-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close" onclick="closeCreateTaskForm()">&times;</span>
                    <h3>Новая задача</h3>
                    <form id="create-task-form" onsubmit="handleCreateTask(event)">
                        <input type="text" id="task-title" placeholder="Название задачи" required>
                        <textarea id="task-description" placeholder="Описание задачи"></textarea>
                        <select id="task-status">
                            <option value="backlog">Бэклог</option>
                            <option value="in_progress">В работе</option>
                            <option value="review">На проверке</option>
                            <option value="done">Готово</option>
                        </select>
                        <select id="task-priority">
                            <option value="low">Низкий</option>
                            <option value="medium" selected>Средний</option>
                            <option value="high">Высокий</option>
                            <option value="critical">Критический</option>
                        </select>
                        <input type="date" id="task-due-date">
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    loadTasksList();
}

async function loadTasksList() {
    try {
        const tasks = await apiClient.getTasks();
        tasksCache = tasks;
        displayTasks(tasksCache);
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasks-list').innerHTML = '<p class="error">Ошибка загрузки задач</p>';
    }
}

function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks-list');

    if (tasks.length === 0) {
        tasksList.innerHTML = '<p>Задачи не найдены</p>';
        return;
    }

    const html = tasks.map(task => `
        <div class="task-card" onclick="showTaskDetails('${task.id}')">
            <h4>${task.title}</h4>
            <p class="task-desc">${task.description || 'Описание отсутствует'}</p>
            <div class="task-meta">
                <span class="badge status-${task.status}">${STATUS_LABELS[task.status] || task.status}</span>
                <span class="badge priority-${task.priority}">${PRIORITY_LABELS[task.priority] || task.priority}</span>
                ${task.dueDate ? `<span class="badge badge-date">${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
            </div>
        </div>
    `).join('');

    tasksList.innerHTML = html;
}

function filterTasks() {
    const search = document.getElementById('task-search').value.toLowerCase();
    const status = document.getElementById('status-filter').value;
    const priority = document.getElementById('priority-filter').value;

    const filtered = tasksCache.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search) || (task.description || '').toLowerCase().includes(search);
        const matchesStatus = !status || task.status === status;
        const matchesPriority = !priority || task.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    displayTasks(filtered);
}

function showCreateTaskForm() {
    document.getElementById('create-task-modal').style.display = 'block';
}

function closeCreateTaskForm() {
    document.getElementById('create-task-modal').style.display = 'none';
}

async function handleCreateTask(event) {
    event.preventDefault();

    if (!currentCompanyId) {
        Toast.warning('Сначала выберите или создайте компанию на вкладке «Компании».');
        return;
    }

    const uid = getCurrentUserId() || '00000000-0000-0000-0000-000000000000';
    const task = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        status: document.getElementById('task-status').value,
        priority: document.getElementById('task-priority').value,
        dueDate: document.getElementById('task-due-date').value || null,
        companyId: currentCompanyId,
        createdBy: uid
    };

    try {
        await apiClient.createTask(task);
        closeCreateTaskForm();
        loadTasksList();
        Toast.success('Задача создана.');
    } catch (error) {
        Toast.error('Не удалось создать задачу: ' + error.message);
    }
}

// Companies View
async function renderCompanies() {
    companyKanbanCompanyId = null;
    const content = document.getElementById('content-area');
    content.innerHTML = `
        <div class="companies-container">
            <div class="companies-header">
                <div>
                    <h2>Компании</h2>
                    <p>Клик по карточке открывает канбан по всем командам. Кнопка «Сделать текущей» задаёт компанию для новых задач и команд (подсказка слева в меню).</p>
                </div>
                <button class="btn btn-primary" onclick="showCreateCompanyForm()">+ Новая компания</button>
            </div>
            <div id="companies-list">
                Загрузка компаний...
            </div>
        </div>
    `;

    await loadCompaniesList();
}

function companiesMemberHeuristic(uid, company, teams, tasks) {
    const cid = String(company.id);
    const u = String(uid);
    const owner = String(company.ownerId) === u;
    if (owner) return { owner: true, member: false };
    const teamHit = teams.some(
        t => String(t.companyId) === cid && t.createdBy && String(t.createdBy) === u
    );
    const taskHit = tasks.some(t => {
        if (String(t.companyId) !== cid) return false;
        if (t.assigneeId && String(t.assigneeId) === u) return true;
        if (t.createdBy && String(t.createdBy) === u) return true;
        return false;
    });
    return { owner: false, member: teamHit || taskHit };
}

async function loadCompaniesList() {
    const root = document.getElementById('companies-list');
    if (!root) return;
    try {
        const uid = getCurrentUserId();
        const [companies, teams, tasks] = await Promise.all([
            apiClient.getCompanies(),
            apiClient.getTeams(),
            apiClient.getTasks()
        ]);
        companiesCache = companies;
        teamsCache = teams;
        tasksCache = tasks;
        displayCompaniesGrouped(companies, teams, tasks, uid);
    } catch (error) {
        console.error('Error loading companies:', error);
        root.innerHTML = '<p class="error">Ошибка загрузки компаний</p>';
    }
}

function displayCompaniesGrouped(companies, teams, tasks, uid) {
    const companiesList = document.getElementById('companies-list');
    if (!companies.length) {
        companiesList.innerHTML = '<p>Компании не найдены</p>';
        return;
    }
    const owned = [];
    const member = [];
    const other = [];
    for (const c of companies) {
        const { owner, member: m } = companiesMemberHeuristic(uid, c, teams, tasks);
        if (owner) owned.push(c);
        else if (m) member.push(c);
        else other.push(c);
    }
    const renderSection = (title, subtitle, list) => {
        if (!list.length) return '';
        const cards = list.map(c => buildCompanyCard(c, uid)).join('');
        return `<div class="companies-section"><h3>${title}</h3><p class="muted" style="margin-bottom:16px">${subtitle}</p><div class="companies-grid">${cards}</div></div>`;
    };
    companiesList.innerHTML =
        renderSection('Мои компании (вы владелец)', 'Компании, которые вы создали.', owned) +
        renderSection('Участие', 'Компании, где у вас есть команды или задачи (не как владелец).', member) +
        renderSection('Остальные', 'Остальные записи в системе.', other);
}

function buildCompanyCard(company, uid) {
    const { owner, member } = companiesMemberHeuristic(uid, company, teamsCache, tasksCache);
    const isCurrent = currentCompanyId && String(currentCompanyId) === String(company.id);
    const badges = [];
    if (owner) badges.push('<span class="badge badge-role-owner">Владелец</span>');
    if (member) badges.push('<span class="badge badge-role-member">Участник</span>');
    if (isCurrent) badges.push('<span class="badge badge-date">Текущая для задач</span>');
    const selClass = isCurrent ? ' company-card--selected' : '';
    const nameJs = JSON.stringify(company.name || '');
    return `
        <div class="company-card${selClass}" role="button" tabindex="0" onclick="openCompanyKanban('${company.id}', ${nameJs})">
            <div class="role-badges">${badges.join('')}</div>
            <h3>${escapeHtml(company.name)}</h3>
            <p>${escapeHtml(company.description || 'Описание отсутствует')}</p>
            <div class="company-actions" onclick="event.stopPropagation()">
                <button class="btn btn-small" onclick="selectCompany('${company.id}', ${nameJs})">Сделать текущей</button>
                <button class="btn btn-small btn-danger" onclick="deleteCompany('${company.id}')">Удалить</button>
            </div>
        </div>`;
}

async function openCompanyKanban(companyId, companyName) {
    companyKanbanCompanyId = companyId;
    setCurrentCompany(companyId, companyName);
    const content = document.getElementById('content-area');
    const rawName =
        companyName ||
        companiesCache.find(c => String(c.id) === String(companyId))?.name ||
        'Компания';
    const title = escapeHtml(rawName);
    content.innerHTML = `
        <div class="companies-container">
            <div class="kanban-header-row">
                <div>
                    <button type="button" class="btn btn-secondary" onclick="backFromCompanyKanban()">← К списку компаний</button>
                    <h2 style="margin-top:12px">${title}</h2>
                    <p class="muted">Задачи по всем командам компании. Смена статуса и кнопка «Взять себе» сохраняются на сервере.</p>
                </div>
            </div>
            <div id="company-kanban-root">Загрузка канбана…</div>
        </div>
    `;
    await fillCompanyKanban(companyId);
}

async function fillCompanyKanban(companyId) {
    const root = document.getElementById('company-kanban-root');
    if (!root) return;
    try {
        const [tasks, teams] = await Promise.all([
            apiClient.getTasks(companyId, null),
            apiClient.getTeams(companyId)
        ]);
        const teamNameById = Object.fromEntries(teams.map(t => [String(t.id), t.name]));
        const uid = getCurrentUserId();
        root.innerHTML = buildKanbanBoardHtml(tasks, teamNameById, uid, 'company');
    } catch (e) {
        root.innerHTML = `<p class="error">Не удалось загрузить канбан: ${escapeHtml(e.message)}</p>`;
    }
}

function backFromCompanyKanban() {
    companyKanbanCompanyId = null;
    renderCompanies();
}

function buildKanbanBoardHtml(tasks, teamNameById, uid, mode) {
    const cols = KANBAN_STATUSES.map(status => {
        const list = tasks.filter(t => t.status === status);
        const cards = list.map(task => buildKanbanCard(task, teamNameById, uid, mode)).join('');
        return `
            <div class="kanban-column">
                <h4>${STATUS_LABELS[status] || status}</h4>
                ${cards || '<p class="muted" style="font-size:13px">Пусто</p>'}
            </div>`;
    }).join('');
    return `<div class="kanban-board">${cols}</div>`;
}

function buildKanbanCard(task, teamNameById, uid, mode) {
    const tid = String(task.teamId || '');
    const teamLabel = tid && teamNameById[tid] ? teamNameById[tid] : task.teamId ? 'Команда' : 'Без команды';
    const mine = task.assigneeId && String(task.assigneeId) === String(uid);
    const takeBtn =
        mine || !uid
            ? ''
            : `<button type="button" class="btn btn-small btn-secondary" style="margin-top:8px;width:100%" onclick="takeKanbanTask('${task.id}', '${mode}')">Взять себе</button>`;
    const statusOptions = KANBAN_STATUSES.map(
        s => `<option value="${s}"${task.status === s ? ' selected' : ''}>${STATUS_LABELS[s]}</option>`
    ).join('');
    return `
        <div class="kanban-card">
            <h5>${escapeHtml(task.title)}</h5>
            <div class="kanban-team">${escapeHtml(teamLabel)}</div>
            <div class="task-meta">
                <span class="badge priority-${task.priority}">${PRIORITY_LABELS[task.priority] || task.priority}</span>
                ${task.dueDate ? `<span class="badge badge-date">${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
            </div>
            <select aria-label="Статус" onclick="event.stopPropagation()" onchange="onKanbanStatusChange(event, '${task.id}', '${mode}')">${statusOptions}</select>
            ${takeBtn}
        </div>`;
}

async function onKanbanStatusChange(ev, taskId, mode) {
    const newStatus = ev.target.value;
    try {
        const task = await apiClient.getTask(taskId);
        task.status = newStatus;
        await apiClient.updateTask(taskId, task);
        Toast.success('Статус обновлён.');
        if (mode === 'company' && companyKanbanCompanyId) await fillCompanyKanban(companyKanbanCompanyId);
        else if (mode === 'mine') await renderMyTasksView();
    } catch (err) {
        Toast.error('Не удалось обновить статус: ' + err.message);
        if (mode === 'company' && companyKanbanCompanyId) await fillCompanyKanban(companyKanbanCompanyId);
        else if (mode === 'mine') await renderMyTasksView();
    }
}

async function takeKanbanTask(taskId, mode) {
    const uid = getCurrentUserId();
    if (!uid) return;
    try {
        const task = await apiClient.getTask(taskId);
        task.assigneeId = uid;
        await apiClient.updateTask(taskId, task);
        Toast.success('Задача назначена на вас.');
        if (mode === 'company' && companyKanbanCompanyId) await fillCompanyKanban(companyKanbanCompanyId);
        else if (mode === 'mine') await renderMyTasksView();
    } catch (err) {
        Toast.error('Не удалось назначить: ' + err.message);
    }
}

function selectCompany(id, name) {
    setCurrentCompany(id, name);
    Toast.success('Компания выбрана для новых задач и команд.');
    if (currentView === 'companies' && !companyKanbanCompanyId) loadCompaniesList();
}

async function showCreateCompanyForm() {
    const name = await promptDialog({
        title: 'Новая компания',
        label: 'Название',
        placeholder: 'Например, ООО Ромашка',
        okText: 'Далее'
    });
    if (name === null || !name) return;

    const description = await promptDialog({
        title: 'Описание компании',
        label: 'Описание (необязательно)',
        placeholder: 'Кратко о компании',
        multiline: true,
        okText: 'Создать'
    });
    if (description === null) return;

    createCompany(name, description);
}

async function createCompany(name, description) {
    try {
        const uid = getCurrentUserId() || '00000000-0000-0000-0000-000000000000';
        await apiClient.createCompany({
            name,
            description,
            ownerId: uid
        });
        loadCompaniesList();
        Toast.success('Компания создана.');
    } catch (error) {
        Toast.error('Не удалось создать компанию: ' + error.message);
    }
}

function selectCompany(id) {
    currentCompanyId = id;
    Toast.success('Компания выбрана для задач и команд.');
}

async function deleteCompany(id) {
    const ok = await confirmDialog('Удалить компанию и связанные данные? Это действие нельзя отменить.', {
        title: 'Удаление компании',
        okText: 'Удалить',
        cancelText: 'Отмена'
    });
    if (!ok) return;

    try {
        await apiClient.deleteCompany(id);
        if (String(currentCompanyId) === String(id)) setCurrentCompany(null);
        if (String(companyKanbanCompanyId) === String(id)) {
            companyKanbanCompanyId = null;
            await renderCompanies();
        } else {
            loadCompaniesList();
        }
        Toast.success('Компания удалена.');
    } catch (error) {
        Toast.error('Не удалось удалить компанию: ' + error.message);
    }
}

async function renderMyTasksView() {
    const uid = getCurrentUserId();
    const content = document.getElementById('content-area');
    if (!uid) {
        content.innerHTML = '<p class="error">Не удалось определить пользователя.</p>';
        return;
    }
    content.innerHTML = `
        <div class="tasks-container">
            <div class="tasks-header">
                <div>
                    <h2>Мои задачи</h2>
                    <p>Задачи, где вы указаны исполнителем. Меняйте статус в карточке или на канбане компании.</p>
                </div>
            </div>
            <div id="my-tasks-kanban">Загрузка…</div>
        </div>`;
    const root = document.getElementById('my-tasks-kanban');
    try {
        const tasks = await apiClient.getTasks(null, null, uid);
        const allTeams = await apiClient.getTeams();
        const teamNameById = Object.fromEntries(allTeams.map(t => [String(t.id), t.name]));
        root.innerHTML = buildKanbanBoardHtml(tasks, teamNameById, uid, 'mine');
    } catch (e) {
        root.innerHTML = `<p class="error">Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
    }
}

// Teams View
async function renderTeams() {
    const content = document.getElementById('content-area');
    content.innerHTML = `
        <div class="teams-container">
            <div class="teams-header">
                <div>
                    <h2>Команды</h2>
                    <p>Список команд и распределение по компаниям</p>
                </div>
                <button class="btn btn-primary" onclick="showCreateTeamForm()">+ Новая команда</button>
            </div>
            <div id="teams-list" class="teams-grid">
                Загрузка команд...
            </div>
        </div>
    `;

    await loadTeamsList();
}

async function loadTeamsList() {
    try {
        const [teams, companies] = await Promise.all([apiClient.getTeams(), apiClient.getCompanies()]);
        teamsCache = teams;
        companiesCache = companies;
        displayTeams(teams, companies);
    } catch (error) {
        console.error('Error loading teams:', error);
        document.getElementById('teams-list').innerHTML = '<p class="error">Ошибка загрузки команд</p>';
    }
}

function displayTeams(teams, companies) {
    const teamsList = document.getElementById('teams-list');

    if (teams.length === 0) {
        teamsList.innerHTML = '<p>Команды не найдены</p>';
        return;
    }

    const companyMap = companies.reduce((acc, company) => {
        acc[company.id] = company.name;
        return acc;
    }, {});

    const html = teams.map(team => `
        <div class="team-card">
            <div class="team-header">
                <div>
                    <h3>${team.name}</h3>
                    <span class="team-company">${companyMap[team.companyId] || 'Без компании'}</span>
                </div>
                <div class="company-actions">
                    <button class="btn btn-small" onclick="selectTeam('${team.id}')">Выбрать</button>
                    <button class="btn btn-small btn-danger" onclick="deleteTeam('${team.id}')">Удалить</button>
                </div>
            </div>
            <p>${team.description || 'Описание отсутствует'}</p>
        </div>
    `).join('');

    teamsList.innerHTML = html;
}

async function showCreateTeamForm() {
    if (!currentCompanyId) {
        Toast.warning('Сначала выберите компанию на вкладке «Компании».');
        return;
    }

    const name = await promptDialog({
        title: 'Новая команда',
        label: 'Название команды',
        placeholder: 'Например, Разработка',
        okText: 'Создать'
    });
    if (name === null || !name) return;

    createTeam(name, currentCompanyId);
}

async function createTeam(name, companyId) {
    if (!companyId) {
        Toast.warning('Сначала выберите компанию.');
        return;
    }

    try {
        const uid = getCurrentUserId() || '00000000-0000-0000-0000-000000000000';
        await apiClient.createTeam({
            name,
            description: '',
            companyId: companyId,
            createdBy: uid
        });
        loadTeamsList();
        Toast.success('Команда создана.');
    } catch (error) {
        Toast.error('Не удалось создать команду: ' + error.message);
    }
}


function selectTeam(id) {
    currentTeamId = id;
    Toast.success('Команда выбрана.');
}

async function deleteTeam(id) {
    const ok = await confirmDialog('Удалить команду? Это действие нельзя отменить.', {
        title: 'Удаление команды',
        okText: 'Удалить',
        cancelText: 'Отмена'
    });
    if (!ok) return;

    try {
        await apiClient.deleteTeam(id);
        loadTeamsList();
        Toast.success('Команда удалена.');
    } catch (error) {
        Toast.error('Не удалось удалить команду: ' + error.message);
    }
}

// Profile View
async function renderProfile() {
    const content = document.getElementById('content-area');
    const email = localStorage.getItem('userEmail') || '—';
    const name = localStorage.getItem('userFullName') || '—';

    content.innerHTML = `
        <div class="profile-container">
            <h2>Профиль</h2>
            <div class="profile-card">
                <p><strong>Email:</strong> <span id="user-email">${escapeHtml(email)}</span></p>
                <p><strong>Имя:</strong> <span id="user-name">${escapeHtml(name)}</span></p>
                <p><strong>ID:</strong> <span id="user-id" class="muted">${escapeHtml(getCurrentUserId() || '—')}</span></p>
                <p id="user-avatar-row" style="display:none"><strong>Аватар:</strong> <span id="user-avatar"></span></p>
                <button class="btn btn-primary" onclick="editProfile()">Редактировать</button>
                <button class="btn btn-danger" onclick="logout()">Выйти</button>
            </div>
        </div>
    `;

    const uid = getCurrentUserId();
    if (!uid) return;

    try {
        const me = await apiClient.getCurrentUser(uid);
        document.getElementById('user-email').textContent = me.email || email;
        document.getElementById('user-name').textContent = me.fullName || name;
        if (me.avatarUrl) {
            const row = document.getElementById('user-avatar-row');
            row.style.display = 'block';
            document.getElementById('user-avatar').textContent = me.avatarUrl;
        }
    } catch (e) {
        console.warn('Не удалось обновить профиль с сервера:', e);
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function editProfile() {
    Toast.info('Редактирование профиля скоро будет доступно.');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
    localStorage.removeItem(LS_COMPANY_ID);
    localStorage.removeItem(LS_COMPANY_NAME);
    window.location.href = 'login.html';
}

function showTaskDetails(id) {
    Toast.info('Карточка задачи: ' + id + ' (детальный просмотр в разработке).');
}
