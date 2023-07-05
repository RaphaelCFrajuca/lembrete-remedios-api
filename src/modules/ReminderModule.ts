import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./EnvironmentModule";
import { DatabaseModule } from "./DatabaseModule";
import { ReminderService } from "services/ReminderService";
import { UserGuard } from "guards/UserGuard";
import { UserModule } from "./UserModule";
import { ReminderController } from "controllers/reminder/ReminderController";
import { ChannelModule } from "./ChannelModule";
import { PubSubModule } from "./PubSubModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule, UserModule, ChannelModule, PubSubModule],
    controllers: [ReminderController],
    providers: [ReminderService, UserGuard],
})
export class ReminderModule {}
