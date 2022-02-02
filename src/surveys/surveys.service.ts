import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { ISurveyItem } from './entities/survey-item.entity';
import { ISurvey } from './entities/survey.entity';
import { orderBy } from 'lodash';
import { SurveyRepository } from './repositories/survey.repository';
import { SurveyItemRepository } from './repositories/survey-item.repository';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { ResponseRepository } from './repositories/response.repository';

@Injectable()
export class SurveysService {
  constructor(
    private surveyRepository: SurveyRepository,
    private surveyItemRepository: SurveyItemRepository,
    private responseRepository: ResponseRepository
  ) {}

  async getSurveyDto(uuid: string): Promise<SurveyDto> {
    const survey: ISurvey = await this.surveyRepository.findOne(uuid);

    if (!survey) { return null; }

    const items: ISurveyItem[] = await this.surveyItemRepository.findMultiple(survey.surveyItems);
    const dto: SurveyDto = new SurveyDto();
    dto.survey = survey;
    dto.expandedItems = orderBy(items, ((item: ISurveyItem) => {
      return survey.surveyItems.indexOf(item.uuid);
    }));
    return dto;
  }

  async create(createSurveyDto: CreateSurveyDto, authorId: string): Promise<SurveyDto> {
    const savedSurvey = await this.surveyRepository.createWithAuthor(createSurveyDto, authorId);
    return this.getSurveyDto(savedSurvey.uuid);
  }

  async createSurveyItem(dto: CreateSurveyItemDto, surveyId: string, authorId: string): Promise<SurveyDto> {
    const item: ISurveyItem = await this.surveyItemRepository.createWithAuthor(dto, authorId);
    await this.surveyRepository.addItem(surveyId, item.uuid);
    return this.getSurveyDto(surveyId);
  }

  async findAll(): Promise<SurveyDto[]> {
    const allSurveys: ISurvey[] = await this.surveyRepository.findAll();
    const dtos: Promise<SurveyDto>[] = allSurveys.map((survey: ISurvey) => {
      return this.getSurveyDto(survey.uuid);
    });
    return Promise.all(dtos);
  }

  findOne(id: string): Promise<SurveyDto> {
    return this.getSurveyDto(id);
  }

  // update(id: string, updateSurveyDto: UpdateSurveyDto) {
  //   return `This action updates a #${id} survey`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} survey`;
  // }
}
