import { Test, TestingModule } from '@nestjs/testing';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { ISurveyItem, SurveyItemType } from './entities/survey-item.entity';
import { ISurvey } from './entities/survey.entity';
import { ResponseRepository } from './repositories/response.repository';
import { SurveyItemRepository } from './repositories/survey-item.repository';
import { SurveyRepository } from './repositories/survey.repository';
import { SurveysService } from './surveys.service';

describe('SurveysService', () => {
  let service: SurveysService;
  let mockSurveyRepo: any;
  let mockSurveyItemRepo: any;
  let mockResponseRepo: any;
  let mockSurvey: ISurvey;
  let mockSurveyItem1: ISurveyItem;
  let mockSurveyItem2: ISurveyItem;
  let mockSurveyItem3: ISurveyItem;

  beforeEach(async () => {
    mockSurvey = {
      uuid: 'uuid123',
      author: 'author1',
      title: 'title1',
      createdAt: new Date(),
      updatedAt: new Date(),
      description: 'description1',
      responsesPublic: true,
      surveyItems: ['item-uuid-1', 'item-uuid-2', 'item-uuid-3'],
    };

    mockSurveyItem1 = {
      uuid: 'item-uuid-1',
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1',
      author: 'author1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSurveyItem2 = {
      uuid: 'item-uuid-2',
      itemType: SurveyItemType.MULTIPLE_CHOICE,
      prompt: 'prompt1',
      choices: ['blue', 'red', 'green'],
      author: 'author1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSurveyItem3 = {
      uuid: 'item-uuid-3',
      itemType: SurveyItemType.MULTIPLE_SELECT,
      prompt: 'prompt1',
      choices: ['blue', 'red', 'green'],
      author: 'author1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSurveyRepo = {
      createWithAuthor: jest.fn().mockReturnValue(mockSurvey),
      findOne: jest.fn().mockReturnValue(mockSurvey),
      addItem: jest.fn(),
      findAll: jest.fn().mockReturnValue([mockSurvey]),
    };

    mockSurveyItemRepo = {
      findMultiple: jest.fn().mockReturnValue([
        mockSurveyItem2, // return out of order to test proper sorting
        mockSurveyItem3,
        mockSurveyItem1,
      ]),
      createWithAuthor: jest.fn().mockReturnValue(mockSurveyItem1),
    };

    mockResponseRepo = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveysService,
        { provide: SurveyRepository, useValue: mockSurveyRepo },
        { provide: SurveyItemRepository, useValue: mockSurveyItemRepo },
        { provide: ResponseRepository, useValue: mockResponseRepo },
      ],
    }).compile();

    service = module.get<SurveysService>(SurveysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a survey dto', async () => {
    const resultDto: SurveyDto = await service.getSurveyDto(mockSurvey.uuid);

    expect(mockSurveyRepo.findOne).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(mockSurveyItemRepo.findMultiple).toHaveBeenCalledWith(
      mockSurvey.surveyItems,
    );
    expect(resultDto).toBeInstanceOf(SurveyDto);
    expect(resultDto.survey).toMatchObject(mockSurvey);
    expect(resultDto.expandedItems).toHaveLength(3);
    // Items are sorted correctly
    expect(resultDto.expandedItems[0]).toBe(mockSurveyItem1);
    expect(resultDto.expandedItems[1]).toBe(mockSurveyItem2);
    expect(resultDto.expandedItems[2]).toBe(mockSurveyItem3);
  });

  it('creates a survey', async () => {
    const createDto: CreateSurveyDto = {
      title: 'title1',
      description: 'description1',
      responsesPublic: true,
    };

    const authorId = 'author1';

    const resultDto: SurveyDto = await service.create(createDto, authorId);

    expect(mockSurveyRepo.createWithAuthor).toHaveBeenCalledWith(
      createDto,
      authorId,
    );
    expect(resultDto).toBeInstanceOf(SurveyDto);
  });

  it('creates a survey item', async () => {
    const dto: CreateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1',
    };
    const surveyId = mockSurvey.uuid;
    const authorId = mockSurvey.author;

    const result: SurveyDto = await service.createSurveyItem(
      dto,
      surveyId,
      authorId,
    );

    expect(mockSurveyItemRepo.createWithAuthor).toHaveBeenCalledWith(
      dto,
      authorId,
    );
    expect(mockSurveyRepo.addItem).toHaveBeenCalledWith(
      surveyId,
      mockSurveyItem1.uuid,
    );
    expect(result).toBeInstanceOf(SurveyDto);
  });

  it('finds all surveys', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(SurveyDto);
  });

  it('finds one survey', async () => {
    const result = await service.findOne(mockSurvey.uuid);
    expect(result).toBeInstanceOf(SurveyDto);
    expect(result.survey.uuid).toBe(mockSurvey.uuid);
  });
});
