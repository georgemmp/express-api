import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import { uuid } from 'uuidv4';
import UserToken from '../../entities/UserToken';

class FakeUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  async generate(userId: string): Promise<UserToken> {
    const token = new UserToken();

    Object.assign(token, {
      id: uuid(),
      userId,
      token: uuid(),
      createdAt: new Date(),
    });

    this.userTokens.push(token);

    return token;
  }

  async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(item => item.token === token);

    return userToken;
  }
}

export default FakeUserTokenRepository;
