import * as yup from 'yup';
import { UpdateSelfDto, updateSelfDtoSchema } from './update-self.dto';

describe('UpdateSelfDto', () => {
  let dto: UpdateSelfDto;

  beforeEach(() => {
    dto = new UpdateSelfDto();
    dto.plaintextPassword = 'p@ssword123!'
  });

  it('requires a password of 8 to 36 characters', () => {
    dto.plaintextPassword = undefined;

    expect(
      () => updateSelfDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword is a required field'));
    
    dto.plaintextPassword = '2short';

    expect(
      () => updateSelfDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be at least 8 characters'));
    
    dto.plaintextPassword = 'TooTooTooTooTooTooTooTooTooTooTooTooLong';

    expect(
      () => updateSelfDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('plaintextPassword must be at most 36 characters'));

    dto.plaintextPassword = '$pec!@l_ch@rac+3r$';

    expect(
      () => updateSelfDtoSchema.validateSync(dto)
    ).not.toThrow();
  });
})