import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let userRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();

    fakeHashProvider = new FakeHashProvider();

    authUserService = new AuthenticateUserService(
      userRepository,
      fakeHashProvider,
    );

    createUserService = new CreateUserService(userRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await createUserService.execute({
      name: 'Jhonny Blade',
      email: 'jhonny@mail.com',
      password: '123456',
    });

    const response = await authUserService.execute({
      email: 'jhonny@mail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    expect(
      authUserService.execute({
        email: 'jhonny@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      name: 'Jhonny Blade',
      email: 'jhonny@mail.com',
      password: '123456',
    });

    expect(
      authUserService.execute({
        email: 'jhonny@mail.com',
        password: 'error123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
