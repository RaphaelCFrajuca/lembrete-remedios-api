import { MongoDBService } from "./database/services/MongoDBService";

export function databaseFactory(mongoDbUri: string, mongoDbDatabaseName: string): MongoDBService {
    return new MongoDBService(mongoDbUri, mongoDbDatabaseName);
}
