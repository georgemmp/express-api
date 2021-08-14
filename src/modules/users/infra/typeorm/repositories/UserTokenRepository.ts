import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';

class UsertTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  async generate(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ userId });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({ token });

    return userToken;
  }
}

export default UsertTokenRepository;
