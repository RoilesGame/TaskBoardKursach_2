// API: по умолчанию 5000. Если порт занят — второй экземпляр: dotnet run --launch-profile "TaskBoard.Api (порт 5001)"
// и в консоли браузера: localStorage.setItem('TASKBOARD_API_BASE', 'http://localhost:5001/api'); location.reload();
const API_BASE_URL = localStorage.getItem('TASKBOARD_API_BASE') || 'http://localhost:5000/api';

class ApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('token');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        const merged = {
            ...defaultOptions,
            ...options,
            headers: { ...defaultOptions.headers, ...(options.headers || {}) }
        };

        try {
            const response = await fetch(url, merged);
            const text = await response.text();
            let data = null;
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }
            }

            if (!response.ok) {
                let message = `Ошибка ${response.status}`;
                if (typeof data === 'string' && data.trim()) {
                    message = data.trim();
                } else if (data && typeof data === 'object') {
                    message = data.title || data.detail || data.message
                        || (data.errors ? JSON.stringify(data.errors) : JSON.stringify(data));
                }
                throw new Error(message);
            }

            if (response.status === 204) {
                return null;
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            if (error instanceof TypeError && String(error.message).toLowerCase().includes('fetch')) {
                throw new Error('Не удалось связаться с API. Запустите бэкенд: dotnet run в папке TaskBoard.Api (адрес ' + this.baseUrl + ').');
            }
            throw error;
        }
    }

    async register(credentials) {
        return this.request('/Auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async login(credentials) {
        return this.request('/Auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async getCurrentUser(userId) {
        return this.request(`/Auth/me/${userId}`);
    }

    // Tasks
    async getTasks(companyId = null, teamId = null, assigneeId = null) {
        let endpoint = '/tasks';
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        if (teamId) params.append('teamId', teamId);
        if (assigneeId) params.append('assigneeId', assigneeId);

        if (params.toString()) {
            endpoint += '?' + params.toString();
        }

        return this.request(endpoint);
    }

    async getTask(id) {
        return this.request(`/tasks/${id}`);
    }

    async createTask(task) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }

    async updateTask(id, task) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task)
        });
    }

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    // Companies
    async getCompanies() {
        return this.request('/companies');
    }

    async getCompany(id) {
        return this.request(`/companies/${id}`);
    }

    async createCompany(company) {
        return this.request('/companies', {
            method: 'POST',
            body: JSON.stringify(company)
        });
    }

    async updateCompany(id, company) {
        return this.request(`/companies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(company)
        });
    }

    async deleteCompany(id) {
        return this.request(`/companies/${id}`, {
            method: 'DELETE'
        });
    }

    // Teams
    async getTeams(companyId = null) {
        let endpoint = '/teams';
        if (companyId) {
            endpoint += `?companyId=${companyId}`;
        }
        return this.request(endpoint);
    }

    async getTeam(id) {
        return this.request(`/teams/${id}`);
    }

    async createTeam(team) {
        return this.request('/teams', {
            method: 'POST',
            body: JSON.stringify(team)
        });
    }

    async updateTeam(id, team) {
        return this.request(`/teams/${id}`, {
            method: 'PUT',
            body: JSON.stringify(team)
        });
    }

    async deleteTeam(id) {
        return this.request(`/teams/${id}`, {
            method: 'DELETE'
        });
    }
}

// Export for use in other files
const apiClient = new ApiClient();
