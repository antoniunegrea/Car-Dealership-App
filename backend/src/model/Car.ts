import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Dealership } from './Dealership';

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    manufacturer: string;

    @Index()
    @Column()
    model: string;

    @Index()
    @Column()
    year: number;

    @Index()
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