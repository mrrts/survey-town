import { CreateSurveyDto, ICreateSurveyDto } from "./create-survey.dto";

export interface IUpdateSurveyDto extends ICreateSurveyDto {}

export class UpdateSurveyDto extends CreateSurveyDto {}