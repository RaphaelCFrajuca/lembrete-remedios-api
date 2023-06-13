import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./EnvironmentModule";
import { MongoDBService } from "./database/services/MongoDBService";
import { DatabaseProvider } from "./database/DatabaseProvider";
import { databaseFactory } from "./ModuleFactorys";
import { MedicationsController } from "./controllers/medications/MedicationsController";
import { MedicationsService } from "./controllers/medications/MedicationsService";

@Module({
    imports: [EnvironmentModule],
    controllers: [MedicationsController],
    providers: [
        DatabaseProvider,
        MongoDBService,
        MedicationsService,
        {
            provide: "DATABASE_SERVICE",
            useFactory: databaseFactory,
            inject: ["DATABASE_PROVIDER", "MONGODB_URI", "MONGODB_DATABASE_NAME", "MYSQL_HOST", "MYSQL_PORT", "MYSQL_USERNAME", "MYSQL_PASSWORD", "MYSQL_DATABASE_NAME"],
        },
    ],
})
export class LembreteRemediosModule {}
