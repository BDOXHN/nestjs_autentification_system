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

    return user.username + ' succes login';
  }

  async logout(
    @Res({passthrough: true}) response: Response,
    @Req() request: Request) {
    
    const userDto = await this.acces(request);

    const cleared = response.clearCookie('jwt');

    if (!cleared) {
      throw new BadRequestException('Cookie wasnt cleared');
    }

    return userDto.fullName + ' succes logout';
  }

  async acces(@Req() request: Request) {
    // закодированный (подписанный) токен с компьютера пользователя
    const cookie = request.cookies['jwt'];

    if (!cookie) {
      throw new BadRequestException('You must login first');
    }

    const data = await this.jwtService.verifyAsync(cookie, {secret: 'secret'});
    
    if (!data) {
      throw new BadRequestException('Error: cookie wasnt verifed');
    }

    // Вытаскиваем имя пользователя из куки файла
    // Ищем по имени в БД и получаем ДТО
    const userData = await this.jwtService.decode(cookie);

    const username = userData['username'];
    const userDto = await this.userService.findOne({ where: { username } }); 

    return userDto;
  }

}