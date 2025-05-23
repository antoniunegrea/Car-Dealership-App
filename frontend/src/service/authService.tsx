
export interface User {
    id: number;
    username: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

class AuthService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        return response.json();
    }

    async register(username: string, password: string, role: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }
    }
}

export default AuthService; 