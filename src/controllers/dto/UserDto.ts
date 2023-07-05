import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUrl } from "class-validator";
import { User } from "interfaces/UserInterface";
import { ChannelProviderType } from "types/ChannelProviderType";
export class UserDto implements User {
    @IsNotEmpty()
    @IsString()
    reminderChannel: ChannelProviderType;

    @IsNotEmpty()
    @IsString()
    given_name: string;

    @IsNotEmpty()
    @IsString()
    family_name: string;

    @IsNotEmpty()
    @IsString()
    locale: string;

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
    @IsPhoneNumber()
    phone: string;

    @IsNotEmpty()
    @IsBoolean()
    email_verified: boolean;
}
