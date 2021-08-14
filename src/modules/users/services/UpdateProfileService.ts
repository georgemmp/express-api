import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface Request {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    oldPassword,
    password,
  }: Request): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const existsEmail = await this.userRepository.findByEmail(email);

    if (existsEmail && existsEmail.id !== userId) {
      throw new AppError('E-mail already in use');
    }
    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError('You need to inform the old password');
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHsh(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}
