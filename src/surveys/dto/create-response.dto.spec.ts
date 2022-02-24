import { ResponseType } from "../entities/response.entity";
import * as yup from 'yup';
import { CreateResponseDto, createResponseDtoSchema } from "./create-response.dto";

describe('CreateResponseDto', () => {
  let data: any;

  it('accepts a valid FREE_RESPONSE_RESPONSE', () => {
    const dto = new CreateResponseDto();
    dto.responseType = ResponseType.FREE_RESPONSE_RESPONSE;
    dto.freeResponse = 'resp1';

    expect(
      () => createResponseDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires freeResponse field for FREE_RESPONSE_RESPONSE', () => {
    const dto = new CreateResponseDto();
    dto.responseType = ResponseType.FREE_RESPONSE_RESPONSE;

    expect(
      () => createResponseDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('freeResponse is a required field'));
  });

  it('accepts a valid MULTIPLE_CHOICE_RESPONSE', () => {
    const dto = new CreateResponseDto();
    dto.responseType = ResponseType.MULTIPLE_CHOICE_RESPONSE;
    dto.selection = 'a';

    expect(
      () => createResponseDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires selection field for MULTIPLE_CHOICE_RESPONSE', () => {
    const dto = new CreateResponseDto();
    dto.responseType = ResponseType.MULTIPLE_CHOICE_RESPONSE;

    expect(
      () => createResponseDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('selection is a required field'));
  });
  
  it('accepts a valid MULTIPLE_SELECT_RESPONSE', () => {
    const dto = new CreateResponseDto();
    dto.responseType = ResponseType.MULTIPLE_SELECT_RESPONSE;
    dto.selections = ['a', 'b'];

    expect(
      () => createResponseDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires selection field for MULTIPLE_SELECT_RESPONSE', () => {
    const dto = new CreateResponseDto();
    dto.responseType = ResponseType.MULTIPLE_SELECT_RESPONSE;

    expect(
      () => createResponseDtoSchema.validateSync(dto)
    ).toThrowError(new yup.ValidationError('selections is a required field'));
  });
});