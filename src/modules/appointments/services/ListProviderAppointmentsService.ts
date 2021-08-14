import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';

interface UserDTO {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppoiRepository')
    private appointmentRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: UserDTO): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findAllInDayFromProvider(
      {
        providerId,
        day,
        month,
        year,
      },
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;
