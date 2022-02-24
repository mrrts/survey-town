import * as yup from 'yup';
import { SurveyItemType } from '../entities/survey-item.entity';
import { UpdateSurveyItemDto, updateSurveyItemDtoSchema } from './update-survey-item.dto';

describe('UpdateSurveyItemDto', () => {
  it('accepts a valid CONTENT_INTERLUDE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.CONTENT_INTERLUDE;
    dto.content = 'content1';

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires the content field for a CONTENT_INTERLUDE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.CONTENT_INTERLUDE;

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('content is a required field'));
  });

  it('accepts a valid FREE_RESPONSE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.FREE_RESPONSE;
    dto.prompt = 'prompt1';

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires the prompt field for a FREE_RESPONSE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.FREE_RESPONSE;

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('prompt is a required field'));
  });

  it('accepts a valid MULTIPLE_CHOICE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.MULTIPLE_CHOICE;
    dto.prompt = 'prompt1';
    dto.choices = ['a', 'b', 'c'];

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires the prompt field for a MULTIPLE_CHOICE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.MULTIPLE_CHOICE;
    dto.choices = ['a', 'b', 'c'];
    
    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('prompt is a required field'));
  });
  
  it('requires the choices field for a MULTIPLE_CHOICE item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.MULTIPLE_CHOICE;
    dto.prompt = 'prompt1';

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('choices is a required field'));
  });
  
  it('accepts a valid MULTIPLE_SELECT item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.MULTIPLE_SELECT;
    dto.prompt = 'prompt1';
    dto.choices = ['a', 'b', 'c'];

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).not.toThrow();
  });

  it('requires the prompt field for a MULTIPLE_SELECT item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.MULTIPLE_SELECT;
    dto.choices = ['a', 'b', 'c'];
    
    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('prompt is a required field'));
  });
  
  it('requires the choices field for a MULTIPLE_SELECT item', () => {
    const dto = new UpdateSurveyItemDto();
    dto.itemType = SurveyItemType.MULTIPLE_SELECT;
    dto.prompt = 'prompt1';

    expect(
      () => updateSurveyItemDtoSchema.validateSync(dto)
    ).toThrow(new yup.ValidationError('choices is a required field'));
  });
});