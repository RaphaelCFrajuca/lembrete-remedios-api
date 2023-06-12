import { Inject } from "@nestjs/common";
import { Medications } from "src/database/entities/MedicationsEntity";
import { MongoDBService } from "src/database/services/MongoDBService";

export class MedicationsService {
    constructor(@Inject("DATABASE_SERVICE") private readonly databaseService: MongoDBService) {}
    async getMedicationsList(): Promise<{ value: string; label: string }[]> {
        const mongoManager = await this.databaseService.returnConfig();
        const medicationList = await mongoManager.getMongoRepository(Medications).find();
        return medicationList
            .map(medication => ({ value: medication.nome, label: medication.nome }))
            .filter((value, index, self) => {
                return index === self.findIndex(obj => obj.value === value.value && obj.label === value.label);
            });
    }
}
