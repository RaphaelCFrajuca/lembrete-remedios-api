import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./EnvironmentModule";
import { DatabaseModule } from "./DatabaseModule";
import { UserGuard } from "guards/UserGuard";
import { UserModule } from "./UserModule";
import { MedicationsController } from "controllers/medications/MedicationsController";
import { MedicationsService } from "services/MedicationsService";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule],
    controllers: [MedicationsController],
    providers: [MedicationsService, UserGuard],
})
export class MedicationsModule {}
