import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSurveyItemDto } from '../dto/create-survey-item.dto';
import { UpdateSurveyItemDto } from '../dto/update-survey-item.dto';
import {
  ISurveyItem,
  SurveyItem,
  SurveyItemDocument,
} from '../entities/survey-item.entity';
import { keys, forEach } from 'lodash';

@Injectable()
export class SurveyItemRepository {
  constructor(
    @InjectModel(SurveyItem.modelName) private surveyItemModel: Model<SurveyItemDocument>,
  ) {}

  findMultiple(uuids: string[]): Promise<ISurveyItem[]> {
    return this.surveyItemModel.find({ uuid: { $in: uuids } }).exec();
  }

  findOne(uuid: string): Promise<ISurveyItem> {
    return this.surveyItemModel.findOne({ uuid }).exec();
  }

  createWithAuthor(
    dto: CreateSurveyItemDto,
    authorId: string,
  ): Promise<ISurveyItem> {
    const item = new this.surveyItemModel({
      ...dto,
      author: authorId,
    });
    return item.save();
  }

  async update(surveyItemId: string, dto: UpdateSurveyItemDto): Promise<ISurveyItem> {
    const surveyItem = await this.surveyItemModel.findOne({ uuid: surveyItemId }).exec();

    forEach(keys(dto), (dtoKey: string) => {
      surveyItem[dtoKey] = dto[dtoKey];
    });

    surveyItem.updatedAt = new Date();

    return surveyItem.save();
  }

  async removeOne(uuid: string): Promise<boolean> {
    const deleteResult = await this.surveyItemModel.deleteOne({ uuid }).exec();
    return deleteResult.deletedCount === 1;
  }
}
