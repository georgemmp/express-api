import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
  userId: string;
  avatarFilename: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  appointments: Appointment[];
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    userId,
    avatarFilename,
  }: Request): Promise<UserResponse> {
    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (userData.avatar) {
      await this.storageProvider.deleteFile(userData.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    userData.avatar = filename;

    await this.userRepository.save(userData);

    const user: UserResponse = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      appointments: userData.appointments,
    };

    return user;
  }
}
