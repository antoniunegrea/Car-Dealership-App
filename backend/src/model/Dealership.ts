import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Car } from './Car';

@Entity('dealerships')
export class Dealership {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    contact: string;

    @OneToMany(() => Car, car => car.dealership)
    cars: Car[];
} 