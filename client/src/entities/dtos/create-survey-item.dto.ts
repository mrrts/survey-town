import { SurveyItemType } from "../../constants/SurveyItemType.enum";

export interface ICreateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];
}

export class CreateSurveyItemDto implements ICreateSurveyItemDto {
  itemType: SurveyItemType;
  content?: string;
  prompt?: string;
  choices?: string[];

  constructor(json: ICreateSurveyItemDto) {
    this.itemType = json?.itemType;
    this.content = json?.content;
    this.prompt = json?.prompt;
    this.choices = json?.choices;
  }
}