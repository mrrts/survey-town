import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, surveySchema } from './entities/survey.entity';
import { SurveyItem, surveyItemSchema } from './entities/survey-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.modelName, schema: surveySchema },
      { name: SurveyItem.modelName, schema: surveyItemSchema }
    ]),
  ],
  controllers: [SurveysController],
  providers: [SurveysService]
})
export class SurveysModule {}
