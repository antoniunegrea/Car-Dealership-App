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
}

export default CarService;
