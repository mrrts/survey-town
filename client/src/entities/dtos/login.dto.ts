export interface ILoginDto {
  emailAddress: string;
  plaintextPassword: string;
}

export class LoginDto implements ILoginDto {
  emailAddress: string;
  plaintextPassword: string;

  constructor(json: ILoginDto) {
    this.emailAddress = json?.emailAddress;
    this.plaintextPassword = json?.plaintextPassword;
  }
}