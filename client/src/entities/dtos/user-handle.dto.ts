export interface IUserHandleDto {
  uuid: string;
  handle: string;
}

export class UserHandleDto implements IUserHandleDto {
  uuid: string;
  handle: string;

  constructor(json: IUserHandleDto) {
    this.uuid = json?.uuid;
    this.handle = json?.handle;
  }
}