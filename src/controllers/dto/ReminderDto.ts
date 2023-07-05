import { IsArray, IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from "class-validator";
import { ReminderList, ReminderUser } from "interfaces/ReminderInterface";

export class ReminderDto implements ReminderUser {
    @IsNotEmpty()
    @IsNumber()
    uniqueId: number;

    @IsNotEmpty()
    @IsNumber()
    level: number;

    @IsNotEmpty()
    @IsNumber()
    key: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmptyObject()
    @IsArray()
    @ValidateNested({ each: true })
    reminderList: ReminderList[];
}

export class FindReminderDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
