import { ISurveyItem } from "../entities/survey-item.entity";
import { ISurvey } from "../entities/survey.entity";

export class SurveyDto {
  survey: ISurvey;
  expandedItems: ISurveyItem[];
  userHasTaken: boolean;
}