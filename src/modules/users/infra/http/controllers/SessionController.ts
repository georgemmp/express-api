import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthService from '@modules/users/services/AuthenticateUserService';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const auth = container.resolve(AuthService);

    const { user, token } = await auth.execute({ email, password });

    return response.status(201).json({ user, token });
  }
}
