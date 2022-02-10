import { CreateSurveyDto } from '../../entities/dtos/create-survey.dto';
import { ISurveyDto, SurveyDto } from '../../entities/dtos/survey.dto';
import * as httpUtil from '../../util/http.util';

export const fetchSurveys = async () => {
  const dtos = await httpUtil.get<ISurveyDto[]>('/surveys');
  return dtos.map((dto: ISurveyDto) => new SurveyDto(dto));
}

export const postSurvey = async (dto: CreateSurveyDto) => {
  const resp = await httpUtil.post<CreateSurveyDto, ISurveyDto>('/surveys', dto);
  return new SurveyDto(resp);
}