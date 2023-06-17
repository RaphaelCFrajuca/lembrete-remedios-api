import { ChannelProvider } from "src/channels/ChannelProvider";
import { ReminderMedication } from "./ReminderInterface";

export interface Channel {
    send(messageData: MessageData);
}

export interface MessageData {
    name: string;
    email: string;
    phone: string;
    channel: string;
    reminder: ReminderMedication;
}

export interface ChannelService {
    email: ChannelProvider;
    sms: ChannelProvider;
    voicemail: ChannelProvider;
}
