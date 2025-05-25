import Car from '../model/Car'
import { SortField, SortOrder } from '../model/Types';

interface CarStats {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
}

class CarService{
    private baseUrl: string;

    constructor(url:string){
        this.baseUrl=url;
    }

    async get(params?: { searchTerm?: string; sortBy?: SortField; order?: SortOrder; selectedDealershipId?: number }): Promise<Car[]> {
        try {
            let url = this.baseUrl;
            if (params) {
                const query = new URLSearchParams();
                if (params.searchTerm) query.append('searchTerm', params.searchTerm);
                if (params.sortBy) query.append('sortBy', params.sortBy);
                if (params.order) query.append('order', params.order);
                if (params.selectedDealershipId) query.append('selectedDealershipId', params.selectedDealershipId.toString());
                url += `?${query.toString()}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Car[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching cars:', error);
            throw error;
        }
    }

    //get by id car
    async getById(id: number): Promise<Car> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Car = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching car by id:', error);
            throw error;
        }
    }

    async add(newCar: Omit<Car, 'id'>, token: string): Promise<Car> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCar),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Car = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding car:', error);
            throw error;
        }
    }

    async update(id: number, car: Partial<Car>, token: string): Promise<Car> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(car),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Car = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating car:', error);
            throw error;
        }
    }

    async delete(id: number, token: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            throw error;
        }
    }

    async getStats(): Promise<CarStats> {
        try {
            const response = await fetch(`${this.baseUrl}/stats`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CarStats = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching car stats:', error);
            throw error;
        }
    }
}

export default CarService;
