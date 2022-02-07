import { Controller, Get, Post, Body, Param, Delete, UseGuards, ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { CreateSurveyItemDto } from './dto/create-survey-item.dto';
import { CreateResponseDto } from './dto/create-response.dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { USER_ROLES } from '../users/entities/user.entity';
import { User } from '../common/user.decorator';

@Controller('api/surveys')
@UseGuards(RolesGuard)
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  create(@Body() createSurveyDto: CreateSurveyDto, @User('uuid') userId: string) {
    return this.surveysService.create(createSurveyDto, userId);
  }

  @Get()
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  async findAll(): Promise<SurveyDto[]> {
    const surveys = await this.surveysService.findAll();
    return surveys;
  }

  @Get(':surveyId')
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  findOne(@Param('surveyId') surveyId: string): Promise<SurveyDto> {
    return this.surveysService.findOne(surveyId);
  }

  @Delete(':surveyId')
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  remove(
    @Param('surveyId') surveyId: string,
    @User('uuid') userId: string
  ): Promise<boolean> {
    return this.surveysService.remove(surveyId, userId);
  }

  @Post(':surveyId/items')
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  createSurveyItem(
    @Param('surveyId') surveyId: string,
    @Body() createSurveyItemDto: CreateSurveyItemDto,
    @User('uuid') userId: string
  ) {
    return this.surveysService.createSurveyItem(createSurveyItemDto, surveyId, userId);
  }

  @Delete(':surveyId/items/:itemId')
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  removeSurveyItem(
    @Param('surveyId') surveyId: string,
    @Param('itemId') itemId: string,
    @User('uuid') userId: string
  ) {
    return this.surveysService.removeSurveyItem(surveyId, itemId, userId);
  }

  @Get(':surveyId/responses')
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  getSurveyResponses(@Param('surveyId') surveyId: string) {
    return this.surveysService.findAllResponsesForSurvey(surveyId);
  }

  @Post(':surveyId/items/:itemId/responses')
  @Roles({ requireAll: [ USER_ROLES.USER ] })
  createResponse(
    @Body() dto: CreateResponseDto,
    @Param('surveyId') surveyId: string,
    @Param('itemId') itemId: string,
    @User('uuid') userId: string
  ) {
    return this.surveysService.createResponse(dto, surveyId, itemId, userId);
  }

  @Delete(':surveyId/own-responses')
  @Roles({ requireAll: [ USER_ROLES.USER ]})
  removeOwnResponsesForSurvey(
    @Param('surveyId') surveyId: string,
    @User('uuid') userId: string
  ) {
    return this.surveysService.removeAllResponsesForUserAndSurvey(surveyId, userId);
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
