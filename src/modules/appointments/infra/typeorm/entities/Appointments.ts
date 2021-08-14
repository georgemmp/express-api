import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  @ManyToOne(() => User, provider => provider.appointments)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'time with time zone' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Appointment;
