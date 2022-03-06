import { LoginDto } from "./login.dto";

describe('LoginDto', () => {
  it('constructs from an object', () => {
    const json = {
      emailAddress: 'email@fake.com',
      plaintextPassword: 'p@ssw0rd1!'
    };

    const dto = new LoginDto(json);

    expect(dto.emailAddress).toBe('email@fake.com');
    expect(dto.plaintextPassword).toBe('p@ssw0rd1!');
  });
});