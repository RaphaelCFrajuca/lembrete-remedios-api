import { Channel } from "src/interfaces/ChannelInterface";
import { ReminderToSchedule } from "src/interfaces/ReminderInterface";

export class NvoipService implements Channel {
    constructor(private readonly sip: string, private readonly userToken: string) {}

    send(reminderToSchedule: ReminderToSchedule) {
        throw new Error("Method not implemented.");
    }
}
