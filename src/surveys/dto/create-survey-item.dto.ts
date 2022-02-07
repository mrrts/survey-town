import { SurveyItemType } from '../entities/survey-item.entity';

export class CreateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];
}
