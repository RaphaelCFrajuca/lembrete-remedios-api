import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { User } from "src/interfaces/UserInterface";

export class UserDto implements User {
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUrl()
    picture: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsBoolean()
    email_verified: boolean;
}
