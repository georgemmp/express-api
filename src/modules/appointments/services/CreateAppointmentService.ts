import { injectable, inject } from 'tsyringe';
import { format, getHours, isBefore, startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointmet from '../infra/typeorm/entities/Appointments';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import INotificationRepository from '../../notifications/repositories/INotificationRepository';

interface Request {
  providerId: string;
  userId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  public async execute({
    providerId,
    date,
    userId,
  }: Request): Promise<Appointmet> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You do not can create an appointment in past date');
    }

    if (userId === providerId) {
      throw new AppError('You do not can create an appointment with yourself');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = await this.appointmentRepository.create({
      providerId,
      userId,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationRepository.create({
      recipientId: providerId,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
