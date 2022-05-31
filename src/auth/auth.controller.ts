import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res, BadRequestException, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { async } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto,) {
    const succesReg = await this.authService.register(createUserDto,);
    return succesReg;
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response) {
    const succesLogin = await this.authService.login(loginUserDto, response);
    return succesLogin;
  }

  @Post('logout')
  async logout(
    @Res({passthrough: true}) response: Response,
    @Req() request: Request) {
    const succesLogout = await this.authService.logout(response, request);
    return succesLogout;
  }

}
