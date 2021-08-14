import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let userRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      userRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'George',
      email: 'george@mail.com',
    });

    expect(updatedUser.name).toBe('George');
    expect(updatedUser.email).toBe('george@mail.com');
  });

  it('should be able to change to another user email', async () => {
    await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    const user = await userRepository.create({
      email: 'teste1@mail.com',
      name: 'Teste1',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'George',
        email: 'teste@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'George',
      email: 'teste@mail.com',
      oldPassword: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update user password', async () => {
    const user = await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'George',
        email: 'teste@mail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong old password', async () => {
    const user = await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'George',
        email: 'george@mail.com',
        oldPassword: '321321',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile from non existing user', async () => {
    expect(
      updateProfileService.execute({
        userId: 'asd',
        name: 'George',
        email: 'george@mail.com',
      }),
    ).rejects.toBe(AppError);
  });
});
