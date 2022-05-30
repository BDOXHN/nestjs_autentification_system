import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsNotEmpty} from "class-validator";


export class UserDto{
    
    @Length(3, 32)
    fullName: string;

    @IsEmail()
    @Length(3, 32)
    email: string;

    @Length(3, 32)
    username: string;
}