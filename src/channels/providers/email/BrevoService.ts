import { Channel } from "src/interfaces/ChannelInterface";
import { ReminderToSchedule } from "src/interfaces/ReminderInterface";

export class BrevoService implements Channel {
    constructor(private readonly apiKey: string) {}

    send(reminderToSchedule: ReminderToSchedule) {
        throw new Error("Method email not implemented.");
    }
}
