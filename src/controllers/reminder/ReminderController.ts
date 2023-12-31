import { Body, Controller, Delete, Get, HttpStatus, ParseArrayPipe, Post, Put, Query, Request, Res, UseGuards } from "@nestjs/common";
import { UserGuard } from "guards/UserGuard";
import { ReminderService } from "services/ReminderService";
import { FindReminderDto, ReminderDto } from "../dto/ReminderDto";
import { CustomException } from "utils/Errors/CustomException";
import { ReminderBaseDto } from "../dto/ReminderBaseDto";
import { PubSubRequestDto } from "../dto/PubSubRequestDto";
import { MessageData } from "interfaces/ChannelInterface";
import axios from "axios";
import { Logger } from "utils/Logger";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";

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
            res.status(HttpStatus.OK).json(reminders);
        } else {
            res.status(HttpStatus.NOT_FOUND).json();
        }
    }

    @Get("name")
    @UseGuards(UserGuard)
    async getNames(@Res() res, @Request() request) {
        const reminders = await this.reminderService.getNames(request.user?.email);
        res.status(HttpStatus.OK).json(reminders);
    }

    @Post("new")
    @UseGuards(UserGuard)
    async new(@Body() body: ReminderBaseDto, @Res() res, @Request() request) {
        const serviceResponse = await this.reminderService.new(body, request.user?.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }

    @Post("schedule")
    async schedule(@Res() res) {
        const serviceResponse = await this.reminderService.schedule();
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }

    @Post("send")
    async send(@Body() body: PubSubRequestDto, @Res() res, @Request() request) {
        Logger.notice("Pub/Sub Request", { body, headers: request.headers });
        if (request.headers["content-type"] !== "application/json") {
            res.status(HttpStatus.FORBIDDEN).json({ status: "error", message: "Invalid Content-Type" });
            return;
        }
        if (request.headers["user-agent"] === "CloudPubSub-Google") {
            const channel = body.message.attributes.channel;
            const messageData: MessageData = plainToInstance(MessageData, JSON.parse(Buffer.from(body.message.data, "base64").toString("utf-8")).messageData);
            try {
                await validateOrReject(messageData);
            } catch (errors) {
                Logger.error("Invalid Message Data", { errors });
                res.status(HttpStatus.BAD_REQUEST).json({ status: "error", message: "Invalid Message Data" });
                return;
            }
            const serviceResponse = await this.reminderService.send(channel, messageData);
            res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        } else if (request.headers["user-agent"] === "Amazon Simple Notification Service Agent") {
            if (body.Type === "SubscriptionConfirmation") {
                Logger.log("Subscription Confirmed", { body });
                await axios.get(body.SubscribeURL);
                res.status(HttpStatus.OK).json({ status: "success", message: "Subscription Confirmed" });
                return;
            }
            const channel = body.MessageAttributes.channel.Value;
            const messageData: MessageData = plainToInstance(MessageData, JSON.parse(body.Message));
            try {
                await validateOrReject(messageData);
            } catch (errors) {
                Logger.error("Invalid Message Data", { errors });
                res.status(HttpStatus.BAD_REQUEST).json({ status: "error", message: "Invalid Message Data" });
                return;
            }
            const serviceResponse = await this.reminderService.send(channel, messageData);
            res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        } else {
            res.status(HttpStatus.FORBIDDEN).json({ status: "error", message: "Invalid User Agent" });
        }
        return;
    }

    @Put("update")
    @UseGuards(UserGuard)
    async update(@Body(new ParseArrayPipe({ items: ReminderDto })) body: ReminderDto[], @Res() res, @Request() request) {
        const serviceResponse = await this.reminderService.update(body, request.user?.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }

    @Delete("delete")
    @UseGuards(UserGuard)
    async delete(@Body(new ParseArrayPipe({ items: ReminderDto })) body: ReminderDto[], @Res() res, @Request() request) {
        const serviceResponse = await this.reminderService.delete(body, request.user?.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }
}
