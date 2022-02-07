import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, USER_ROLES } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepo: any;
  let mockPasswordService: any;
  let mockHash: string;
  let mockUser: Partial<IUser>;

  beforeEach(async () => {
    mockHash = 'abc123!';
    mockUser = {
      passwordHash: mockHash,
      emailAddress: 'joe@fake.com',
      handle: 'Mr. Joe',
      roles: [USER_ROLES.USER],
      safe: jest.fn(),
    };
    mockUsersRepo = {
      create: jest.fn().mockReturnValue(mockUser),
      findByEmailAddress: jest.fn().mockReturnValue(mockUser),
    };
    mockPasswordService = {
      generateHash: jest.fn().mockReturnValue(mockHash),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: UserRepository, useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user', async () => {
    const dto: CreateUserDto = {
      emailAddress: 'bob@fake.com',
      plaintextPassword: 'p@ssw0rd!',
      handle: 'handle1',
      roles: [USER_ROLES.USER],
    };

    await service.create(dto);

    expect(mockPasswordService.generateHash).toHaveBeenCalledWith(
      dto.plaintextPassword,
    );
    expect(mockUsersRepo.create).toHaveBeenCalledWith({
      emailAddress: dto.emailAddress,
      passwordHash: mockHash,
      handle: 'handle1',
      roles: [USER_ROLES.USER],
    });
  });

  it('finds by email address', async () => {
    const emailAddress = 'bob@fake.com';
    await service.findByEmailAddress(emailAddress);
    expect(mockUsersRepo.findByEmailAddress).toHaveBeenCalledWith(emailAddress);
  });
});
