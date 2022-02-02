import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;
  const password: string = 'p@ssw0rd_123!';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generates a password hash', async () => {
    const hash = await service.generateHash(password);
    expect(hash.length > 30).toBeTruthy();
    expect(hash).not.toEqual(password);
    expect(hash.includes(password)).toBeFalsy();
  });

  it('validates a password against a hash', async () => {
    const hash = await service.generateHash(password);
    expect(await service.validatePassword(password, hash)).toBe(true);
    expect(await service.validatePassword('wrongPW', hash)).toBe(false);
  });
});
