import { ChannelProvider } from "src/channels/ChannelProvider";
import { ReminderToSchedule } from "./ReminderInterface";

export interface Channel {
    send(reminderToSchedule: ReminderToSchedule);
}

export interface ChannelService {
    email: ChannelProvider;
    sms: ChannelProvider;
    voiceMail: ChannelProvider;
}
