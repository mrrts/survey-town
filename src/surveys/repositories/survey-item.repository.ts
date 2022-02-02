import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateSurveyItemDto } from "../dto/create-survey-item.dto";
import { ISurveyItem, SurveyItem, SurveyItemDocument } from "../entities/survey-item.entity";


@Injectable()
export class SurveyItemRepository {
  
  constructor(
    @InjectModel(SurveyItem.modelName) private surveyItemModel: Model<SurveyItemDocument>
  ) {}

  findMultiple(uuids: string[]): Promise<ISurveyItem[]> {
    return this.surveyItemModel.find({ uuid: { $in: uuids }}).exec();
  }

  createWithAuthor(dto: CreateSurveyItemDto, authorId: string): Promise<ISurveyItem> {
    const item = new this.surveyItemModel({
      ...dto,
      author: authorId
    });
    return item.save();
  }
}