import * as yup from 'yup';

export class CreateSurveyDto {
  title: string;
  description: string;
}

export const createSurveyDtoSchema: yup.AnySchema = yup.object({
  title: yup.string().required(),
  description: yup.string()
}).required();

