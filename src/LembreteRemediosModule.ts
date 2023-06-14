import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./modules/EnvironmentModule";
import { MedicationsController } from "./controllers/medications/MedicationsController";
import { DatabaseModule } from "./modules/DatabaseModule";
import { MedicationsService } from "./services/MedicationsService";
import { UserModule } from "./modules/UserModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule],
    controllers: [MedicationsController],
    providers: [MedicationsService],
})
export class LembreteRemediosModule {}
