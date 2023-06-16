import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./EnvironmentModule";
import { DatabaseModule } from "./DatabaseModule";
import { UserGuard } from "src/guards/UserGuard";
import { UserModule } from "./UserModule";
import { MedicationsController } from "src/controllers/medications/MedicationsController";
import { MedicationsService } from "src/services/MedicationsService";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule],
    controllers: [MedicationsController],
    providers: [MedicationsService, UserGuard],
})
export class MedicationsModule {}
