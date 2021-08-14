import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../infra/typeorm/repositories/fakes/FakeUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'George',
      email: 'george@mail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const genereateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      token,
      password: '1234567',
    });

    const userFinded = await fakeUserRepository.findById(user.id);

    expect(genereateHash).toHaveBeenCalledWith('1234567');
    expect(userFinded?.password).toBe('1234567');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'asjdkalsjd',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'not-existing-user',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'George',
      email: 'george@mail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
