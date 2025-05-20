import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('user_monitoring')
export default class UserMonitoring {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.monitoring, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ default: false })
    flagged: boolean;

    @Column({ type: 'int', nullable: true })
    actionCount?: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastChecked: Date;
}
