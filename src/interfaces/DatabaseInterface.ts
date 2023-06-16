import { Medication } from "./MedicationInterface";
import { Reminder, ReminderUser } from "./ReminderInterface";
import { User } from "./UserInterface";

export interface Database {
    getMedicationsList(): Promise<Medication[]>;
    findUserByEmail(email: string): Promise<User | null>;
    registerUser(user: User): Promise<void>;
    deleteUser(email: string): Promise<void>;
    updateUser(user: User): Promise<void>;
    getReminders(email: string): Promise<ReminderUser[]>;
    newReminders(reminders: ReminderUser[], email: string): Promise<void>;
    updateReminders(reminders: ReminderUser[], email: string): Promise<void>;
    deleteReminders(reminders: ReminderUser[], email: string): Promise<void>;
}
