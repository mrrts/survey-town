import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}
  
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: Request) {
    const authenticatedUser = await this.authService.login(loginDto, req);
    if (authenticatedUser && authenticatedUser.emailAddress) {
      authenticatedUser.passwordHash = null;
      return res.status(200).json(authenticatedUser);
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    this.authService.logout(req);
  }
}
