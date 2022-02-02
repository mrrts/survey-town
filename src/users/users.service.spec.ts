import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepo: any;
  let mockPasswordService: any;
  let mockHash: string;

  beforeEach(async () => {
    mockHash = 'abc123!';
    mockUsersRepo = {
      create: jest.fn(),
      findByEmailAddress: jest.fn()
    };
    mockPasswordService = {
      generateHash: jest.fn().mockReturnValue(mockHash)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: UserRepository, useValue: mockUsersRepo }
      ],
    })
    .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user', async () => {
    const dto: CreateUserDto = {
      emailAddress: 'bob@fake.com',
      plaintextPassword: 'p@ssw0rd!'
    };

    await service.create(dto);

    expect(mockPasswordService.generateHash).toHaveBeenCalledWith(dto.plaintextPassword);
    expect(mockUsersRepo.create).toHaveBeenCalledWith({
      emailAddress: dto.emailAddress,
      passwordHash: mockHash
    });
  });

  it('finds by email address', async () => {
    const emailAddress = 'bob@fake.com';
    await service.findByEmailAddress(emailAddress);
    expect(mockUsersRepo.findByEmailAddress).toHaveBeenCalledWith(emailAddress);
  });
});
