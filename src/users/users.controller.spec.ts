import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: any;
  let mockUser: any;

  beforeEach(async () => {
    mockUser = {
      safe: jest.fn()
    };

    mockUsersService = {
      create: jest.fn().mockReturnValue(mockUser)
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      emailAddress: 'joe@fake.com',
      plaintextPassword: 'p@ssw0rd!'
    };
    await controller.create(dto);
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    expect(mockUser.safe).toHaveBeenCalled();
  });
});
