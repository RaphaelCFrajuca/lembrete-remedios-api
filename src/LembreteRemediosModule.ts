import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./modules/EnvironmentModule";
import { DatabaseModule } from "./modules/DatabaseModule";
import { UserModule } from "./modules/UserModule";
import { ReminderModule } from "./modules/ReminderModule";
import { MedicationsModule } from "./modules/MedicationsModule";
import { ChannelModule } from "./modules/ChannelModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule, ReminderModule, MedicationsModule, ChannelModule],
})
export class LembreteRemediosModule {}
