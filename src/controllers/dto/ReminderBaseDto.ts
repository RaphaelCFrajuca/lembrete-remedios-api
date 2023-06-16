import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ReminderBase } from "src/interfaces/ReminderInterface";

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
