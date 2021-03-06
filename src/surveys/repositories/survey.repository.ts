import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';
import { ISurvey, Survey, SurveyDocument } from '../entities/survey.entity';

@Injectable()
export class SurveyRepository {
  constructor(
    @InjectModel(Survey.modelName) private surveyModel: Model<SurveyDocument>,
  ) {}

  findAll(): Promise<ISurvey[]> {
    return this.surveyModel.find().exec();
  }

  findOne(uuid: string): Promise<ISurvey> {
    return this.surveyModel.findOne({ uuid }).exec();
  }

  createWithAuthor(dto: CreateSurveyDto, authorId: string): Promise<ISurvey> {
    const survey = new this.surveyModel({
      ...dto,
      author: authorId,
    });
    return survey.save();
  }

  async remove(surveyId: string): Promise<boolean> {
    const result = await this.surveyModel.deleteOne({ uuid: surveyId }).exec();
    return result.deletedCount === 1;
  }

  async update(surveyId: string, dto: UpdateSurveyDto): Promise<ISurvey> {
    const result = await this.surveyModel.updateOne(
      { uuid: surveyId },
      { $set: {
        ...dto,
        updatedAt: new Date()
      } }
    );
    return this.findOne(surveyId);
  }

  async addItem(surveyId: string, itemId: string): Promise<ISurvey> {
    await this.surveyModel
      .updateOne(
        { uuid: surveyId },
        { $push: { surveyItems: itemId }, updatedAt: new Date() }
      )
      .exec();
    return this.findOne(surveyId);
  }

  async removeItem(surveyId: string, itemId: string): Promise<ISurvey> {
    await this.surveyModel
      .updateOne(
        { uuid: surveyId },
        { $pull: { surveyItems: itemId }, updatedAt: new Date() }
      )
      .exec();
    return this.findOne(surveyId);
  }
}
