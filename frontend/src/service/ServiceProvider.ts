import CarService from './CarService';
import ServerService from './ServerService';
import DealershipService from './DealershipService';
import AdminService from './AdminService';
import { AuthService } from './AuthService';
import { FileService } from './FileService';

export default class ServiceProvider {
    private static instance: ServiceProvider;
    private services: Map<string, any>;

    private constructor() {
        this.services = new Map();
        this.initializeServices();
    }

    private initializeServices() {
        const baseUrl = 'https://car-dealership-app-production.up.railway.app/api';
        this.services.set('car', new CarService(`${baseUrl}/cars`));
        this.services.set('server', new ServerService(`${baseUrl}`));
        this.services.set('dealership', new DealershipService(`${baseUrl}/dealerships`));
        this.services.set('admin', new AdminService(`${baseUrl}/admin`));
        this.services.set('auth', new AuthService(`${baseUrl}/auth`));
        this.services.set('file', new FileService(`${baseUrl}/files`));
    }

    public static getInstance(): ServiceProvider {
        if (!ServiceProvider.instance) {
            ServiceProvider.instance = new ServiceProvider();
        }
        return ServiceProvider.instance;
    }

    public getService<T>(serviceName: string): T {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        return service as T;
    }
} 