import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./modules/EnvironmentModule";
import { DatabaseModule } from "./modules/DatabaseModule";
import { UserModule } from "./modules/UserModule";
import { ReminderModule } from "./modules/ReminderModule";
import { MedicationsModule } from "./modules/MedicationsModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule, ReminderModule, MedicationsModule],
})
export class LembreteRemediosModule {}
