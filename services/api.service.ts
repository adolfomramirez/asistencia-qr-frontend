import { API_CONFIG } from '../constants/api.config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
}

class ApiService {
    private baseUrl: string = `${API_CONFIG.BASE_URL}/api`;
    private token: string | null = null;

    setToken(token: string): void {
        this.token = token;
    }

    clearToken(): void {
        this.token = null;
    }

    private async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config: RequestInit = {
            method: options.method,
            headers,
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Request Error (${url}):`, error);
            throw error;
        }
    }

    get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body, headers });
    }

    put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body, headers });
    }

    delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }

    async login(login: string, password: string): Promise<{ user: any; token: string }> {
        const response = await this.post<{ user: any; token: string }>('/auth/login', { login, password });
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    /**
     * Simple health check using the public /health endpoint (no auth required)
     */
    async checkConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

export const apiService = new ApiService();
