import { SurveyItemType } from "../../constants/SurveyItemType.enum";

export interface IUpdateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];
}

export class UpdateSurveyItemDto implements IUpdateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];

  constructor(json: IUpdateSurveyItemDto) {
    this.itemType = json?.itemType;
    this.content = json?.content;
    this.prompt = json?.prompt;
    this.choices = json?.choices;
  }
}