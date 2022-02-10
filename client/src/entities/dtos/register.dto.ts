export interface IRegisterDto {
  emailAddress: string;
  handle: string;
  plaintextPassword: string;
}

export class RegisterDto implements IRegisterDto {
  emailAddress: string;
  handle: string;
  plaintextPassword: string;

  constructor(json: IRegisterDto) {
    this.emailAddress = json?.emailAddress;
    this.handle = json?.handle;
    this.plaintextPassword = json?.plaintextPassword;
  }
}