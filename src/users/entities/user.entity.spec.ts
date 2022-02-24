import { User, userSchema } from './user.entity';
import { USER_ROLES } from './user.entity';

describe('User entity', () => {
  let data: any;

  beforeEach(() => {
    data = {
      emailAddress: 'email@fake.com',
      handle: 'handle1',
      passwordHash: 'hash1'
    };
  });

  it('assigns the passed-in data and sets default values for other fields', () => {
    const user = new User(data);

    expect(user.emailAddress).toBe(data.emailAddress);
    expect(user.handle).toBe(data.handle);
    expect(user.passwordHash).toBe(data.passwordHash);

    expect(user.uuid).toBeTruthy();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.roles).toEqual([USER_ROLES.USER]);
  });

  it('has a "safe" method to conceal passwordHash', () => {
    const user = new User(data);

    expect(user.passwordHash).toBe(data.passwordHash)
    expect(user.safe().passwordHash).not.toBe(data.passwordHash);
    expect(user.safe().passwordHash).toBeNull();
    expect(user.safe().uuid).toBe(user.uuid);
  });
});