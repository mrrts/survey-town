import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateSurveyItemDto } from "../dto/create-survey-item.dto";
import { UpdateSurveyItemDto } from "../dto/update-survey-item.dto";
import { ISurveyItem, SurveyItem, SurveyItemType } from "../entities/survey-item.entity";
import { SurveyItemRepository } from "./survey-item.repository";

describe('SurveyItemRepository', () => {
  let mockModel: any;
  let repo: SurveyItemRepository;
  let executableQuery: any;

  beforeEach(async () => {
    executableQuery = { exec: jest.fn().mockReturnValue('result1') };
    mockModel = {
      find: jest.fn().mockReturnValue(executableQuery),
      findOne: jest.fn().mockReturnValue(executableQuery),
      deleteOne: jest.fn().mockReturnValue(executableQuery),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyItemRepository,
        { provide: getModelToken(SurveyItem.modelName), useValue: mockModel }
      ]
    }).compile();

    repo = module.get<SurveyItemRepository>(SurveyItemRepository);
  });

  it('finds multiple', async () => {
    const result = await repo.findMultiple(['uuid1', 'uuid2']);

    expect(result).toBe('result1');
    expect(mockModel.find).toHaveBeenCalledWith({ uuid: { $in: ['uuid1', 'uuid2'] }});
  });

  it('finds one', async () => {
    const result = await repo.findOne('uuid1');
    expect(result).toBe('result1');
    expect(mockModel.findOne).toHaveBeenCalledWith({ uuid: 'uuid1' });
  });

  it('creates with author', async () => {
    const save = jest.fn();
    class MockModel {
      data: any;
      constructor(data: any) {
        this.data = data;
      }
      save() {
        return save.mockReturnValue(this)();
      }
    }
    const module = await Test.createTestingModule({
      providers: [
        SurveyItemRepository,
        { provide: getModelToken(SurveyItem.modelName), useValue: MockModel }
      ]
    }).compile();
    const repo = module.get(SurveyItemRepository);

    const dto: CreateSurveyItemDto = {
      itemType: SurveyItemType.FREE_RESPONSE,
      prompt: 'prompt1?'
    };

    const result: any = await repo.createWithAuthor(dto, 'author1');
    expect(result.data.itemType).toBe(SurveyItemType.FREE_RESPONSE);
    expect(result.data.prompt).toBe('prompt1?');
    expect(result.data.author).toBe('author1');
  });

  it('updates', async () => {
    const saveFn = jest.fn()
    const mockSurveyItem: ISurveyItem & { save: any } = {
      itemType: SurveyItemType.FREE_RESPONSE,
      prompt: 'prompt1',
      uuid: 'uuid1',
      author: 'author1',
      createdAt: new Date(),
      updatedAt: new Date(),
      save: saveFn.mockImplementation(() => mockSurveyItem)
    };
    const dto: UpdateSurveyItemDto = {
      itemType: SurveyItemType.FREE_RESPONSE,
      prompt: 'prompt2'
    };

    executableQuery = { exec: jest.fn().mockReturnValue(mockSurveyItem) };
    mockModel.findOne.mockReturnValue(executableQuery);

    const result = await repo.update('uuid1', dto);
    expect(mockSurveyItem.save).toHaveBeenCalled();
    expect(result.prompt).toBe('prompt2');
  });

  it('removes one', async () => {
    executableQuery = { exec: jest.fn().mockReturnValue({ deletedCount: 1 }) };
    mockModel.deleteOne.mockReturnValue(executableQuery);

    const result = await repo.removeOne('uuid1');
    
    expect(result).toBe(true);
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ uuid: 'uuid1' });
  });
})