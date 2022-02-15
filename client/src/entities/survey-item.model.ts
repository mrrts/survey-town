import { SurveyItemType } from "../constants/SurveyItemType.enum";

export interface ISurveyItem {
  prompt?: string;
  content?: string;
  choices?: string[];
  author: string;
  itemType: SurveyItemType;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SurveyItem implements ISurveyItem {
  prompt?: string;
  content?: string;
  choices?: string[];
  author: string;
  itemType: SurveyItemType;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(json: ISurveyItem) {
    this.prompt = json?.prompt;
    this.content = json?.content;
    this.choices = json?.choices;
    this.author = json?.author;
    this.itemType = json?.itemType;
    this.uuid = json?.uuid;
    this.createdAt = new Date(json?.createdAt);
    this.updatedAt = new Date(json?.updatedAt);
  }
}