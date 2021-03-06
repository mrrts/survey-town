import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto, createSurveyDtoSchema } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { CreateSurveyItemDto, createSurveyItemDtoSchema } from './dto/create-survey-item.dto';
import { CreateResponseDto, createResponseDtoSchema } from './dto/create-response.dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { USER_ROLES } from '../users/entities/user.entity';
import { User } from '../common/user.decorator';
import { UpdateSurveyDto, updateSurveyDtoSchema } from '../surveys/dto/update-survey.dto';
import { UpdateSurveyItemDto, updateSurveyItemDtoSchema } from './dto/update-survey-item.dto';
import { SchemaValidatorPipe } from '../common/schema-validator.pipe';

@Controller('api/surveys')
@UseGuards(RolesGuard)
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  @Roles({ requireAll: [USER_ROLES.USER] })
  create(
    @Body(new SchemaValidatorPipe(createSurveyDtoSchema)) createSurveyDto: CreateSurveyDto,
    @User('uuid') userId: string,
  ) {
    return this.surveysService.create(createSurveyDto, userId);
  }

  @Get()
  @Roles({ requireAll: [USER_ROLES.USER] })
  async findAll(): Promise<SurveyDto[]> {
    return this.surveysService.findAll();
  }

  @Get(':surveyId')
  @Roles({ requireAll: [USER_ROLES.USER] })
  findOne(@Param('surveyId') surveyId: string): Promise<SurveyDto> {
    return this.surveysService.findOne(surveyId);
  }

  @Delete(':surveyId')
  @Roles({ requireAll: [USER_ROLES.USER] })
  remove(
    @Param('surveyId') surveyId: string,
    @User('uuid') userId: string,
  ): Promise<boolean> {
    return this.surveysService.remove(surveyId, userId);
  }

  @Patch(':surveyId')
  @Roles({ requireAll: [USER_ROLES.USER] })
  update(
    @Param('surveyId') surveyId: string,
    @Body(new SchemaValidatorPipe(updateSurveyDtoSchema)) dto: UpdateSurveyDto,
    @User('uuid') userId: string,
  ): Promise<SurveyDto> {
    return this.surveysService.update(surveyId, dto, userId);
  }

  @Post(':surveyId/items')
  @Roles({ requireAll: [USER_ROLES.USER] })
  createSurveyItem(
    @Param('surveyId') surveyId: string,
    @Body(new SchemaValidatorPipe(createSurveyItemDtoSchema)) createSurveyItemDto: CreateSurveyItemDto,
    @User('uuid') userId: string,
  ) {
    return this.surveysService.createSurveyItem(
      createSurveyItemDto,
      surveyId,
      userId,
    );
  }

  @Patch(':surveyId/items/:surveyItemId')
  @Roles({ requireAll: [USER_ROLES.USER] })
  updateSurveyItem(
    @Param('surveyId') surveyId: string,
    @Param('surveyItemId') itemId: string,
    @User('uuid') userId: string,
    @Body(new SchemaValidatorPipe(updateSurveyItemDtoSchema)) dto: UpdateSurveyItemDto
  ) {
    return this.surveysService.updateSurveyItem(dto, surveyId, itemId, userId);
  }

  @Delete(':surveyId/items/:itemId')
  @Roles({ requireAll: [USER_ROLES.USER] })
  removeSurveyItem(
    @Param('surveyId') surveyId: string,
    @Param('itemId') itemId: string,
    @User('uuid') userId: string,
  ) {
    return this.surveysService.removeSurveyItem(surveyId, itemId, userId);
  }

  @Get(':surveyId/responses')
  @Roles({ requireAll: [USER_ROLES.USER] })
  async getSurveyResponses(@Param('surveyId') surveyId: string) {
    const responses = await this.surveysService.findAllResponsesForSurvey(surveyId);
    return responses.map((resp) => resp.safe()); // remove user uuids
  }

  @Post(':surveyId/items/:itemId/responses')
  @Roles({ requireAll: [USER_ROLES.USER] })
  createResponse(
    @Body(new SchemaValidatorPipe(createResponseDtoSchema)) dto: CreateResponseDto,
    @Param('surveyId') surveyId: string,
    @Param('itemId') itemId: string,
    @User('uuid') userId: string,
  ) {
    return this.surveysService.createResponse(dto, surveyId, itemId, userId);
  }

  @Get(':surveyId/own-responses')
  @Roles({ requireAll: [USER_ROLES.USER] })
  getOwnResponsesForSurvey(
    @Param('surveyId') surveyId: string,
    @User('uuid') userId: string
  ) {
    return this.surveysService.findAllResponsesForUserAndSurvey(surveyId, userId);
  }

  @Delete(':surveyId/own-responses')
  @Roles({ requireAll: [USER_ROLES.USER] })
  removeOwnResponsesForSurvey(
    @Param('surveyId') surveyId: string,
    @User('uuid') userId: string,
  ) {
    return this.surveysService.removeAllResponsesForUserAndSurvey(
      surveyId,
      userId,
    );
  }

}
