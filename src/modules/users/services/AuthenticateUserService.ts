import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface AuthDTO {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Response {
  user: UserResponse;
  token: string;
}

@injectable()
export default class AuthService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: AuthDTO): Promise<Response> {
    const userData = await this.userRepository.findByEmail(email);

    if (!userData) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatch = await this.hashProvider.compareHsh(
      password,
      userData.password,
    );

    if (!passwordMatch) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: userData.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    const user: UserResponse = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return { user, token };
  }
}
