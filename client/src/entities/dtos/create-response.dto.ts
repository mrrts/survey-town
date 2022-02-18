import { SurveyResponseType } from "../survey-response.model";

export interface ICreateResponseDto {
  responseType: SurveyResponseType;
  selection?: string;
  selections?: string[];
  freeResponse?: string;
}

export class CreateResponseDto implements ICreateResponseDto {
  responseType: SurveyResponseType;
  selection?: string;
  selections?: string[];
  freeResponse?: string;

  constructor(json: ICreateResponseDto) {
    this.responseType = json?.responseType;
    this.selection = json?.selection;
    this.selections = json?.selections;
    this.freeResponse = json?.freeResponse;
  }
}