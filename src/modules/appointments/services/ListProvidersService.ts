import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface UserDTO {
  userId: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ userId }: UserDTO): Promise<User[]> {
    const users = await this.userRepository.findAllProviders({
      exceptUserId: userId,
    });

    return users;
  }
}

export default ListProvidersService;
