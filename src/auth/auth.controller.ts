import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SchemaValidatorPipe } from '../common/schema-validator.pipe';
import { IUser } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, loginDtoSchema } from './dto/login.dto';
import { RegisterDto, registerDtoSchema } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new SchemaValidatorPipe(loginDtoSchema)) loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<IUser> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // delay attempts
    return this.authService.login(loginDto, req);
  }

  @Post('register')
  register(
    @Body(new SchemaValidatorPipe(registerDtoSchema)) registerDto: RegisterDto,
    @Req() req: Request,
  ): Promise<IUser> {
    return this.authService.register(registerDto, req);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req);
    res.status(200).clearCookie(process.env.SESSION_COOKIE_NAME).send();
  }
}
