import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import UserMonitoring from './UserMonitoring'; // import the new entity
import Session from './Session';

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

    @OneToMany(() => Session, session => session.user)
    sessions: Session[];
}
