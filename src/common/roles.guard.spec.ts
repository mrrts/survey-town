import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_ROLES } from '../users/entities/user.entity';
import { Roles, RolesConfig } from './roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let mockReflector: any;
  let mockExecContext: any;
  let mockRequest: any;
  let mockRolesConfig: RolesConfig;
  let guard: RolesGuard;

  beforeEach(async () => {
    mockRolesConfig = {
      requireAll: [USER_ROLES.ADMIN, USER_ROLES.USER]
    };
    mockReflector = {
      get: jest.fn().mockReturnValue(mockRolesConfig)
    };
    mockRequest = {
      session: {
        _user: {
          uuid: 'user123',
          roles: [USER_ROLES.ADMIN, USER_ROLES.USER]
        }
      }
    };
    mockExecContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest)
      })
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector }
      ]
    }).compile();
    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('activates if the user has all the required roles (requireAll configuration)', () => {
    expect(guard.canActivate(mockExecContext)).toBe(true);
  });

  it('doesn\'t activate if the user is missing one of the required roles (requireAll)', () => {
    mockRequest.session._user.roles = [USER_ROLES.USER];
    expect(guard.canActivate(mockExecContext)).toBe(false);
  });

  it('activates if the user has one of the required roles (requireOne)', () => {
    mockRolesConfig = {
      requireOne: [USER_ROLES.ADMIN, USER_ROLES.USER]
    };
    mockReflector.get = jest.fn().mockReturnValue(mockRolesConfig);
    mockRequest.session._user.roles = [USER_ROLES.USER];
    expect(guard.canActivate(mockExecContext)).toBe(true);
  });

  it('does not activate if the user has none of the listed roles (requireOne)', () => {
    mockRolesConfig = {
      requireOne: [USER_ROLES.ADMIN, USER_ROLES.USER]
    };
    mockReflector.get = jest.fn().mockReturnValue(mockRolesConfig);
    mockRequest.session._user.roles = ['otherRole1', 'otherRole2'];
    expect(guard.canActivate(mockExecContext)).toBe(false);
  });
});