import { Inject } from "@nestjs/common";
import { Medications } from "../entities/MedicationsEntity";
import { DataSource } from "typeorm";

export class MongoDBService {
    constructor(@Inject("MONGODB_URI") private readonly mongoDbUri: string) {}

    async returnConfig(): Promise<DataSource> {
        const dataSource = new DataSource({
            type: "mongodb",
            url: this.mongoDbUri,
            entities: [Medications],
            synchronize: false,
            logging: true,
            database: "lembrete-remedios",
        });
        return await dataSource.initialize();
    }
}
