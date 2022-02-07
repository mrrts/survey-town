import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, surveySchema } from './entities/survey.entity';
import {
  ContentInterludeItem,
  contentInterludeItemSchema,
  FreeResponseItem,
  freeResponseItemSchema,
  MultipleChoiceItem,
  multipleChoiceItemSchema,
  MultipleSelectItem,
  multipleSelectItemSchema,
  SurveyItem,
  surveyItemSchema,
} from './entities/survey-item.entity';
import { SurveyRepository } from './repositories/survey.repository';
import { SurveyItemRepository } from './repositories/survey-item.repository';
import {
  FreeResponse,
  freeResponseSchema,
  MultipleChoiceResponse,
  multipleChoiceResponseSchema,
  MultipleSelectResponse,
  multipleSelectResponseSchema,
  Response,
  responseSchema,
} from './entities/response.entity';
import { ResponseRepository } from './repositories/response.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.modelName, schema: surveySchema },
      {
        name: SurveyItem.modelName,
        schema: surveyItemSchema,
        discriminators: [
          {
            name: ContentInterludeItem.modelName,
            schema: contentInterludeItemSchema,
          },
          { name: FreeResponseItem.modelName, schema: freeResponseItemSchema },
          {
            name: MultipleChoiceItem.modelName,
            schema: multipleChoiceItemSchema,
          },
          {
            name: MultipleSelectItem.modelName,
            schema: multipleSelectItemSchema,
          },
        ],
      },
      {
        name: Response.modelName,
        schema: responseSchema,
        discriminators: [
          { name: FreeResponse.modelName, schema: freeResponseSchema },
          {
            name: MultipleChoiceResponse.modelName,
            schema: multipleChoiceResponseSchema,
          },
          {
            name: MultipleSelectResponse.modelName,
            schema: multipleSelectResponseSchema,
          },
        ],
      },
    ]),
  ],
  controllers: [SurveysController],
  providers: [
    SurveysService,
    SurveyRepository,
    SurveyItemRepository,
    ResponseRepository,
  ],
})
export class SurveysModule {}
