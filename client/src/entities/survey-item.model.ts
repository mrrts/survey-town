export enum SurveyItemType {
  CONTENT_INTERLUDE = 'CONTENT_INTERLUDE',
  FREE_RESPONSE = 'FREE_RESPONSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT'
}

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
    this.choices = json?.choices;
    this.author = json?.author;
    this.itemType = json?.itemType;
    this.uuid = json?.uuid;
    this.createdAt = new Date(json?.createdAt);
    this.updatedAt = new Date(json?.updatedAt);
  }
}