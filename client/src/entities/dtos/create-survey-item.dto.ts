import { SurveyItemType } from "../../constants/SurveyItemType.enum";

export interface ICreateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];
}