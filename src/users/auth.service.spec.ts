import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    // fake copy of user service
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const { password } = await service.signup('company@gmail.com', 'qwerty#20');
    expect(password).not.toEqual('qwerty#20');
    const [salt, hash] = password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signups with email that is being used', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'other@gmail.com', password: 'notapassword' } as User,
      ]);

    await expect(
      service.signup('other@gmail.com', 'otherpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if user signin with unused email', async () => {
    await expect(service.signin('new@gmail.com', 'password')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'fake@gmail.com', password: 'password' } as User,
      ]);

    await expect(
      service.signup('fake@gmail.com', 'otherpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns user if correct credentials are provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'fake@gmail.com',
          password:
            'b6631c90899282da.464c755f065c0c6de79407b26e266ac21ca729a4bd7cb54102a097a69f86936f',
        } as User,
      ]);

    const user = await service.signin('fake@gmail.com', 'password');
    expect(user).toBeDefined();
  });
});
