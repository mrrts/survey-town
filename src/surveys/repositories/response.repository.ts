import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResponseDto } from '../dto/create-response.dto';
import {
  IResponse,
  Response,
  ResponseDocument,
} from '../entities/response.entity';

@Injectable()
export class ResponseRepository {
  constructor(
    @InjectModel(Response.modelName) private responseModel: Model<ResponseDocument>,
  ) {}

  findAll(): Promise<IResponse[]> {
    return this.responseModel.find().exec();
  }

  findAllForSurvey(surveyId: string): Promise<IResponse[]> {
    return this.responseModel.find({ survey: surveyId }).exec();
  }

  findAllForSurveyItem(surveyItemId: string): Promise<IResponse[]> {
    return this.responseModel.find({ surveyItem: surveyItemId }).exec();
  }

  findForItemAndUser(
    surveyItemId: string,
    userId: string,
  ): Promise<IResponse[]> {
    return this.responseModel
      .find({ surveyItem: surveyItemId, user: userId })
      .exec();
  }

  findAllForUserAndSurvey(surveyId: string, userId: string): Promise<IResponse[]> {
    return this.responseModel.find({ survey: surveyId, user: userId }).exec();
  }

  // Clear the responses for one user for one survey
  removeAllForUserAndSurvey(surveyId: string, userId: string) {
    return this.responseModel
      .deleteMany({ survey: surveyId, user: userId })
      .exec();
  }

  create(
    dto: CreateResponseDto,
    surveyId: string,
    surveyItemId: string,
    userId: string,
  ) {
    const response: ResponseDocument = new this.responseModel({
      ...dto,
      survey: surveyId,
      user: userId,
      surveyItem: surveyItemId,
    });
    return response.save();
  }
}
