import * as yup from 'yup';

export class UpdateSelfDto {
  plaintextPassword: string;
}

export const updateSelfDtoSchema: yup.AnySchema = yup.object({
  plaintextPassword: yup.string().min(8).max(36).required()
}).required();