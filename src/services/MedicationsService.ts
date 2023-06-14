import { Inject } from "@nestjs/common";
import { DatabaseProvider } from "src/database/DatabaseProvider";
import { Medication } from "src/interfaces/MedicationInterface";
import { Logger } from "src/utils/Logger";

export class MedicationsService {
    constructor(@Inject("DATABASE_SERVICE") private readonly databaseService: DatabaseProvider) {}

    async getMedicationsList(): Promise<Medication[]> {
        Logger.log(`Get medications list`, { this: this });
        return await this.databaseService.getMedicationsList();
    }
}
