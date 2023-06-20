import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findUser: (id: number) => {
        return Promise.resolve({ id, email: '', password: '' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '' } as User]);
      },
      remove: (id: number) => {
        return Promise.resolve({ id, email: '', password: '' } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: '',
          password: '',
          ...attrs,
        } as User);
      },
    };

    fakeAuthService = {
      // signup: () => {},
      // signin: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('a@a.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@a.com');
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findUser = () => Promise.resolve(null);

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
