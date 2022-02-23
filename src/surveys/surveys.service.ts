import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { ISurveyItem } from './entities/survey-item.entity';
import { ISurvey } from './entities/survey.entity';
import { orderBy } from 'lodash';
import { SurveyRepository } from './repositories/survey.repository';
import { SurveyItemRepository } from './repositories/survey-item.repository';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { ResponseRepository } from './repositories/response.repository';
import { CreateResponseDto } from './dto/create-response.dto';
import { IResponse } from './entities/response.entity';
import { keys, groupBy } from 'lodash';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { UpdateSurveyItemDto } from './dto/update-survey-item.dto';

@Injectable()
export class SurveysService {
  constructor(
    private surveyRepository: SurveyRepository,
    private surveyItemRepository: SurveyItemRepository,
    private responseRepository: ResponseRepository,
  ) {}

  async getSurveyDto(uuid: string): Promise<SurveyDto> {
    const survey: ISurvey = await this.surveyRepository.findOne(uuid);
    const items: ISurveyItem[] = await this.surveyItemRepository.findMultiple(
      survey.surveyItems,
    );
    const responses: IResponse[] =
      await this.responseRepository.findAllForSurvey(uuid);
    const responsesByUser: Record<string, IResponse[]> = groupBy(responses, 'user');
    const numUniqueResponders = keys(responsesByUser).length;
    const dto: SurveyDto = new SurveyDto();
    dto.survey = survey;
    dto.expandedItems = orderBy(items, (item: ISurveyItem) => {
      return survey.surveyItems.indexOf(item.uuid);
    });
    dto.numberOfResponses = numUniqueResponders;
    return dto;
  }

  validateObjectAndUser(surveyOrItem: ISurvey|ISurveyItem, userId: string) {
    if (!surveyOrItem) {
      throw new NotFoundException();
    }

    if (surveyOrItem?.author !== userId) {
      throw new ForbiddenException();
    }
  }

  async create(
    createSurveyDto: CreateSurveyDto,
    authorId: string,
  ): Promise<SurveyDto> {
    const savedSurvey = await this.surveyRepository.createWithAuthor(
      createSurveyDto,
      authorId,
    );
    return this.getSurveyDto(savedSurvey.uuid);
  }

  async remove(surveyId: string, userId: string): Promise<boolean> {
    const survey = await this.surveyRepository.findOne(surveyId);

    this.validateObjectAndUser(survey, userId);

    return this.surveyRepository.remove(surveyId);
  }

  async update(surveyId: string, dto: UpdateSurveyDto, userId: string): Promise<SurveyDto> {
    const survey = await this.surveyRepository.findOne(surveyId);

    this.validateObjectAndUser(survey, userId);

    const updatedSurvey = await this.surveyRepository.update(surveyId, dto);
    
    return this.getSurveyDto(surveyId);
  }

  async createSurveyItem(
    dto: CreateSurveyItemDto,
    surveyId: string,
    userId: string,
  ): Promise<SurveyDto> {
    const survey = await this.surveyRepository.findOne(surveyId);

    this.validateObjectAndUser(survey, userId);

    const item: ISurveyItem = await this.surveyItemRepository.createWithAuthor(
      dto,
      userId,
    );
    await this.surveyRepository.addItem(surveyId, item.uuid);
    return this.getSurveyDto(surveyId);
  }

  async updateSurveyItem(
    dto: UpdateSurveyItemDto,
    surveyId: string,
    surveyItemId: string,
    userId: string
  ): Promise<SurveyDto> {
    const survey = await this.surveyRepository.findOne(surveyId);
    const surveyItem = await this.surveyItemRepository.findOne(surveyItemId);

    this.validateObjectAndUser(survey, userId);
    this.validateObjectAndUser(surveyItem, userId);

    await this.surveyItemRepository.update(surveyItemId, dto);
    return this.getSurveyDto(surveyId);
  }

  async removeSurveyItem(
    surveyId: string,
    itemId: string,
    userId: string,
  ): Promise<boolean> {
    const survey = await this.surveyRepository.findOne(surveyId);

    this.validateObjectAndUser(survey, userId)

    await this.surveyRepository.removeItem(surveyId, itemId);
    return this.surveyItemRepository.removeOne(itemId);
  }

  async findAll(): Promise<SurveyDto[]> {
    const allSurveys: ISurvey[] = await this.surveyRepository.findAll();
    const dtos: Promise<SurveyDto>[] = allSurveys.map((survey: ISurvey) => {
      return this.getSurveyDto(survey.uuid);
    });
    return Promise.all(dtos);
  }

  async findOne(id: string): Promise<SurveyDto> {
    return this.getSurveyDto(id);
  }

  findAllResponsesForSurvey(surveyId: string): Promise<IResponse[]> {
    return this.responseRepository.findAllForSurvey(surveyId);
  }

  findAllResponsesForUserAndSurvey(surveyId: string, userId: string): Promise<IResponse[]> {
    return this.responseRepository.findAllForUserAndSurvey(surveyId, userId);
  }

  async createResponse(
    dto: CreateResponseDto,
    surveyId: string,
    surveyItemId: string,
    userId: string,
  ) {
    const survey = await this.surveyRepository.findOne(surveyId);
    const surveyItem = await this.surveyItemRepository.findOne(surveyItemId);
    const responsesForUser = await this.responseRepository.findForItemAndUser(
      surveyItemId,
      userId,
    );

    // don't check for ownership -- responder is a different user than the author
    if (!survey || !surveyItem) {
      throw new NotFoundException();
    }

    if (responsesForUser?.length) {
      throw new ConflictException(
        'User has already submitted a response for this survey item',
      );
    }

    // Validate the selection is included in the choices array
    if (dto.selection && !surveyItem.choices.includes(dto.selection)) {
      throw new BadRequestException(`${dto.selection} is not a valid selection`);
    }

    // Validate that all selections are included in the choices array
    if (
      dto.selections 
      && !dto.selections.every((selection: string) => 
        surveyItem.choices.includes(selection)
      )
    ) {
      throw new BadRequestException('All selections must be from the provided list of choices');
    }

    return this.responseRepository.create(dto, surveyId, surveyItemId, userId);
  }

  async removeAllResponsesForUserAndSurvey(surveyId: string, userId: string) {
    const survey = await this.surveyRepository.findOne(surveyId);

    this.validateObjectAndUser(survey, userId);

    return this.responseRepository.removeAllForUserAndSurvey(surveyId, userId);
  }

}
