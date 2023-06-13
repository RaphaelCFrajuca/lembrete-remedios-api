import { Inject } from "@nestjs/common";
import { Medications } from "../entities/MedicationsEntity";
import { DataSource } from "typeorm";
import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";

export class MongoDBService implements Database {
    constructor(@Inject("MONGODB_URI") private readonly mongoDbUri: string, @Inject("MONGODB_DATABASE_NAME") private readonly mongoDbDatabaseName: string) {}

    async getMedicationsList(): Promise<Medication[]> {
        const mongoManager = await this.getDataSource();
        const medicationList = await mongoManager.getMongoRepository(Medications).find();
        return medicationList
            .map(medication => ({ value: medication.nome, label: medication.nome }))
            .filter((value, index, self) => {
                return index === self.findIndex(obj => obj.value === value.value && obj.label === value.label);
            });
    }

    async getDataSource(): Promise<DataSource> {
        const dataSource = new DataSource({
            type: "mongodb",
            url: this.mongoDbUri,
            entities: [Medications],
            synchronize: false,
            logging: false,
            database: this.mongoDbDatabaseName,
        });
        return await dataSource.initialize();
    }
}
