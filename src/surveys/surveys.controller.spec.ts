import { Test, TestingModule } from '@nestjs/testing';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyItemType } from './entities/survey-item.entity';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';

describe('SurveysController', () => {
  let controller: SurveysController;
  let mockSurveysService: any;
  let mockSession: any;

  beforeEach(async () => {
    mockSession = {
      _user: {
        uuid: 'uuid1',
        emailAddress: 'joe@fake.com'
      }
    };

    mockSurveysService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      createSurveyItem: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveysController],
      providers: [
        { provide: SurveysService, useValue: mockSurveysService }        
      ],
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
      responsesPublic: true
    };

    await controller.create(dto, mockSession);

    expect(mockSurveysService.create).toHaveBeenCalledWith(dto, mockSession._user.uuid);
  });

  it('finds all surveys', async () => {
    await controller.findAll();

    expect(mockSurveysService.findAll).toHaveBeenCalledTimes(1);
  });

  it('finds one survey', async () => {
    const surveyId = 'uuid1234';

    await controller.findOne(surveyId);

    expect(mockSurveysService.findOne).toHaveBeenCalledWith(surveyId);
  });

  it('creates a survey item', async () => {
    const surveyId = 'uuid1234';
    const dto: CreateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1'
    };
    const session: any = {
      _user: { uuid: 'user1234' }
    };

    await controller.createSurveyItem(surveyId, dto, session);

    expect(mockSurveysService.createSurveyItem).toHaveBeenCalledWith(dto, surveyId, session._user.uuid);
  });
});
