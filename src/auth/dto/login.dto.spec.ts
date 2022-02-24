import * as yup from 'yup';
import { LoginDto, loginDtoSchema } from './login.dto';

describe('LoginDto', () => {
  let dto: LoginDto;

  beforeEach(() => {
    dto = new LoginDto();
    dto.emailAddress = 'email@fake.com';
    dto.plaintextPassword = 'p@ssw0rd!';
  });

  it('allows a valid object', () => {
    expect(
      () => loginDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires an email address', () => {
    dto.emailAddress = undefined;

    expect(
      () => loginDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('emailAddress is a required field'));
    
    dto.emailAddress = 'not-email';

    expect(
      () => loginDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('emailAddress must be a valid email'));
  });
  
  it('requires a password', () => {
    dto.plaintextPassword = undefined;

    expect(
      () => loginDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword is a required field'));
    
    dto.plaintextPassword = {} as any;

    expect(
      () => loginDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be a `string` type, but the final value was: `{}`.'));
  });
});