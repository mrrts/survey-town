import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;
  const password: string = 'p@ssw0rd_123!';
  let mockBcrypt: any;

  beforeEach(async () => {
    mockBcrypt = {
      hash: jest.fn(),
      compare: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        { provide: 'BCRYPT', useValue: mockBcrypt }
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generates a password hash', async () => {
    mockBcrypt.hash.mockReturnValue(Promise.resolve('hash1'));
    const result = await service.generateHash(password);

    expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 12);
    expect(result).toBe('hash1');
  });

  it('validates a password against a hash', async () => {
    mockBcrypt.compare.mockReturnValue(Promise.resolve(true));
    const result = await service.validatePassword(password, 'hash1');
    
    expect(mockBcrypt.compare).toHaveBeenCalledWith(password, 'hash1');
    expect(result).toBe(true);
  });
});
