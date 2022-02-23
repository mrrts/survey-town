import { Test, TestingModule } from '@nestjs/testing';
import { CreateResponseDto } from './dto/create-response.dto';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyItemDto } from './dto/update-survey-item.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ResponseType } from './entities/response.entity';
import { SurveyItemType } from './entities/survey-item.entity';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';

describe('SurveysController', () => {
  let controller: SurveysController;
  let mockSurveysService: any;
  let mockSession: any;
  let responseSafeFn: any;
  const surveyId = 'uuid1234';
  const itemId = 'item1234';
  const userId = 'uuid1'

  beforeEach(async () => {
    mockSession = {
      _user: {
        uuid: userId,
        emailAddress: 'joe@fake.com',
      },
    };

    responseSafeFn = jest.fn();

    mockSurveysService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      removeSurveyItem: jest.fn(),
      updateSurveyItem: jest.fn(),
      createSurveyItem: jest.fn(),
      findAllResponsesForSurvey: jest.fn().mockReturnValue([
        { safe: responseSafeFn }, { safe: responseSafeFn }
      ]),
      createResponse: jest.fn(),
      findAllResponsesForUserAndSurvey: jest.fn(),
      removeAllResponsesForUserAndSurvey: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveysController],
      providers: [{ provide: SurveysService, useValue: mockSurveysService }],
    }).compile();

    controller = module.get<SurveysController>(SurveysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a survey', async () => {
    const dto: CreateSurveyDto = {
      title: 'title1',
      description: 'desc1',
    };

    await controller.create(dto, mockSession._user.uuid);

    expect(mockSurveysService.create).toHaveBeenCalledWith(
      dto,
      mockSession._user.uuid,
    );
  });

  it('finds all surveys', async () => {
    await controller.findAll();

    expect(mockSurveysService.findAll).toHaveBeenCalledTimes(1);
  });

  it('finds one survey', async () => {
    await controller.findOne(surveyId);

    expect(mockSurveysService.findOne).toHaveBeenCalledWith(surveyId);
  });

  it('deletes a survey', async () => {
    await controller.remove(surveyId, mockSession._user.uuid);
    expect(mockSurveysService.remove).toHaveBeenCalledWith(surveyId, mockSession._user.uuid);
  });

  it('updates a survey', async () => {
    const dto: UpdateSurveyDto = {
      title: 'new_title',
      description: 'desc2'
    };

    await controller.update(surveyId, dto, userId);

    expect(mockSurveysService.update).toHaveBeenCalledWith(surveyId, dto, userId);
  });

  it('creates a survey item', async () => {
    const dto: CreateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1',
    };

    await controller.createSurveyItem(surveyId, dto, mockSession._user.uuid);

    expect(mockSurveysService.createSurveyItem).toHaveBeenCalledWith(
      dto,
      surveyId,
      mockSession._user.uuid,
    );
  });

  it('updates a survey item', async () => {
    const dto: UpdateSurveyItemDto = {
      itemType: SurveyItemType.FREE_RESPONSE,
      prompt: 'new_prompt?'
    };

    await controller.updateSurveyItem(
      surveyId,
      itemId,
      mockSession._user.uuid,
      dto
    );

    expect(mockSurveysService.updateSurveyItem).toHaveBeenCalledWith(
      dto,
      surveyId,
      itemId,
      mockSession._user.uuid
    );
  });

  it('deletes a surveyItem', async () => {
    await controller.removeSurveyItem(surveyId, itemId, userId);

    expect(mockSurveysService.removeSurveyItem).toHaveBeenCalledWith(
      surveyId,
      itemId,
      userId
    );
  });

  it('gets a survey\'s responses', async () => {
    await controller.getSurveyResponses(surveyId);

    expect(mockSurveysService.findAllResponsesForSurvey).toHaveBeenCalledWith(
      surveyId
    );

    expect(responseSafeFn).toHaveBeenCalledTimes(2);
  });

  it('creates a response to a survey item', async () => {
    const dto: CreateResponseDto = {
      responseType: ResponseType.FREE_RESPONSE_RESPONSE,
      freeResponse: 'resp123'
    };

    await controller.createResponse(dto, surveyId, itemId, userId);

    expect(mockSurveysService.createResponse).toHaveBeenCalledWith(
      dto,
      surveyId,
      itemId,
      userId
    );
  });

  it('gets my own responses to a survey', async () => {
    await controller.getOwnResponsesForSurvey(surveyId, userId);

    expect(mockSurveysService.findAllResponsesForUserAndSurvey).toHaveBeenCalledWith(
      surveyId,
      userId
    );
  });

  it('deletes my own responses for a survey', async () => {
    await controller.removeOwnResponsesForSurvey(surveyId, userId);

    expect(mockSurveysService.removeAllResponsesForUserAndSurvey).toHaveBeenCalledWith(
      surveyId,
      userId
    );
  });
});
