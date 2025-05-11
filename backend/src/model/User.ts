import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string; // e.g., 'user', 'admin'

    @Column({ default: false })
    flagged: boolean;
} 