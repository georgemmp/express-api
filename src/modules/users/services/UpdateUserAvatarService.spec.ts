import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let userRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      userRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar user', async () => {
    const user = await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'querocafe.png',
    });

    expect(user.avatar).toEqual('querocafe.png');
  });

  it('should not be able to update avatar from non existing user', async () => {
    expect(
      updateUserAvatarService.execute({
        userId: 'not-exists',
        avatarFilename: 'querocafe.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar user when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await userRepository.create({
      email: 'teste@mail.com',
      name: 'Teste',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'querocafe.png',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: 'querocafe1.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('querocafe.png');
    expect(user.avatar).toEqual('querocafe1.png');
  });
});
