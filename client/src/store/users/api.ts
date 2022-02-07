import { IUserHandleDto } from "../../entities/dtos/user-handle.dto"
import * as httpUtil from '../../util/http.util';

export const fetchUserHandles = async () => {
  return httpUtil.get<IUserHandleDto[]>('/users/handles');
}