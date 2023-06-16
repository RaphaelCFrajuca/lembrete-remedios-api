import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Request, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserGuard } from "src/guards/UserGuard";
import { ReminderService } from "src/services/ReminderService";
import { FindReminderDto, ReminderDto } from "../dto/ReminderDto";
import { CustomException } from "src/utils/Errors/CustomException";
import { FindUserDto } from "../dto/FindUserDto";
import { ReminderBaseDto } from "../dto/ReminderBaseDto";

@Controller("reminder")
export class ReminderController {
    constructor(private reminderService: ReminderService) {}

    @Get()
    @UseGuards(UserGuard)
    async get(@Query() findReminderDto: FindReminderDto, @Res() res, @Request() request) {
        if (findReminderDto.email !== request.user?.email) {
            throw new CustomException(`User ${request.user?.email} not authorized to get ${findReminderDto.email} reminders`, HttpStatus.FORBIDDEN);
        }
        const reminders = await this.reminderService.get(findReminderDto.email);
        if (reminders) {
            res.status(HttpStatus.FOUND).json(reminders);
        } else {
            res.status(HttpStatus.NOT_FOUND).json();
        }
    }

    @Post("new")
    @UseGuards(UserGuard)
    async new(@Body() body: ReminderBaseDto, @Res() res, @Request() request) {
        const serviceResponse = await this.reminderService.new(body, request.user?.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }

    @Put("update")
    @UseGuards(UserGuard)
    async update(@Body() body: ReminderDto[], @Res() res, @Request() request) {
        const serviceResponse = await this.reminderService.update(body, request.user?.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }

    @Delete("delete")
    @UseGuards(UserGuard)
    async delete(@Body() body: ReminderDto[], @Res() res, @Request() request) {
        const serviceResponse = await this.reminderService.delete(body, request.user?.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }
}
