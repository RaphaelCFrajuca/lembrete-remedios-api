import { channelFactory } from "ModuleFactorys";
import { EnvironmentModule } from "./EnvironmentModule";
import { Module } from "@nestjs/common";
import { ChannelProvider } from "channels/ChannelProvider";
import { DatabaseModule } from "./DatabaseModule";

@Module({
    imports: [EnvironmentModule, DatabaseModule],
    providers: [
        ChannelProvider,
        {
            provide: "CHANNEL_SERVICE",
            useFactory: channelFactory,
            inject: [
                "EMAIL_CHANNEL_PROVIDER",
                "SMS_CHANNEL_PROVIDER",
                "VOICEMAIL_CHANNEL_PROVIDER",
                "BREVO_API_KEY",
                "BREVO_API_URL",
                "MOBIZON_API_KEY",
                "MOBIZON_API_URL",
                "NVOIP_SID",
                "NVOIP_USER_TOKEN",
                "NVOIP_API_URL",
                "AMAZON_SES_CREDENTIALS",
            ],
        },
    ],
    exports: ["CHANNEL_SERVICE"],
})
export class ChannelModule {}
