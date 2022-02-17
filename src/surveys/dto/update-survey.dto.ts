import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyDto } from './create-survey.dto';
import * as yup from 'yup';

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {}

export const updateSurveyDtoSchema: yup.AnySchema = yup.object({
  title: yup.string().required(),
  description: yup.string()
}).required();