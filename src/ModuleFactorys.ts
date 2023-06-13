import { DatabaseProvider } from "./database/DatabaseProvider";
import { DatabaseProviderMap, DatabaseProviderType } from "./types/DatabaseProviderType";
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
    const provider = DatabaseProviderMap[databaseProvider];
    return new DatabaseProvider(provider.factory([mongoDbUri, mongoDbDatabaseName, mysqlHost, mysqlPort, mysqlUserName, mysqlPassword, mysqlDatabaseName]));
}
