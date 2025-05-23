import { BaseService } from './BaseService';

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export class AuthService extends BaseService {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await this.axiosInstance.post('/login', {
            username,
            password
        });
        return response.data;
    }

    async register(username: string, password: string, role: string): Promise<void> {
        await this.axiosInstance.post('/register', {
            username,
            password,
            role
        });
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
} 