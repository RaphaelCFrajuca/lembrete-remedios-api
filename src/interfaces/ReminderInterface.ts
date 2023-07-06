import { ChannelProviderType } from "types/ChannelProviderType";

export class ReminderMedication {
    uniqueId?: number;
    level?: number;
    key?: number;
    medication: string;
    hour: string;
}

export class ReminderList {
    uniqueId: number;
    level: number;
    key: number;
    dayOfWeek: string;
    reminders: ReminderMedication[];
}

export class ReminderUser {
    uniqueId: number;
    level: number;
    key: number;
    name: string;
    reminderList: ReminderList[];
}

export class Reminder {
    email: string;
    reminders: ReminderUser[] | string;
}

export class ReminderBase {
    fullName: string;
    medicationName: string;
    daysOfWeek: string[];
    hour: string;
}
export class ReminderToSchedule {
    email: string;
    name: string;
    phone: string;
    channel: ChannelProviderType;
    reminders: ReminderMedication[];
}
