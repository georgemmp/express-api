import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../../entities/User';

class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  public async findAllProviders({
    exceptUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (exceptUserId) {
      users = this.users.filter(user => user.id !== exceptUserId);
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(item => item.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(item => item.email === email);

    return user;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(item => item.id === user.id);

    this.users[index] = user;

    return user;
  }
}

export default FakeUserRepository;
