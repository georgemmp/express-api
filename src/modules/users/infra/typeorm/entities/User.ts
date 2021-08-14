import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Appointment, appointment => appointment.provider)
  appointments: Appointment[];

  @Expose({ name: 'avatarUrl' })
  getAvatarUrl(): string | null {
    return this.avatar ? `${process.env.HOST_API}/files/${this.avatar}` : null;
  }

  // @OneToMany(() => UserToken, token => token.user)
  // tokens: UserToken[];
}

export default User;
