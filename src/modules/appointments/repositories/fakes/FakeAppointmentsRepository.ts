import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';
import IFindAllInMonthFromProviderDTO from '../../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../../dtos/IFindAllInDayFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(item =>
      isEqual(item.date, date),
    );

    return appointment;
  }

  public async create({
    providerId,
    userId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid, date, providerId, userId });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointment = this.appointments.filter(
      item =>
        item.providerId === providerId &&
        getMonth(item.date) + 1 === month &&
        getYear(item.date) === year,
    );

    return appointment;
  }

  public async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointment = this.appointments.filter(
      item =>
        item.providerId === providerId &&
        getDate(item.date) === day &&
        getMonth(item.date) + 1 === month &&
        getYear(item.date) === year,
    );

    return appointment;
  }
}

export default FakeAppointmentsRepository;
