import * as yup from 'yup';

export class LoginDto {
  emailAddress: string;
  plaintextPassword: string;
}

export const loginDtoSchema: yup.AnySchema = yup.object({
  emailAddress: yup.string().email().required(),
  plaintextPassword: yup.string().required()
}).required();