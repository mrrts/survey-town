import { USER_ROLES } from '../entities/user.entity';
import * as yup from 'yup';
import { values } from 'lodash';

export class CreateUserDto {
  emailAddress: string;
  handle: string;
  plaintextPassword: string;
  roles: USER_ROLES[];
}

export const createUserDtoSchema: yup.AnySchema = yup.object({
  emailAddress: yup.string().email().required(),
  handle: yup.string().min(6).max(20).matches(/^\w+$/).required(),
  plaintextPassword: yup.string().min(8).max(36).required(),
  roles: yup.array().of(yup.string().oneOf(values(USER_ROLES)))
}).required();