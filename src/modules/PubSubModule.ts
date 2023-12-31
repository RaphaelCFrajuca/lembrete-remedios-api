import { Module } from "@nestjs/common";
import { EnvironmentModule } from "./EnvironmentModule";
import { PubSubProvider } from "pubsub/PubSubProvider";
import { pubSubFactory } from "ModuleFactorys";

@Module({
    imports: [EnvironmentModule],
    providers: [
        PubSubProvider,
        {
            provide: "PUBSUB_SERVICE",
            useFactory: pubSubFactory,
            inject: ["PUBSUB_PROVIDER", "GOOGLE_PUBSUB_TOPIC_NAME", "AMAZON_PUBSUB_TOPIC_NAME", "AMAZON_CREDENTIALS"],
        },
    ],
    exports: ["PUBSUB_SERVICE"],
})
export class PubSubModule {}
