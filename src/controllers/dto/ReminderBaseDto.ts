import { ArrayMinSize, ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";
import { ReminderBase } from "interfaces/ReminderInterface";

export class ReminderBaseDto implements ReminderBase {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    medicationName: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsIn(["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"], { each: true })
    daysOfWeek: string[];

    @IsNotEmpty()
    @IsString()
    hour: string;
}
