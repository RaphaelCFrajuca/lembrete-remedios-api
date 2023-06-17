import { channelFactory } from "src/ModuleFactorys";
import { EnvironmentModule } from "./EnvironmentModule";
import { Module } from "@nestjs/common";
import { ChannelProvider } from "src/channels/ChannelProvider";
import { DatabaseModule } from "./DatabaseModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule],
    providers: [
        ChannelProvider,
        {
            provide: "CHANNEL_SERVICE",
            useFactory: channelFactory,
            inject: ["EMAIL_CHANNEL_PROVIDER", "SMS_CHANNEL_PROVIDER", "VOICEMAIL_CHANNEL_PROVIDER", "BREVO_API_KEY", "MOBIZON_API_KEY", "NVOIP_SID", "NVOIP_USER_TOKEN"],
        },
    ],
    exports: ["CHANNEL_SERVICE"],
})
export class ChannelModule {}
