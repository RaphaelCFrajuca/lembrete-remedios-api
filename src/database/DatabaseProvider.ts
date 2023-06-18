import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";
import { Reminder, ReminderUser } from "src/interfaces/ReminderInterface";
import { User } from "src/interfaces/UserInterface";

export class DatabaseProvider implements Database {
    constructor(private readonly provider: Database) {}

    async getNames(email: string): Promise<string[]> {
        return await this.provider.getNames(email);
    }

    async getAllReminders(): Promise<Reminder[]> {
        return await this.provider.getAllReminders();
    }

    async getReminders(email: string): Promise<ReminderUser[]> {
        return await this.provider.getReminders(email);
    }

    async newReminders(reminders: ReminderUser[], email: string): Promise<void> {
        return await this.provider.newReminders(reminders, email);
    }

    async updateReminders(reminders: ReminderUser[], email: string): Promise<void> {
        return await this.provider.updateReminders(reminders, email);
    }

    async deleteReminders(reminders: ReminderUser[], email: string): Promise<void> {
        return await this.provider.deleteReminders(reminders, email);
    }

    async updateUser(user: User): Promise<void> {
        return await this.provider.updateUser(user);
    }

    async deleteUser(email: string): Promise<void> {
        return await this.provider.deleteUser(email);
    }
    async registerUser(user: User): Promise<void> {
        return await this.provider.registerUser(user);
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await this.provider.findUserByEmail(email);
    }

    async getMedicationsList(): Promise<Medication[]> {
        return await this.provider.getMedicationsList();
    }
}
