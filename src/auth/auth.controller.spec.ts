import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;
  let mockUser: any;
  let mockRequest: any;
  let mockResponse: any;
  let mockJsonFn: any;

  beforeEach(async () => {
    mockUser = {
      emailAddress: 'joe@fake.com',
      uuid: 'uuid1'
    };

    mockRequest = {};

    mockJsonFn = jest.fn();

    mockResponse = {
      status: jest.fn().mockReturnValue({ json: mockJsonFn })
    };

    mockAuthService = {
      login: jest.fn().mockReturnValue(mockUser)
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    const dto: LoginDto = {
      emailAddress: 'joe@fake.com',
      plaintextPassword: 'p@ssw0rd!'
    };

    await controller.login(dto, mockResponse, mockRequest);

    expect(mockAuthService.login).toHaveBeenCalledWith(dto, mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonFn).toHaveBeenCalledWith(mockUser);
  });

  it('should respond with 401 for invalid credentials', async () => {
    const dto: LoginDto = {
      emailAddress: 'joe@fake.com',
      plaintextPassword: 'p@ssw0rd!'
    };

    mockAuthService.login.mockReturnValue(null);

    await controller.login(dto, mockResponse, mockRequest);

    expect(mockAuthService.login).toHaveBeenCalledWith(dto, mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockJsonFn).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
});
