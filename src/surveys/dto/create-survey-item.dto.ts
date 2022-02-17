import { SurveyItemType } from '../entities/survey-item.entity';
import * as yup from 'yup';
import { values } from 'lodash';

export class CreateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];
}

export const createSurveyItemDtoSchema: yup.AnySchema = yup.object({
  itemType: yup.string().oneOf(values(SurveyItemType)),
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
      return [SurveyItemType.MULTIPLE_CHOICE, SurveyItemType.MULTIPLE_SELECT].includes(itemType);
    },
    then: yup.array().of(yup.string()).min(1, 'must have at least one choice').required()
  })
});
