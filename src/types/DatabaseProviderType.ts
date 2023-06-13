import { MongoDBService } from "src/database/services/MongoDBService";
import { MySQLService } from "src/database/services/MySQLService";

export enum DatabaseProviderType {
    MONGODB = "MONGODB",
    MYSQL = "MYSQL",
    DEFAULT = MONGODB,
}

export const DatabaseProviderMap = {
    [DatabaseProviderType.MONGODB]: {
        service: MongoDBService,
        factory: (args: any[]) => new MongoDBService(args[0], args[1]),
    },
    [DatabaseProviderType.MYSQL]: {
        service: MySQLService,
        factory: (args: any[]) => new MySQLService(args[2], args[3], args[4], args[5], args[6]),
    },
};
