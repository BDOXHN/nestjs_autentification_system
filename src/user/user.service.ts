import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';;
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './entities/user.entity';
import { toUserDto } from './touserdto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // Найти по требуемой опции
  async findOne(options?: object): Promise<UserDto> {
    const user =  await this.userRepository.findOne(options);    
    return toUserDto(user);  
  }

  // Создать пользователя (зарегистрировать)
  async create(userDto: CreateUserDto): Promise<UserDto> {    
    const { fullName, email, username, password } = userDto;
    
    // check if the user exists in the db    
    const userInDb = await this.userRepository.findOne({ 
        where: { username } 
    });
    if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
    }
    
    const userCreated = this.userRepository.create({ fullName, email, username, password });
    const userSaved = await this.userRepository.save(userCreated);
    delete userSaved.password
      if (!userSaved) {
        throw new BadRequestException('Error at user registration');
      }

    return toUserDto(userSaved);  
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {    
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
    }
    
    let areEqual = false;
    // compare passwords
    if (await bcrypt.compare(password, user.password)) {
      areEqual = true;
    }   
    
    if (!areEqual) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);    
    }
    
    return toUserDto(user);  
  }
}
