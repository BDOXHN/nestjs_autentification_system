import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsNotEmpty} from "class-validator";


export class LoginUserDto {
    
    @Length(3, 32)
    username: string;

    @Length(3, 32)
    password: string;
}