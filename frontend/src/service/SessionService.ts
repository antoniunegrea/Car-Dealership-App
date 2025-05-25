import { BaseService } from './BaseService';

export interface Session {
    id: number;
    token: string;
    deviceInfo: string;
    isActive: boolean;
    createdAt: Date;
    lastActivity: Date;
    expiresAt: Date;
}

export class SessionService extends BaseService {
    private sessionActivityInterval: NodeJS.Timeout | null = null;
    private readonly SESSION_ACTIVITY_INTERVAL = 2 * 60 * 1000; // 2 minutes

    async createSession(token: string): Promise<Session> {
        try {
            const deviceInfo = this.getDeviceInfo();
            // Set the token in the request headers
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await this.axiosInstance.post(`${this.baseUrl}`, {
                token,
                deviceInfo
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to create session:', error.response?.data || error.message);
            throw error;
        }
    }

    async getUserSessions(): Promise<Session[]> {
        try {
            const response = await this.axiosInstance.get(`${this.baseUrl}`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to get user sessions:', error.response?.data || error.message);
            throw error;
        }
    }

    async invalidateSession(sessionId: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`${this.baseUrl}/${sessionId}`);
            this.stopSessionActivityMonitoring();
        } catch (error: any) {
            console.error('Failed to invalidate session:', error.response?.data || error.message);
            throw error;
        }
    }

    async updateSessionActivity(sessionId: number): Promise<void> {
        try {
            await this.axiosInstance.patch(`${this.baseUrl}/${sessionId}/activity`);
        } catch (error: any) {
            if (error.response?.status === 401) {
                // Session expired, trigger logout
                this.handleSessionExpired();
            }
            console.error('Failed to update session activity:', error.response?.data || error.message);
            throw error;
        }
    }

    startSessionActivityMonitoring(sessionId: number): void {
        this.stopSessionActivityMonitoring(); // Clear any existing interval
        
        this.sessionActivityInterval = setInterval(async () => {
            try {
                await this.updateSessionActivity(sessionId);
            } catch (error) {
                console.error('Failed to update session activity:', error);
                this.stopSessionActivityMonitoring();
            }
        }, this.SESSION_ACTIVITY_INTERVAL);
    }

    stopSessionActivityMonitoring(): void {
        if (this.sessionActivityInterval) {
            clearInterval(this.sessionActivityInterval);
            this.sessionActivityInterval = null;
        }
    }

    private getDeviceInfo(): string {
        return `${navigator.userAgent} - ${window.screen.width}x${window.screen.height}`;
    }

    private handleSessionExpired(): void {
        this.stopSessionActivityMonitoring();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}
