import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notifications' })
export default class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ type: 'uuid' })
  content: string;

  @Column({ name: 'recipient_id' })
  recipientId: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
