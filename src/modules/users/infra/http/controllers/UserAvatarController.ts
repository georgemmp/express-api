import { container } from 'tsyringe';
import { Request, Response } from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.status(200).json(user);
  }
}
