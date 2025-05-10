import { SortOrder } from '../model/Types';
import Dealership from '../model/Dealership';

class DealershipService {
    private baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    }

    async getAll(params?: { searchTerm?: string; sortBy?: string; order?: SortOrder }): Promise<Dealership[]> {
        try {
            let url = this.baseUrl;
            if (params) {
                const query = new URLSearchParams();
                if (params.searchTerm) query.append('searchTerm', params.searchTerm);
                if (params.sortBy) query.append('sortBy', params.sortBy);
                if (params.order) query.append('order', params.order);
                url += `?${query.toString()}`;
            }
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching dealerships:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<Dealership> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching dealership:', error);
            throw error;
        }
    }

    async add(newDealership: Omit<Dealership, 'id' | 'cars'>): Promise<Dealership> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDealership),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error adding dealership:', error);
            throw error;
        }
    }

    async update(id: number, dealership: Partial<Dealership>): Promise<Dealership> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dealership),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating dealership:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting dealership:', error);
            throw error;
        }
    }
}

export default DealershipService; 