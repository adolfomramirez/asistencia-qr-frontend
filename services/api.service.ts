import { API_CONFIG } from '../constants/api.config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
}

class ApiService {
    private baseUrl: string = API_CONFIG.BASE_URL;
    private apiKey: string = API_CONFIG.API_KEY;

    private async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            ...options.headers,
        };

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

    /**
     * Simple health check implementation
     */
    async checkConnection(): Promise<boolean> {
        try {
            // The backend has a '/' route in 'src/index.ts' but it's not under '/api'
            // The 'src/routes/index.ts' has a '/' route which would be '/api'
            await this.get('/');
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const apiService = new ApiService();
