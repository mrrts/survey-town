import { ISurveyItem, SurveyItem } from "../survey-item.model";
import { ISurvey, Survey } from "../survey.model";

export interface ISurveyDto {
  survey: ISurvey;
  expandedItems: ISurveyItem[];
  numberOfResponses: number;
}

export class SurveyDto implements ISurveyDto {
  survey: Survey;
  expandedItems: SurveyItem[];
  numberOfResponses: number;

  constructor(dtoJson: ISurveyDto) {
    this.survey = new Survey(dtoJson?.survey);
    this.expandedItems = (dtoJson?.expandedItems || [])
      .map((item: ISurveyItem) => new SurveyItem(item));
    this.numberOfResponses = +dtoJson?.numberOfResponses
  }
}