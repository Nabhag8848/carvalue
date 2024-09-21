import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // fake copy of user service
    const fakeUserService: Partial<UsersService> = {
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
});
