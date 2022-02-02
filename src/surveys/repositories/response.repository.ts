import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IResponse, Response, ResponseDocument } from "../entities/response.entity";


@Injectable()
export class ResponseRepository {

  constructor(
    @InjectModel(Response.modelName) private responseModel: Model<ResponseDocument>
  ) {}

  async findAll(): Promise<IResponse[]> {
    return this.responseModel.find().exec();
  }

  async findAllForSurvey(surveyId: string): Promise<IResponse[]> {
    return this.responseModel.find({ survey: surveyId }).exec();
  }

  async findAllForSurveyItem(surveyItemId: string): Promise<IResponse[]> {
    return this.responseModel.find({ surveyItem: surveyItemId }).exec();
  }

}