import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./EnvironmentModule";
import { DatabaseModule } from "./DatabaseModule";
import { ReminderService } from "src/services/ReminderService";
import { UserGuard } from "src/guards/UserGuard";
import { UserModule } from "./UserModule";
import { ReminderController } from "src/controllers/reminder/ReminderController";
import { ChannelModule } from "./ChannelModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule, ChannelModule],
    controllers: [ReminderController],
    providers: [ReminderService, UserGuard],
})
export class ReminderModule {}
