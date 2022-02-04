export interface IUser {
  uuid: string;
  emailAddress: string;
  handle: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
}

export class User implements IUser {
  uuid: string;
  emailAddress: string;
  handle: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];

  constructor(json: IUser) {
    this.uuid = json?.uuid;
    this.emailAddress = json?.emailAddress;
    this.handle = json?.handle;
    this.createdAt = new Date(json?.createdAt);
    this.updatedAt = new Date(json?.updatedAt);
    this.roles = json?.roles;
  }
}