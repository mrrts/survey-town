import { CreateSurveyItemDto } from '../../entities/dtos/create-survey-item.dto';
import { CreateSurveyDto } from '../../entities/dtos/create-survey.dto';
import { CreateResponseDto } from '../../entities/dtos/create-response.dto';
import { ISurveyDto, SurveyDto } from '../../entities/dtos/survey.dto';
import { UpdateSurveyItemDto } from '../../entities/dtos/update-survey-item.dto';
import { UpdateSurveyDto } from '../../entities/dtos/update-survey.dto';
import { ISurveyResponse, SurveyResponse } from '../../entities/survey-response.model';
import * as httpUtil from '../../util/http.util';

export const fetchSurveys = async () => {
  const dtos = await httpUtil.get<ISurveyDto[]>('/surveys');
  return dtos.map((dto: ISurveyDto) => new SurveyDto(dto));
}

export const fetchOwnResponsesForSurvey = async (surveyId: string) => {
  const urlPath = `/surveys/${surveyId}/own-responses`;
  const responses = await httpUtil.get<ISurveyResponse[]>(urlPath);
  return responses.map((dto: ISurveyResponse) => new SurveyResponse(dto));
}

export const postSurvey = async (dto: CreateSurveyDto) => {
  const resp = await httpUtil.post<CreateSurveyDto, ISurveyDto>('/surveys', dto);
  return new SurveyDto(resp);
}

export const patchSurvey = async (surveyId: string, dto: UpdateSurveyDto) => {
  const urlPath = `/surveys/${surveyId}`;
  const resp = await httpUtil.patch<UpdateSurveyDto, ISurveyDto>(urlPath, dto);
  return new SurveyDto(resp);
}

export const postSurveyItem = async (surveyId: string, dto: CreateSurveyItemDto) => {
  const urlPath = `/surveys/${surveyId}/items`;
  const resp = await httpUtil.post<CreateSurveyItemDto, ISurveyDto>(urlPath, dto);
  return new SurveyDto(resp);
}

export const patchSurveyItem = async (surveyId: string, surveyItemId: string, dto: UpdateSurveyItemDto) => {
  const urlPath = `/surveys/${surveyId}/items/${surveyItemId}`;
  const resp = await httpUtil.patch<UpdateSurveyItemDto, ISurveyDto>(urlPath, dto);
  return new SurveyDto(resp);
}

export const postResponse = async (surveyId: string, surveyItemId: string, dto: CreateResponseDto) => {
  const urlPath = `/surveys/${surveyId}/items/${surveyItemId}/responses`;
  const resp = await httpUtil.post<CreateResponseDto, ISurveyResponse>(urlPath, dto);
  return new SurveyResponse(resp);
}

export const deleteOwnResponsesForSurvey = async (surveyId: string) => {
  const urlPath = `/surveys/${surveyId}/own-responses`;
  await httpUtil._delete<void>(urlPath);
  return null;
}