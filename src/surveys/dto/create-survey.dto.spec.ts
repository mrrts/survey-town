import * as yup from 'yup';
import { CreateSurveyDto, createSurveyDtoSchema } from './create-survey.dto';

describe('CreateSurveyDto', () => {

  it('accepts a valid dto', () => {
    const dto = new CreateSurveyDto();
    dto.title = 'title1';
    dto.description = 'desc1';

    expect(
      () => createSurveyDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires the title field', () => {
    const dto = new CreateSurveyDto();
    dto.description = 'desc1';

    expect(
      () => createSurveyDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('title is a required field'));
  });

  it('does not require the description field', () => {
    const dto = new CreateSurveyDto();
    dto.title = 'title1';

    expect(
      () => createSurveyDtoSchema.validateSync(dto)
    ).not.toThrow();
  });
  
});