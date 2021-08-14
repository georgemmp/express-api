import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class UserController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const service = container.resolve(ShowProfileService);

    const user = await service.execute({
      userId,
    });

    return response.status(200).json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { name, email, oldPassword, password } = request.body;

    const service = container.resolve(UpdateProfileService);

    const user = await service.execute({
      userId,
      name,
      email,
      oldPassword,
      password,
    });

    return response.status(204).json(classToClass(user));
  }
}
