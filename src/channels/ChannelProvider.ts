import { Channel } from "src/interfaces/ChannelInterface";
import { ReminderToSchedule } from "src/interfaces/ReminderInterface";

export class ChannelProvider implements Channel {
    constructor(private readonly provider: Channel) {}

    send(reminderToSchedule: ReminderToSchedule) {
        return this.provider.send(reminderToSchedule);
    }
}
