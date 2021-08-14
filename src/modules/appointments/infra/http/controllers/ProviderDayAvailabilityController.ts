import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { month, year, day } = request.body;

    const service = container.resolve(ListProviderDayAvailabilityService);

    const availability = await service.execute({
      month,
      providerId,
      year,
      day,
    });

    return response.json(availability);
  }
}
