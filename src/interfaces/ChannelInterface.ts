import { ChannelProvider } from "channels/ChannelProvider";
import { ReminderMedication } from "./ReminderInterface";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from "class-validator";

export interface Channel {
    send(messageData: MessageData);
}

export class MessageData {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsObject()
    @IsNotEmptyObject()
    reminder: ReminderMedication;
}

export interface ChannelService {
    email: ChannelProvider;
    sms: ChannelProvider;
    voicemail: ChannelProvider;
}
