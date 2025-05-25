import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import User from './User';

@Entity()
export default class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    deviceInfo: string;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    lastActivity: Date;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @ManyToOne(() => User, user => user.sessions)
    user: User;
} 