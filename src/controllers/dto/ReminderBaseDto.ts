import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";
import { ReminderBase } from "interfaces/ReminderInterface";

export class ReminderBaseDto implements ReminderBase {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    medicationName: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    daysOfWeek: string[];

    @IsNotEmpty()
    @IsString()
    hour: string;
}
