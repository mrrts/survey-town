import { LoginDto } from "../../entities/dtos/login.dto";
import { IUser, User } from "../../entities/user.model";
import * as httpUtil from '../../util/http.util';

export const login = async (dto: LoginDto) => {
  const json = await httpUtil.post<LoginDto, IUser>('/auth/login', dto);
  return json ? new User(json) : null;
};

export const logout = async () => {
  return httpUtil.get<void>('/auth/logout');
};

export const getSelf = async (): Promise<User|null> => {
  const json = await httpUtil.get<IUser>('users/self');
  return json ? new User(json) : null;
};
  