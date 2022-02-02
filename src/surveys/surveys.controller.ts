import { Controller, Get, Post, Body, Param, Session } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { IAppSession } from 'src/auth/entities/session.entity';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto, @Session() session: IAppSession) {
    return this.surveysService.create(createSurveyDto, session._user.uuid);
  }

  @Get()
  findAll(): Promise<SurveyDto[]> {
    return this.surveysService.findAll();
  }

  @Get(':surveyId')
  findOne(@Param('surveyId') surveyId: string): Promise<SurveyDto> {
    return this.surveysService.findOne(surveyId);
  }

  @Post(':surveyId/items')
  createSurveyItem(
    @Param('surveyId') surveyId: string,
    @Body() createSurveyItemDto: CreateSurveyItemDto,
    @Session() session: IAppSession
  ) {
    return this.surveysService.createSurveyItem(createSurveyItemDto, surveyId, session._user.uuid);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
  //   return this.surveysService.update(id, updateSurveyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.surveysService.remove(id);
  // }
}
