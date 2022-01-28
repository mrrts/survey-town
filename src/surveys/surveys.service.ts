import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SurveyItem, SurveyItemDocument } from './entities/survey-item.entity';
import { Survey, SurveyDocument } from './entities/survey.entity';
import { orderBy } from 'lodash';
import { IAppSession } from 'src/auth/entities/session.entity';

@Injectable()
export class SurveysService {
  constructor(
    @InjectModel(Survey.modelName) private surveyModel: Model<SurveyDocument>,
    @InjectModel(SurveyItem.modelName) private surveyItemModel: Model<SurveyItemDocument>
  ) {}

  private async getSurveyDto(id: string): Promise<SurveyDto> {
    const survey: SurveyDocument = await this.surveyModel.findOne({ uuid: id }).exec();
    const items: SurveyItemDocument[] = await this.surveyItemModel.find({ uuid: { $in: survey.surveyItems }}).exec();
    const dto: SurveyDto = new SurveyDto();
    dto.survey = survey;
    dto.expandedItems = orderBy(items, ((item: SurveyItemDocument) => {
      return survey.surveyItems.indexOf(item.uuid);
    }));
    return dto;
  }

  async create(createSurveyDto: CreateSurveyDto, session: IAppSession): Promise<SurveyDto> {
    const survey = new this.surveyModel({
      ...createSurveyDto,
      author: session._user.uuid
    });
    const savedSurvey = await survey.save();
    return this.findOne(savedSurvey.uuid);
  }

  async findAll(): Promise<SurveyDto[]> {
    const allSurveys: SurveyDocument[] = await this.surveyModel.find().exec();
    const dtos: Promise<SurveyDto>[] = allSurveys.map((surveyDoc: SurveyDocument) => {
      return this.getSurveyDto(surveyDoc.uuid);
    });
    return Promise.all(dtos);
  }

  findOne(id: string): Promise<SurveyDto> {
    return this.getSurveyDto(id);
  }

  update(id: string, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${id} survey`;
  }

  remove(id: string) {
    return `This action removes a #${id} survey`;
  }
}
