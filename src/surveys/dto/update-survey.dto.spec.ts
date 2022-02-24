import * as yup from 'yup';
import { UpdateSurveyDto, updateSurveyDtoSchema } from './update-survey.dto';

describe('UpdateSurveyDto', () => {
  it('accepts a valid dto', () => {
    const dto = new UpdateSurveyDto();
    dto.title = 'title1';
    dto.description = 'desc1';

    expect(
      () => updateSurveyDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires the title field', () => {
    const dto = new UpdateSurveyDto();
    dto.description = 'desc1';

    expect(
      () => updateSurveyDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('title is a required field'));
  });

  it('does not require the description field', () => {
    const dto = new UpdateSurveyDto();
    dto.title = 'title1';

    expect(
      () => updateSurveyDtoSchema.validateSync(dto)
    ).not.toThrow();
  });
});