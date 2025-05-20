import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import UserMonitoring from './UserMonitoring'; // import the new entity

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string;

    @OneToOne(() => UserMonitoring, monitoring => monitoring.user)
    monitoring: UserMonitoring;
}
