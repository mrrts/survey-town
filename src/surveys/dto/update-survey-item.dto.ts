import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyItemDto } from './create-survey-item.dto';

export class UpdateSurveyItemDto extends PartialType(CreateSurveyItemDto) {}
