import { ISurveyDto, SurveyDto } from '../../entities/dtos/survey.dto';
import * as httpUtil from '../../util/http.util';

export const fetchSurveys = async () => {
  const dtos = await httpUtil.get<ISurveyDto[]>('/surveys');
  return dtos.map((dto: ISurveyDto) => new SurveyDto(dto));
}