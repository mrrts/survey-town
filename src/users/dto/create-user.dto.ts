import { USER_ROLES } from "../entities/user.entity";

export class CreateUserDto {
  emailAddress: string;
  handle: string;
  plaintextPassword: string;
  roles: USER_ROLES[];
}
