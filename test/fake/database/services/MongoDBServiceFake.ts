import { MedicationEntity } from "database/entities/MedicationEntity";
import { ReminderEntityMongo } from "database/entities/ReminderEntity";
import { UserEntity, UserEntityMongo } from "database/entities/UserEntity";
import { MongoDBService } from "database/services/MongoDBService";
import { DataSource } from "typeorm";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoDBServiceFake extends MongoDBService {
    private static mongoServer: MongoMemoryServer;

    async getDataSource(): Promise<DataSource> {
        if (MongoDBService.dataSource === undefined) {
            MongoDBServiceFake.mongoServer = await MongoMemoryServer.create();
            MongoDBService.dataSource = new DataSource({
                type: "mongodb",
                url: MongoDBServiceFake.mongoServer.getUri(),
                entities: [MedicationEntity, UserEntity, UserEntityMongo, ReminderEntityMongo],
                synchronize: true,
                logging: false,
                database: "lembrete-remedios",
            });
        }
        return MongoDBService.dataSource.isInitialized ? MongoDBService.dataSource : MongoDBService.dataSource.initialize();
    }

    async destroy(): Promise<void> {
        const mongoManager = MongoDBService.dataSource;
        if (mongoManager !== undefined) {
            await mongoManager.destroy();
            await MongoDBServiceFake.mongoServer.stop();
        }
    }
}
