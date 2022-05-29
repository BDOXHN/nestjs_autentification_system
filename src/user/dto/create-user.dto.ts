import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";


export class CreateUserDto {
    
    @Length(3, 32)
    fullName: string;

    @IsEmail()
    @Length(3, 32)
    email: string;

    @Length(3, 32)
    password: string;
}
