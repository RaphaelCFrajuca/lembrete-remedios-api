import { ChannelProviderType } from "src/types/ChannelProviderType";

export interface ReminderMedication {
    uniqueId?: number;
    level?: number;
    key?: number;
    medication: string;
    hour: string;
}

export interface ReminderList {
    uniqueId: number;
    level: number;
    key: number;
    dayOfWeek: string;
    reminders: ReminderMedication[];
}

export interface ReminderUser {
    uniqueId: number;
    level: number;
    key: number;
    name: string;
    reminderList: ReminderList[];
}

export interface Reminder {
    email: string;
    reminders: ReminderUser[] | string;
}

export interface ReminderBase {
    fullName: string;
    medicationName: string;
    daysOfWeek: string[];
    hour: string;
}
export interface ReminderToSchedule {
    email: string;
    name: string;
    phone: string;
    channel: ChannelProviderType;
    reminders: ReminderMedication[];
}
