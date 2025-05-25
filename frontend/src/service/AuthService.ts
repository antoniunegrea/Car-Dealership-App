import { BaseService } from './BaseService';
import { SessionService, Session } from './SessionService';

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
    private sessionService: SessionService

    constructor(baseUrl: string, sessionService: SessionService) {
        super(baseUrl);
        this.sessionService = sessionService;
    }

    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await this.axiosInstance.post('/login', {
            username,
            password
        });
        const data = response.data;
        
        // Set the token in the axios instance
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // Create a new session after successful login
        const session = await this.sessionService.createSession(data.token);
        
        // Start session activity monitoring
        this.sessionService.startSessionActivityMonitoring(session.id);
        
        return data;
    }

    async register(username: string, password: string, role: string): Promise<void> {
        await this.axiosInstance.post('/register', {
            username,
            password,
            role
        });
    }

    async getUserSessions(): Promise<Session[]> {
        return this.sessionService.getUserSessions();
    }

    async invalidateSession(sessionId: number): Promise<void> {
        await this.sessionService.invalidateSession(sessionId);
    }

    logout(): void {
        const token = localStorage.getItem('token');
        if (token) {
            // Find and invalidate the current session
            this.getUserSessions().then(sessions => {
                const currentSession = sessions.find(s => s.token === token);
                if (currentSession) {
                    this.invalidateSession(currentSession.id);
                }
            }).catch(console.error);
        }
        this.sessionService.stopSessionActivityMonitoring();
        // Remove the token from axios headers
        delete this.axiosInstance.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
} 