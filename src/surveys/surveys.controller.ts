import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Session } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { Request } from 'express';
import { IAppSession } from 'src/auth/entities/session.entity';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto, @Session() session: IAppSession) {
    return this.surveysService.create(createSurveyDto, session);
  }

  @Get()
  findAll(@Req() req: Request): Promise<SurveyDto[]> {
    return this.surveysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SurveyDto> {
    return this.surveysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveysService.update(id, updateSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveysService.remove(id);
  }
}
