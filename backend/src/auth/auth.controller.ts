import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dtos/login.dto.js';
import { RegisterDto } from './dtos/register.dto.js';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { name, email, password } = registerDto;
    const result = await this.authService.signup(name, email, password);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { email, password } = loginDto;
    const result = await this.authService.login(email, password);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('guest')
  async guest(@Body() { name }: { name: string }, @Res() res: Response) {
    const result = await this.authService.guestLogin(name);
    return res.status(HttpStatus.CREATED).json(result);
  }
}
