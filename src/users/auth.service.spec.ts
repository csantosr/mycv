import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('can create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asd@asd.com', 'test');

    expect(user.password).not.toEqual('test');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: '', password: '' } as User]);

    await expect(service.signup('asd@asd.com', 'test')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin with an unused email', async () => {
    await expect(service.signin('asd@asd.com', 'test')).rejects.toThrow(
      NotFoundException,
    );
  });
});
