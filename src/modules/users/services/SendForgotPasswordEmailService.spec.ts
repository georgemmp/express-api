import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../infra/typeorm/repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../infra/typeorm/repositories/fakes/FakeUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the passoword using email user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'George',
      email: 'george@mail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'george@mail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'george@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generatedToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'George',
      email: 'george@mail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'george@mail.com',
    });

    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });
});
