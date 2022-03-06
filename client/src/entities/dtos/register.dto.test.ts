import { RegisterDto } from "./register.dto";

describe('RegisterDto', () => {
  it('constructs from an object', () => {
    const json = {
      emailAddress: 'email@fake.com',
      handle: 'Handle_1',
      plaintextPassword: 'p@ssw0rd1!'
    };

    const dto = new RegisterDto(json);

    expect(dto.emailAddress).toBe('email@fake.com');
    expect(dto.handle).toBe('Handle_1');
    expect(dto.plaintextPassword).toBe('p@ssw0rd1!');
  });
});