import * as yup from 'yup';
import { RegisterDto, registerDtoSchema } from './register.dto'

describe('RegisterDto', () => {
  let dto: RegisterDto;

  beforeEach(() => {
    dto = new RegisterDto();
    dto.emailAddress = 'email@fake.com';
    dto.plaintextPassword = 'p@ssw0rd!';
    dto.handle = 'Handle_123';
  });

  it('accepts a valid object', () => {
    expect(
      () => registerDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires an email address', () => {
    dto.emailAddress = undefined;

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('emailAddress is a required field'));
    
    dto.emailAddress = 'not-email';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('emailAddress must be a valid email'));
  });

  it('requires a handle of 6-20 word characters', () => {
    dto.handle = undefined;

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle is a required field'));

    dto.handle = 'short';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle must be at least 6 characters'));
    
    dto.handle = 'longlonglonglonglonglong';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle must be at most 20 characters'));
    
    dto.handle = 'non@word!chars';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle/username must be only letters, numbers, and underscores'));
  });

  it('requires a password of 8-36 characters', () => {
    dto.plaintextPassword = undefined;

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword is a required field'));
    
    dto.plaintextPassword = '2short';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be at least 8 characters'));
    
    dto.plaintextPassword = 'TooTooTooTooTooTooTooTooTooTooTooTooLong';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be at most 36 characters'));

    dto.plaintextPassword = '$pec!@l_ch@rac+3r$';

    expect(
      () => registerDtoSchema.validateSync(dto)
    ).not.toThrow();
  });
});