import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateResponseDto } from "../dto/create-response.dto";
import { Response, ResponseType } from "../entities/response.entity";
import { ResponseRepository } from "./response.repository";

describe('ResponseRepository', () => {
  let repo: ResponseRepository;
  let executableQuery: any;
  let mockModel: any;
  const surveyId = 'survey1';
  const surveyItemId = 'surveyItem1';
  const userId = 'user1';
  const mockExecResult = 'result1';

  beforeEach(async () => {
    executableQuery = { exec: jest.fn().mockReturnValue(mockExecResult) };
    mockModel = {
      find: jest.fn().mockReturnValue(executableQuery),
      deleteMany: jest.fn().mockReturnValue(executableQuery),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseRepository,
        { provide: getModelToken(Response.modelName), useValue: mockModel }
      ]
    }).compile();

    repo = module.get<ResponseRepository>(ResponseRepository);
  });

  it('finds all', async () => {
    const result = await repo.findAll();
    expect(result).toBe(mockExecResult);
    expect(mockModel.find).toHaveBeenCalled();
  });

  it('finds all for a survey', async () => {
    const result = await repo.findAllForSurvey(surveyId);
    expect(result).toBe(mockExecResult);
    expect(mockModel.find).toHaveBeenCalledWith({ survey: surveyId });
  });

  it('finds all for a survey item', async () => {
    const result = await repo.findAllForSurveyItem(surveyItemId);
    expect(result).toBe(mockExecResult);
    expect(mockModel.find).toHaveBeenCalledWith({ surveyItem: surveyItemId });
  });

  it('finds for item and user', async () => {
    const result = await repo.findForItemAndUser(surveyItemId, userId);
    expect(result).toBe(mockExecResult);
    expect(mockModel.find).toHaveBeenCalledWith({
      surveyItem: surveyItemId,
      user: userId
    });
  });

  it('finds all for user and survey', async () => {
    const result = await repo.findAllForUserAndSurvey(surveyId, userId);
    expect(result).toBe(mockExecResult);
    expect(mockModel.find).toHaveBeenCalledWith({
      survey: surveyId,
      user: userId
    });
  });

  it('removes all for user and survey', async () => {
    const result = await repo.removeAllForUserAndSurvey(surveyId, userId);
    expect(result).toBe(mockExecResult);
    expect(mockModel.deleteMany).toHaveBeenCalledWith({
      survey: surveyId,
      user: userId
    })
  });

  it('creates a response', async () => {
    const saveFn = jest.fn();
    class MockModel {
      data: any;
      constructor(data: any) {
        this.data = data;
      }
      save() {
        return saveFn.mockReturnValue(this)();
      }
    }
    const module = await Test.createTestingModule({
      providers: [
        ResponseRepository,
        { provide: getModelToken(Response.modelName), useValue: MockModel }
      ]
    }).compile();

    repo = module.get<ResponseRepository>(ResponseRepository);

    const dto: CreateResponseDto = {
      responseType: ResponseType.FREE_RESPONSE_RESPONSE,
      freeResponse: 'response1'
    };

    const result: any = await repo.create(
      dto,
      surveyId,
      surveyItemId,
      userId
    );

    expect(saveFn).toHaveBeenCalled();
    expect(result.data.responseType).toBe(ResponseType.FREE_RESPONSE_RESPONSE);
    expect(result.data.freeResponse).toBe('response1');
    expect(result.data.survey).toBe(surveyId);
    expect(result.data.surveyItem).toBe(surveyItemId);
    expect(result.data.user).toBe(userId);
  });
});