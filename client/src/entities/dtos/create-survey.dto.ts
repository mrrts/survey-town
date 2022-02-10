export interface ICreateSurveyDto {
  title: string;
  description: string;
}

export class CreateSurveyDto implements ICreateSurveyDto {
  title: string;
  description: string;

  constructor(json: ICreateSurveyDto) {
    this.title = json?.title;
    this.description = json?.description;
  }
}