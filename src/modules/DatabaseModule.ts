import { databaseFactory } from "ModuleFactorys";
import { EnvironmentModule } from "./EnvironmentModule";
import { DatabaseProvider } from "database/DatabaseProvider";
import { Module } from "@nestjs/common";

@Module({
    imports: [EnvironmentModule],
    providers: [
        DatabaseProvider,
        {
            provide: "DATABASE_SERVICE",
            useFactory: databaseFactory,
            inject: ["DATABASE_PROVIDER", "MONGODB_URI", "MONGODB_DATABASE_NAME", "MYSQL_HOST", "MYSQL_PORT", "MYSQL_USERNAME", "MYSQL_PASSWORD", "MYSQL_DATABASE_NAME"],
        },
    ],
    exports: ["DATABASE_SERVICE"],
})
export class DatabaseModule {}
