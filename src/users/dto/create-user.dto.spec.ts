import * as yup from 'yup';
import { USER_ROLES } from '../entities/user.entity';
import { CreateUserDto, createUserDtoSchema } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.emailAddress = 'email@fake.com';
    dto.handle = 'Handle_1';
    dto.plaintextPassword = 'pw123456';
    dto.roles = [USER_ROLES.USER]
  });

  it('allows a valid object', () => {
    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires an email adress', () => {
    dto.emailAddress = undefined;

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('emailAddress is a required field'));

    dto.emailAddress = 'not-email';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('emailAddress must be a valid email'));
  });

  it('requires a handle of 6 to 20 word characters', () => {
    dto.handle = undefined;

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle is a required field'));

    dto.handle = 'short';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle must be at least 6 characters'));
    
    dto.handle = 'longlonglonglonglonglong';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle must be at most 20 characters'));
    
    dto.handle = 'non@word!chars';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('handle must match the following: "/^\\w+$/"'));
  });

  it('requires a password of 8 to 36 characters, allowing special characters', () => {
    dto.plaintextPassword = undefined;

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword is a required field'));
    
    dto.plaintextPassword = '2short';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be at least 8 characters'));
    
    dto.plaintextPassword = 'TooTooTooTooTooTooTooTooTooTooTooTooLong';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be at most 36 characters'));

    dto.plaintextPassword = '$pec!@l_ch@rac+3r$';

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('if present, requires roles that are of the existing defined roles', () => {
    dto.roles = undefined;

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).not.toThrow();

    dto.roles = [USER_ROLES.USER, 'otherRole'] as any;

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError(`roles[1] must be one of the following values: ${USER_ROLES.USER}, ${USER_ROLES.ADMIN}`));
    
    dto.roles = [USER_ROLES.USER, USER_ROLES.ADMIN] as any;

    expect(
      () => createUserDtoSchema.validateSync(dto)
    ).not.toThrow();
  });
});