import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./modules/EnvironmentModule";
import { MedicationsController } from "./controllers/medications/MedicationsController";
import { MedicationsService } from "./controllers/medications/MedicationsService";
import { DatabaseModule } from "./modules/DatabaseModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule],
    controllers: [MedicationsController],
    providers: [MedicationsService],
})
export class LembreteRemediosModule {}
