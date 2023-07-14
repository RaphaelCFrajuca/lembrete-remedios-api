import { IsOptional, IsString } from "class-validator";

export class FindUserDto {
    @IsOptional()
    @IsString()
    email: string;
}
