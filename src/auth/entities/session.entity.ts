import { IUser } from 'src/users/entities/user.entity';

export interface IAppSession {
  cookie: any;
  _user: IUser;
}
