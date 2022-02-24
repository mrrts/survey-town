import * as yup from 'yup';

export class RegisterDto {
  emailAddress: string;
  plaintextPassword: string;
  handle: string;
}

export const registerDtoSchema: yup.AnySchema = yup.object({
  emailAddress: yup.string().email().required(),
  handle: yup.string().required().min(6).max(20).matches(/^\w+$/, { message: 'handle/username must be only letters, numbers, and underscores'}),
  plaintextPassword: yup.string().required().min(8).max(36),
}).required();