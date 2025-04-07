import Car from "./Car";

export type SortField = 'manufacturer' | 'model' | 'year' | 'price';
export type SortOrder = 'asc' | 'desc';

export type OperationType = 'add' | 'update' | 'delete';

export interface QueuedOperation {
    type: OperationType;
    data: Omit<Car, 'id'> | Car | number; // newCar for add, car for update, id for delete
    timestamp: number; // To maintain order of operations
}