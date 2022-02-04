import { LoginDto } from "../../entities/dtos/login.dto";
import { IUser, User } from "../../entities/user.model";
import * as httpUtil from '../../util/http.util';

export const login = async (dto: LoginDto) => {
  const json = await httpUtil.post<LoginDto, IUser>('/auth/login', dto);
  return new User(json);
};

export const logout = async () => {
  const resp = await httpUtil.get('/auth/logout');
  return resp;
}
  