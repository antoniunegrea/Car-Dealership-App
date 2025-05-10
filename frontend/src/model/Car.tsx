export default interface Car {
    id: number;
    manufacturer: string;
    model: string;
    year: number;
    price: number;
    image_url: string | null;
    dealership_id: number;
    dealership?: any; // You can replace 'any' with the actual Dealership type if you import it
}