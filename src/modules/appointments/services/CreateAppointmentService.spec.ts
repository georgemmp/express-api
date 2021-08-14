import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeNotificationRepository from '@modules/notifications/infra/typeorm/repositories/fakes/FakeNotificationRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let appointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    createAppointment = new CreateAppointmentService(
      appointmentRepository,
      fakeNotificationRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      userId: '123456',
      providerId: '123',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      userId: '123456',
      providerId: '123',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        userId: '123456',
        providerId: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        userId: '123456',
        providerId: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        userId: '123456',
        providerId: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside the available schedule', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        userId: '123456',
        providerId: '12346',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        userId: '123456',
        providerId: '12346',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
