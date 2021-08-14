import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let userRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(userRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'George',
      email: 'george@mail.com',
      password: '1234560',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an existing email in database', async () => {
    await createUserService.execute({
      name: 'George',
      email: 'george@mail.com',
      password: '1234560',
    });

    await expect(
      createUserService.execute({
        name: 'George',
        email: 'george@mail.com',
        password: '1234560',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
