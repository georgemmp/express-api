import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const service = container.resolve(CreateUserService);

    const user = await service.execute({ name, email, password });

    return response.status(201).json(user);
  }
}
