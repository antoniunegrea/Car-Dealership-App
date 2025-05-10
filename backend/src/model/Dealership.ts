import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Car } from './Car';

@Entity('dealerships')
export class Dealership {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    contact: string;

    @OneToMany(() => Car, car => car.dealership)
    cars: Car[];
} 