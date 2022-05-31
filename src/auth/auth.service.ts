import { BadRequestException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import {Response, Request} from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) { }

  async register(
    userDto: CreateUserDto) {
    await this.userService.create(userDto);
    return 'Succes registration';
  }

  async login(
    loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response) {

    const user = await this.userService.findByLogin(loginUserDto);

    // generate and sign token
    const jwt = await this.jwtService.signAsync({ username: user.username });
    if (!jwt) {
      throw new BadRequestException('Error: jwt wasnt created')
    }

    const cookie = response.cookie('jwt', jwt, { httpOnly: true });
    if (!cookie) {
      throw new BadRequestException('Error: cookie not responsed')
    }

    return 'Succes login';
  }

  async logout(
    @Res({passthrough: true}) response: Response,
    @Req() request: Request) {
    const cookie = request.cookies['jwt'];

    if (!cookie) {
      throw new BadRequestException('You must login first');
    }

    const data = await this.jwtService.verifyAsync(cookie);
    
    if (!data) {
      throw new BadRequestException('You must login first');
    }

    const cleared = response.clearCookie('jwt');

    if (!cleared) {
      throw new BadRequestException('Cookie wasnt cleared');
    }

    return 'Succes logout';
  }

}