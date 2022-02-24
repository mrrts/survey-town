import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateSurveyDto } from "../dto/create-survey.dto";
import { UpdateSurveyDto } from "../dto/update-survey.dto";
import { ISurvey, Survey } from "../entities/survey.entity";
import { SurveyRepository } from "./survey.repository";

describe('SurveyRepository', () => {
  let repo: SurveyRepository;
  let mockModel: any;
  let executableQuery: any;
  const surveyId = 'survey123';

  beforeEach(async () => {
    executableQuery = { exec: jest.fn().mockReturnValue(Promise.resolve('result1')) };
    mockModel = {
      find: jest.fn().mockReturnValue(executableQuery),
      findOne: jest.fn().mockReturnValue(executableQuery),
      deleteOne: jest.fn().mockReturnValue(executableQuery),
      updateOne: jest.fn().mockReturnValue(executableQuery),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyRepository,
        { provide: getModelToken(Survey.modelName), useValue: mockModel }
      ],
    }).compile();

    repo = module.get<SurveyRepository>(SurveyRepository);
  });

  it('should be defined', () => {
    expect(repo).toBeTruthy();
  });

  it('finds all', async () => {
    const result = await repo.findAll();
    expect(mockModel.find).toHaveBeenCalledTimes(1);
    expect(result).toBe('result1');
  });

  it('finds one', async () => {
    const result = await repo.findOne(surveyId);
    expect(mockModel.findOne).toHaveBeenCalledWith({ uuid: surveyId });
    expect(result).toBe('result1');
  });

  it('creates with author', async () => {
    // re-mock the model as a class since this method uses constructor

    const save = jest.fn();
    class MockSurvey {
      data: any;
      constructor(data: any) {
        this.data = data;
      }
      save() {
        return save.mockReturnValue(this)();
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyRepository,
        { provide: getModelToken(Survey.modelName), useValue: MockSurvey }
      ]
    }).compile();

    repo = module.get<SurveyRepository>(SurveyRepository);

    const dto: CreateSurveyDto = {
      title: 'title1',
      description: 'desc1'
    };

    const result: any = await repo.createWithAuthor(dto, 'user123');

    expect(result).toBeInstanceOf(MockSurvey);
    expect(result.data.title).toBe('title1');
    expect(result.data.description).toBe('desc1');
    expect(result.data.author).toBe('user123');
    expect(save).toHaveBeenCalled();
  });

  it('removes one', async () => {
    executableQuery.exec.mockReturnValue(Promise.resolve({ deletedCount: 1 }));
    const result = await repo.remove(surveyId);
    expect(result).toBe(true);
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ uuid: surveyId });
  });

  it('removes one -- failure deleting', async () => {
    executableQuery.exec.mockReturnValue(Promise.resolve({ deletedCount: 0 }));
    const result = await repo.remove(surveyId);
    expect(result).toBe(false);
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ uuid: surveyId });
  });

  it('updates one', async () => {
    jest.spyOn(repo, 'findOne').mockReturnValue('result2' as any);

    const dto: UpdateSurveyDto = {
      title: 'title2',
      description: 'desc2'
    };
    const result = await repo.update(surveyId, dto);
    expect(mockModel.updateOne).toHaveBeenCalledWith({ uuid: surveyId }, { $set: { ...dto, updatedAt: expect.any(Date) }});
    expect(repo.findOne).toHaveBeenCalledWith(surveyId);
    expect(result).toBe('result2');
  });

  it('adds an item', async () => {
    jest.spyOn(repo, 'findOne').mockReturnValue('result2' as any);

    const result = await repo.addItem(surveyId, 'item1');
    expect(mockModel.updateOne).toHaveBeenCalledWith(
      { uuid: surveyId },
      { $push: { surveyItems: 'item1' }, updatedAt: expect.any(Date)}
    );

    expect(result).toBe('result2');
  });
  
  it('removes an item', async () => {
    jest.spyOn(repo, 'findOne').mockReturnValue('result2' as any);

    const result = await repo.removeItem(surveyId, 'item1');
    expect(mockModel.updateOne).toHaveBeenCalledWith(
      { uuid: surveyId },
      { $pull: { surveyItems: 'item1' }, updatedAt: expect.any(Date) }
    );

    expect(result).toBe('result2');
  });
});