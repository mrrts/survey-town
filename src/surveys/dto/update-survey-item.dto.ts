import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyItemDto } from './create-survey-item.dto';
import * as yup from 'yup';
import { values, includes } from 'lodash';
import { SurveyItemType } from '../entities/survey-item.entity';

export class UpdateSurveyItemDto extends PartialType(CreateSurveyItemDto) {}

export const updateSurveyItemDtoSchema: yup.AnySchema = yup.object({
  itemType: yup.string().oneOf(values(SurveyItemType)).required(),
  content: yup.string().when(['itemType'], {
    is: (itemType: SurveyItemType) => itemType === SurveyItemType.CONTENT_INTERLUDE,
    then: yup.string().required()
  }),
  prompt: yup.string().when(['itemType'], {
    is: (itemType: SurveyItemType) => itemType !== SurveyItemType.CONTENT_INTERLUDE,
    then: yup.string().required()
  }),
  choices: yup.array().of(yup.string()).when(['itemType'], {
    is: (itemType: SurveyItemType) => {
      return includes([SurveyItemType.MULTIPLE_CHOICE, SurveyItemType.MULTIPLE_SELECT], itemType);
    },
    then: yup.array().of(yup.string()).min(1, 'must have at least one choice').required()
  })
}).required();