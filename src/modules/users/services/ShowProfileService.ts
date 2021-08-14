import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface UserDTO {
  userId: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ userId }: UserDTO): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('E-mail already used');
    }

    return user;
  }
}

export default ShowProfileService;
