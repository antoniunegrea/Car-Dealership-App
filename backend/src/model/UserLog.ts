// backend/src/model/UserLog.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import User from './User';

@Entity('user_logs')
export default class UserLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @Column()
    actionType: string; // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'text', nullable: true })
    details: string;
}