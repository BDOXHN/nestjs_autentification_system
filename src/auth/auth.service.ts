import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) { }

  async register(
    userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    return user;
  }

  async login(
    loginUserDto: LoginUserDto,
    ) {

    // find user in db    
    const user = await this.userService.findByLogin(loginUserDto);

    // generate and sign token
    const jwt = await this.jwtService.signAsync({ username: user.username });

    return jwt;
  }

}