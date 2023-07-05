import { DatabaseProvider } from "database/DatabaseProvider";
import { Module } from "@nestjs/common";
import { EnvironmentModuleFake } from "../environment/EnvironmentModuleFake";
import { MongoDBServiceFake } from "./services/MongoDBServiceFake";
import { SQLiteServiceFake } from "./services/SQLiteServiceFake";

@Module({
    imports: [EnvironmentModuleFake],
    providers: [
        DatabaseProvider,
        {
            provide: "DATABASE_SERVICE",
            useFactory: (databaseProvider: string) => {
                switch (databaseProvider) {
                    case "FAKE-MONGODB":
                        return new MongoDBServiceFake(null, null);
                    case "FAKE-MYSQL":
                        return new SQLiteServiceFake(null, null, null, null, null);
                    default:
                        throw new Error("Invalid database provider");
                }
            },
            inject: ["DATABASE_PROVIDER"],
        },
    ],
    exports: ["DATABASE_SERVICE"],
})
export class DatabaseModuleFake {}
