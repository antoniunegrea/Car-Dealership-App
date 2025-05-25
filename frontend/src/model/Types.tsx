import Car from "./Car";
import Dealership from "./Dealership";
export type SortField = 'manufacturer' | 'model' | 'year' | 'price' | 'name' | 'location';
export type SortOrder = 'asc' | 'desc';

export type OperationType = 'addCar' | 'updateCar' | 'deleteCar' | 'addDealership' | 'updateDealership' | 'deleteDealership';

export interface QueuedOperation {
    type: OperationType;
    data: Omit<Car, 'id'> | Car | number | Omit<Dealership, 'id' | 'cars'> | Dealership; // newCar for add, car for update, id for delete
    timestamp: number; // To maintain order of operations
}