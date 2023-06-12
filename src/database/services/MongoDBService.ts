import { Inject } from "@nestjs/common";
import { Medications } from "../entities/MedicationsEntity";
import { DataSource } from "typeorm";

export class MongoDBService {
    constructor(@Inject("MONGODB_URI") private readonly mongoDbUri: string, @Inject("MONGODB_DATABASE_NAME") private readonly mongoDbDatabaseName: string) {}

    async returnConfig(): Promise<DataSource> {
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
