import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface Request {
  providerId: string;
  month: number;
  year: number;
  day: number;
}

type Response = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    providerId,
    month,
    year,
    day,
  }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        providerId,
        year,
        month,
        day,
      },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
