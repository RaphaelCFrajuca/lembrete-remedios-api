import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";

export class DatabaseProvider implements Database {
    constructor(private readonly provider: Database) {}

    async getMedicationsList(): Promise<Medication[]> {
        return await this.provider.getMedicationsList();
    }
}
