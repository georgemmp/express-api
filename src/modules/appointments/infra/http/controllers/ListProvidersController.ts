import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ListProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const service = container.resolve(ListProvidersService);

    const providers = await service.execute({
      userId,
    });

    return response.json(providers);
  }
}
