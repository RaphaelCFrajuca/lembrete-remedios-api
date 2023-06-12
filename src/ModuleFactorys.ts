import { MongoDBService } from "./database/services/MongoDBService";

export function databaseFactory(mongoDbUri: string): MongoDBService {
    return new MongoDBService(mongoDbUri);
}
