import { ChannelProvider } from "src/channels/ChannelProvider";
import { ReminderMedication, ReminderToSchedule } from "./ReminderInterface";

export interface Channel {
    send(messageData: MessageData);
}

export interface MessageData {
    name: string;
    email: string;
    phone: string;
    reminder: ReminderMedication;
}

export interface ChannelService {
    email: ChannelProvider;
    sms: ChannelProvider;
    voicemail: ChannelProvider;
}
