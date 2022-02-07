import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let mockPasswordService: any;
  let mockUser: any;

  beforeEach(async () => {
    mockUser = {
      uuid: 'uuid1',
      safe: jest.fn().mockReturnValue({ uuid: 'uuid1' }),
      passwordHash: 'hash123',
    };

    mockUsersService = {
      findByEmailAddress: jest.fn().mockReturnValue(mockUser),
    };

    mockPasswordService = {
      validatePassword: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: PasswordService, useValue: mockPasswordService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login when password is correct', async () => {
    const dto: LoginDto = {
      emailAddress: 'joe@fake.com',
      plaintextPassword: 'p@ssw0rd!',
    };

    const request: any = { session: {} };

    const result = await service.login(dto, request);

    expect(mockUsersService.findByEmailAddress).toHaveBeenCalledWith(
      dto.emailAddress,
    );
    expect(mockPasswordService.validatePassword).toHaveBeenCalledWith(
      dto.plaintextPassword,
      mockUser.passwordHash,
    );
    expect(result).toEqual({ uuid: 'uuid1' });
  });

  it("should throw a 404 Not Found if the email address isn't found", async () => {
    mockUsersService.findByEmailAddress = jest.fn().mockReturnValue(null);

    const dto: LoginDto = {
      emailAddress: 'joe@fake.com',
      plaintextPassword: 'p@ssw0rd!',
    };

    const request: any = { session: {} };

    expect(() => service.login(dto, request)).rejects.toThrowError(
      new NotFoundException('User not found with email address joe@fake.com'),
    );
  });

  it('should not login when password is incorrect - 401 Unauthorized', async () => {
    const dto: LoginDto = {
      emailAddress: 'joe@fake.com',
      plaintextPassword: 'p@ssw0rd!',
    };

    const request: any = { session: {} };

    mockPasswordService.validatePassword.mockReturnValue(false);

    expect(() => service.login(dto, request)).rejects.toThrowError(
      new UnauthorizedException('Invalid credentials'),
    );
  });
});
