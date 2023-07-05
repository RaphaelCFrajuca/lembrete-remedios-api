import { MedicationEntity } from "database/entities/MedicationEntity";
import { ReminderEntity, ReminderEntityMySQL } from "database/entities/ReminderEntity";
import { UserEntity } from "database/entities/UserEntity";
import { DataSource } from "typeorm";
import { MySQLService } from "database/services/MySQLService";

export class SQLiteServiceFake extends MySQLService {
    async getDataSource(): Promise<DataSource> {
        if (!MySQLService.dataSource) {
            MySQLService.dataSource = new DataSource({
                type: "sqlite",
                entities: [MedicationEntity, UserEntity, ReminderEntity, ReminderEntityMySQL],
                synchronize: true,
                logging: false,
                database: ":memory:",
            });
        }
        return MySQLService.dataSource.isInitialized ? MySQLService.dataSource : MySQLService.dataSource.initialize();
    }

    async destroy(): Promise<void> {
        const mysqlManager = MySQLService.dataSource;
        if (mysqlManager !== undefined) {
            await mysqlManager.destroy();
        }
    }
}
