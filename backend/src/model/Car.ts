import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dealership } from './Dealership';

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    manufacturer: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    image_url: string;

    @ManyToOne(() => Dealership, dealership => dealership.cars)
    @JoinColumn({ name: 'dealership_id' })
    dealership: Dealership;

    @Column()
    dealership_id: number;
} 