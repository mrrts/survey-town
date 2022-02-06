export enum SurveyResponseType {
  FREE_RESPONSE_RESPONSE = 'FREE_RESPONSE_RESPONSE',
  MULTIPLE_CHOICE_RESPONSE = 'MULTIPLE_CHOICE_RESPONSE',
  MULTIPLE_SELECT_RESPONSE = 'MULTIPLE_SELECT_RESPONSE'
}

export interface ISurveyResponse {
  selection?: string;
  selections?: string[];
  survey: string;
  surveyItem: string;
  responseType: SurveyResponseType;
  user: string;
  uuid: string;
  createdAt: Date;
}

export class SurveyResponse implements ISurveyResponse {
  selection?: string;
  selections?: string[];
  survey: string;
  surveyItem: string;
  responseType: SurveyResponseType;
  user: string;
  uuid: string;
  createdAt: Date;

  constructor(json: ISurveyResponse) {
    this.selection = json?.selection;
    this.selections = json?.selections;
    this.survey = json?.survey;
    this.surveyItem = json?.surveyItem;
    this.responseType = json?.responseType;
    this.user = json?.user;
    this.uuid = json?.uuid;
    this.createdAt = new Date(json?.createdAt);
  }
}