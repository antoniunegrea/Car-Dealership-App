import Car from '../model/Car'
import { SortField, SortOrder } from '../model/Types';


class CarService{
    private baseUrl: string;

    constructor(url:string){
        this.baseUrl=url;
    }

    async get(params?: { searchTerm?: string; sortBy?: SortField; order?: SortOrder }): Promise<Car[]> {
        try {
            let url = this.baseUrl;
            if (params) {
                const query = new URLSearchParams();
                if (params.searchTerm) query.append('searchTerm', params.searchTerm);
                if (params.sortBy) query.append('sortBy', params.sortBy);
                if (params.order) query.append('order', params.order);
                url += `?${query.toString()}`;
            }
            console.log("url: " + url)
            console.log("Search" + params?.searchTerm)
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
/*
    async getCarById(params?: {id?: number}):Promise<Car>{
        try {
            let url = this.baseUrl;
            if (params) {
                const query = new URLSearchParams();
                if (params.id) query.append('id', String(params.id));
                url += `?${query.toString()}`;
            }
            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Car = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching car with given id:', error);
            throw error;
        }
    }
*/
    async add(newCar: Omit<Car, 'id'>): Promise<Car> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    async update(id: number, car: Partial<Car>): Promise<Car> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
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

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            throw error;
        }
    }
}

export default CarService;
