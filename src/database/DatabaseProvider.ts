import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";
import { User } from "src/interfaces/UserInterface";

export class DatabaseProvider implements Database {
    constructor(private readonly provider: Database) {}

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
