import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateResponseDto } from './dto/create-response.dto';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { UpdateSurveyItemDto } from './dto/update-survey-item.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ResponseType } from './entities/response.entity';
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
      remove: jest.fn(),
      update: jest.fn()
    };

    mockSurveyItemRepo = {
      findMultiple: jest.fn().mockReturnValue([
        mockSurveyItem2, // return out of order to test proper sorting
        mockSurveyItem3,
        mockSurveyItem1,
      ]),
      findOne: jest.fn().mockReturnValue(mockSurveyItem1),
      update: jest.fn(),
      createWithAuthor: jest.fn().mockReturnValue(mockSurveyItem1),
    };

    mockResponseRepo = {
      findAllForSurvey: jest.fn().mockReturnValue([
        { user: '1' }, { user: '1' }, { user: '2' }
      ]),
      findAllForUserAndSurvey: jest.fn(),
      findForItemAndUser: jest.fn(),
      create: jest.fn(),
      removeAllForUserAndSurvey: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveysService,
        { provide: SurveyRepository, useValue: mockSurveyRepo },
        { provide: SurveyItemRepository, useValue: mockSurveyItemRepo },
        { provide: ResponseRepository, useValue: mockResponseRepo },
      ],
    }).compile();

    service = module.get<SurveysService>(SurveysService);

    jest.spyOn(service, 'validateObjectAndUser');
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
    expect(mockResponseRepo.findAllForSurvey).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(resultDto).toBeInstanceOf(SurveyDto);
    expect(resultDto.survey).toMatchObject(mockSurvey);
    expect(resultDto.expandedItems).toHaveLength(3);
    // Items are sorted correctly
    expect(resultDto.expandedItems[0]).toBe(mockSurveyItem1);
    expect(resultDto.expandedItems[1]).toBe(mockSurveyItem2);
    expect(resultDto.expandedItems[2]).toBe(mockSurveyItem3);

    expect(resultDto.numberOfResponses).toBe(2);
  });

  it('validates presence of a survey or survey item and its correct author', () => {
    expect(
      () => service.validateObjectAndUser(null, mockSurvey.author)
    ).toThrowError(NotFoundException);

    expect(
      () => service.validateObjectAndUser(mockSurvey, 'wrongUserId1')
    ).toThrowError(ForbiddenException);

    expect(
      () => service.validateObjectAndUser(mockSurvey, mockSurvey.author)
    ).not.toThrow();
  });

  it('creates a survey', async () => {
    const createDto: CreateSurveyDto = {
      title: 'title1',
      description: 'description1',
    };

    const authorId = 'author1';

    service.getSurveyDto = jest.fn().mockReturnValue('result');

    const result = await service.create(createDto, authorId);

    expect(mockSurveyRepo.createWithAuthor).toHaveBeenCalledWith(
      createDto,
      authorId,
    );
    expect(service.getSurveyDto).toHaveBeenCalledTimes(1);
    expect(result).toBe('result');
  });

  it('removes a survey', async () => {
    mockSurvey.author = 'user1';
    mockSurveyRepo.findOne.mockReturnValue(mockSurvey);
    await service.remove(mockSurvey.uuid, 'user1');
    expect(service.validateObjectAndUser).toHaveBeenCalledWith(mockSurvey, 'user1');
    expect(mockSurveyRepo.remove).toHaveBeenCalledWith(mockSurvey.uuid);
  });

  it('updates a survey', async () => {
    const dto: UpdateSurveyDto = {
      title: 'newTitle',
      description: 'newDescription'
    };

    service.getSurveyDto = jest.fn().mockReturnValue('result1');

    const result = await service.update(mockSurvey.uuid, dto, mockSurvey.author);

    expect(mockSurveyRepo.findOne).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(mockSurveyRepo.update).toHaveBeenCalledWith(mockSurvey.uuid, dto);
    expect(service.validateObjectAndUser).toHaveBeenCalledWith(mockSurvey, mockSurvey.author);
    expect(result).toBe('result1');
  });

  it('creates a survey item', async () => {
    const dto: CreateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1',
    };
    
    service.getSurveyDto = jest.fn().mockReturnValue('result1');

    const result: SurveyDto = await service.createSurveyItem(
      dto,
      mockSurvey.uuid,
      mockSurvey.author,
    );

    expect(mockSurveyRepo.findOne).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(mockSurveyItemRepo.createWithAuthor).toHaveBeenCalledWith(dto, mockSurvey.author);
    expect(mockSurveyRepo.addItem).toHaveBeenCalledWith(mockSurvey.uuid, mockSurveyItem1.uuid);
    expect(service.getSurveyDto).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(service.validateObjectAndUser).toHaveBeenCalledWith(mockSurvey, mockSurvey.author);
    expect(result).toBe('result1');
  });

  it('updates a survey item', async () => {
    const dto: UpdateSurveyItemDto = {
      itemType: SurveyItemType.FREE_RESPONSE,
      prompt: 'newPrompt1'
    };

    service.getSurveyDto = jest.fn().mockReturnValue('result1');

    const result = await service.updateSurveyItem(
      dto,
      mockSurvey.uuid,
      mockSurveyItem1.uuid,
      mockSurvey.author
    );

    expect(mockSurveyRepo.findOne).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(mockSurveyItemRepo.findOne).toHaveBeenCalledWith(mockSurveyItem1.uuid);
    expect(mockSurveyItemRepo.update).toHaveBeenCalledWith(mockSurveyItem1.uuid, dto);
    expect(service.validateObjectAndUser).toHaveBeenCalledWith(mockSurvey, mockSurvey.author);
    expect(service.validateObjectAndUser).toHaveBeenCalledWith(mockSurveyItem1, mockSurveyItem1.author);
    expect(result).toBe('result1');
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

  it('finds all responses for a survey', async () => {
    await service.findAllResponsesForSurvey(mockSurvey.uuid);
    expect(mockResponseRepo.findAllForSurvey).toHaveBeenCalledWith(mockSurvey.uuid);
  });

  it('finds all responses for user and survey', async () => {
    await service.findAllResponsesForUserAndSurvey(mockSurvey.uuid, mockSurvey.author);
    expect(mockResponseRepo.findAllForUserAndSurvey).toHaveBeenCalledWith(mockSurvey.uuid, mockSurvey.author);
  });

  describe('createResponse', () => {
    it('successfuly creates a response', async () => {
      const dto: CreateResponseDto = {
        responseType: ResponseType.MULTIPLE_SELECT_RESPONSE,
        selections: ['blue', 'green']
      };

      mockSurveyItemRepo.findOne.mockReturnValue(mockSurveyItem3);
      mockResponseRepo.findForItemAndUser.mockReturnValue([]);
  
      await service.createResponse(dto, mockSurvey.uuid, mockSurveyItem3.uuid, 'user123');
      expect(mockResponseRepo.create).toHaveBeenCalledWith(
        dto,
        mockSurvey.uuid,
        mockSurveyItem3.uuid,
        'user123'
      );
    });

    it('throws when survey not found', async () => {
      const dto: CreateResponseDto = {
        responseType: ResponseType.MULTIPLE_SELECT_RESPONSE,
        selections: ['blue', 'green']
      };

      mockSurveyRepo.findOne.mockReturnValue(null);
      mockSurveyItemRepo.findOne.mockReturnValue(mockSurveyItem3);
      mockResponseRepo.findForItemAndUser.mockReturnValue([]);

      await expect(
        () => service.createResponse(dto, mockSurvey.uuid, mockSurveyItem3.uuid, 'user123')
      ).rejects.toThrowError(NotFoundException);
    });
    
    it('throws when survey item not found', async () => {
      const dto: CreateResponseDto = {
        responseType: ResponseType.MULTIPLE_SELECT_RESPONSE,
        selections: ['blue', 'green']
      };

      mockSurveyItemRepo.findOne.mockReturnValue(null);
      mockResponseRepo.findForItemAndUser.mockReturnValue([]);

      await expect(
        () => service.createResponse(dto, mockSurvey.uuid, mockSurveyItem3.uuid, 'user123')
      ).rejects.toThrowError(NotFoundException);
    });
    
    it('throws when user has already responded', async () => {
      const dto: CreateResponseDto = {
        responseType: ResponseType.MULTIPLE_SELECT_RESPONSE,
        selections: ['blue', 'green']
      };

      mockSurveyItemRepo.findOne.mockReturnValue(mockSurveyItem3);
      mockResponseRepo.findForItemAndUser.mockReturnValue([
        {}
      ]);

      await expect(
        () => service.createResponse(dto, mockSurvey.uuid, mockSurveyItem3.uuid, 'user123')
      ).rejects.toThrowError(new ConflictException('User has already submitted a response for this survey item'));
    });
    
    it('throws when multiple-choice selection isn\'t included in item choices', async () => {
      const dto: CreateResponseDto = {
        responseType: ResponseType.MULTIPLE_CHOICE_RESPONSE,
        selection: 'orange'
      };

      mockSurveyItemRepo.findOne.mockReturnValue(mockSurveyItem2);
      mockResponseRepo.findForItemAndUser.mockReturnValue([]);

      await expect(
        () => service.createResponse(dto, mockSurvey.uuid, mockSurveyItem3.uuid, 'user123')
      ).rejects.toThrowError(new BadRequestException(`orange is not a valid selection`));
    });
    
    it('throws when one of the multiple-select selections isn\'t included in item choices', async () => {
      const dto: CreateResponseDto = {
        responseType: ResponseType.MULTIPLE_SELECT_RESPONSE,
        selections: ['blue', 'orange']
      };

      mockSurveyItemRepo.findOne.mockReturnValue(mockSurveyItem3);
      mockResponseRepo.findForItemAndUser.mockReturnValue([]);

      await expect(
        () => service.createResponse(dto, mockSurvey.uuid, mockSurveyItem3.uuid, 'user123')
      ).rejects.toThrowError(new BadRequestException(`All selections must be from the provided list of choices`));
    });
  });

  it('removes all responses for user and survey', async () => {
    await service.removeAllResponsesForUserAndSurvey(mockSurvey.uuid, mockSurvey.author);
    expect(mockSurveyRepo.findOne).toHaveBeenCalledWith(mockSurvey.uuid);
    expect(mockResponseRepo.removeAllForUserAndSurvey).toHaveBeenCalledWith(mockSurvey.uuid, mockSurvey.author);
  });

  it('removes all responses for user and survey - throws when survey not found', async () => {
    mockSurveyRepo.findOne.mockReturnValue(null);

    await expect(
      () => service.removeAllResponsesForUserAndSurvey(mockSurvey.uuid, mockSurvey.author)
    ).rejects.toThrowError(new NotFoundException());
  });
});
