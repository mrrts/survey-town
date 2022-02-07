export interface ISurvey {
  author: string;
  title: string;
  description: string;
  responsesPublic: boolean;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  surveyItems: string[];
  numberOfResponses?: number
}

export class Survey implements ISurvey {
  author: string;
  title: string;
  description: string;
  responsesPublic: boolean;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  surveyItems: string[];
  numberOfResponses?: number;

  constructor(json: ISurvey) {
    this.author = json?.author;
    this.title = json?.title;
    this.description = json?.description;
    this.responsesPublic = !!json?.responsesPublic;
    this.uuid = json?.uuid;
    this.createdAt = new Date(json?.createdAt);
    this.updatedAt = new Date(json?.updatedAt);
    this.surveyItems = json?.surveyItems;
    this.numberOfResponses = json?.numberOfResponses as number
  };
}