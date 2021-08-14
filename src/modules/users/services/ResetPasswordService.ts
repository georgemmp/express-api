import { inject, injectable } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { createdAt } = userToken;
    const compareDate = addHours(createdAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
