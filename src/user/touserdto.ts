import { UserDto } from "./dto/user.dto";
import { UserEntity } from "./entities/user.entity";

export const toUserDto = (data: UserEntity): UserDto => {  
    const { fullName, email, username } = data;
    let userDto: UserDto = { fullName, email, username };
    return userDto;
};