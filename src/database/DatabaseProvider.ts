import { Database } from "interfaces/DatabaseInterface";
import { Medication } from "interfaces/MedicationInterface";
import { Reminder, ReminderUser } from "interfaces/ReminderInterface";
import { User } from "interfaces/UserInterface";
import { DataSource } from "typeorm";

export class DatabaseProvider implements Database {
    constructor(private readonly provider: Database) {}

    async getDataSource(): Promise<DataSource> {
        return await this.provider.getDataSource();
    }

    async destroy(): Promise<void> {
        return await this.provider.destroy();
    }

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

    async registerMedication(medication: Medication): Promise<void> {
        return await this.provider.registerMedication(medication);
    }
}
