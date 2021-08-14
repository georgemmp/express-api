import FakeUserRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let userRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    listProvidersService = new ListProvidersService(userRepository);
  });

  it('should be able to list providers', async () => {
    const user1 = await userRepository.create({
      email: 'test1@mail.com',
      name: 'Test1',
      password: '123456',
    });

    const user2 = await userRepository.create({
      email: 'test2@mail.com',
      name: 'Test2',
      password: '123456',
    });

    const user = await userRepository.create({
      email: 'george@mail.com',
      name: 'George',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      userId: user.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
