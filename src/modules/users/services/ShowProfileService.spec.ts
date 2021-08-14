import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let userRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(userRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await userRepository.create({
      email: 'george@mail.com',
      name: 'George',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      userId: user.id,
    });

    expect(profile.name).toBe('George');
    expect(profile.email).toBe('george@mail.com');
  });

  it('should not be able to show profile from non existing user', async () => {
    expect(
      showProfileService.execute({
        userId: 'asd',
      }),
    ).rejects.toBe(AppError);
  });
});
