import { DatabaseProvider } from "./database/DatabaseProvider";
import { MongoDBService } from "./database/services/MongoDBService";
import { MySQLService } from "./database/services/MySQLService";
import { DatabaseProviderType } from "./types/DatabaseProviderType";
import { Logger } from "./utils/Logger";

export function databaseFactory(
    databaseProvider: DatabaseProviderType,
    mongoDbUri: string,
    mongoDbDatabaseName: string,
    mysqlHost: string,
    mysqlPort: number,
    mysqlUserName: string,
    mysqlPassword: string,
    mysqlDatabaseName: string,
): DatabaseProvider {
    if (!databaseProvider) {
        Logger.warn(`No database provider setted, using default ${DatabaseProviderType.DEFAULT} provider`, { databaseProvider, this: this });
        databaseProvider = DatabaseProviderType.DEFAULT;
    }

    if (databaseProvider === DatabaseProviderType.MONGODB) {
        return new DatabaseProvider(new MongoDBService(mongoDbUri, mongoDbDatabaseName));
    } else if (databaseProvider === DatabaseProviderType.MYSQL) {
        return new DatabaseProvider(new MySQLService(mysqlHost, mysqlPort, mysqlUserName, mysqlPassword, mysqlDatabaseName));
    }
}
