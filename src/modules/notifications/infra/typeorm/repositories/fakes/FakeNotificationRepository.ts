import { ObjectID } from 'mongodb';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '../../../../dtos/ICreateNotificationDTO';
import Notification from '../../schemas/Notification';

export default class FakeNotificationRepository
  implements INotificationRepository {
  private notification: Notification[] = [];

  async create({
    content,
    recipientId,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipientId });

    this.notification.push(notification);

    return notification;
  }
}
