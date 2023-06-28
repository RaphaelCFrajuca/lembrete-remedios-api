import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ".env" })],
    providers: [
        {
            provide: "MONGODB_URI",
            useValue: process.env.MONGODB_URI,
        },
        {
            provide: "MONGODB_DATABASE_NAME",
            useValue: process.env.MONGODB_DATABASE_NAME,
        },
        {
            provide: "DATABASE_PROVIDER",
            useValue: process.env.DATABASE_PROVIDER,
        },
        {
            provide: "MYSQL_HOST",
            useValue: process.env.MYSQL_HOST,
        },
        {
            provide: "MYSQL_PORT",
            useValue: process.env.MYSQL_PORT,
        },
        {
            provide: "MYSQL_USERNAME",
            useValue: process.env.MYSQL_USERNAME,
        },
        {
            provide: "MYSQL_PASSWORD",
            useValue: process.env.MYSQL_PASSWORD,
        },
        {
            provide: "MYSQL_DATABASE_NAME",
            useValue: process.env.MYSQL_DATABASE_NAME,
        },
        {
            provide: "JWT_PUBLIC_CERT",
            useValue: process.env.JWT_PUBLIC_CERT,
        },
        {
            provide: "PUBSUB_PROVIDER",
            useValue: process.env.PUBSUB_PROVIDER,
        },
        {
            provide: "GOOGLE_PUBSUB_TOPIC_NAME",
            useValue: process.env.GOOGLE_PUBSUB_TOPIC_NAME,
        },
        {
            provide: "AMAZON_PUBSUB_TOPIC_NAME",
            useValue: process.env.AMAZON_PUBSUB_TOPIC_NAME,
        },
        {
            provide: "AMAZON_CREDENTIALS",
            useValue: {
                region: process.env.AMAZON_REGION,
                accessKeyId: process.env.AMAZON_PUBSUB_ACCESS_KEY_ID,
                secretAccessKey: process.env.AMAZON_PUBSUB_SECRET_ACCESS_KEY,
            },
        },
        {
            provide: "EMAIL_CHANNEL_PROVIDER",
            useValue: process.env.EMAIL_CHANNEL_PROVIDER,
        },
        {
            provide: "SMS_CHANNEL_PROVIDER",
            useValue: process.env.SMS_CHANNEL_PROVIDER,
        },
        {
            provide: "VOICEMAIL_CHANNEL_PROVIDER",
            useValue: process.env.VOICEMAIL_CHANNEL_PROVIDER,
        },
        {
            provide: "BREVO_API_KEY",
            useValue: process.env.BREVO_API_KEY,
        },
        {
            provide: "MOBIZON_API_KEY",
            useValue: process.env.MOBIZON_API_KEY,
        },
        {
            provide: "NVOIP_SID",
            useValue: process.env.NVOIP_SID,
        },
        {
            provide: "NVOIP_USER_TOKEN",
            useValue: process.env.NVOIP_USER_TOKEN,
        },
        {
            provide: "BREVO_API_URL",
            useValue: process.env.BREVO_API_URL,
        },
        {
            provide: "MOBIZON_API_URL",
            useValue: process.env.MOBIZON_API_URL,
        },
        {
            provide: "NVOIP_API_URL",
            useValue: process.env.NVOIP_API_URL,
        },
    ],
    exports: [
        "MONGODB_URI",
        "MONGODB_DATABASE_NAME",
        "DATABASE_PROVIDER",
        "MYSQL_HOST",
        "MYSQL_PORT",
        "MYSQL_USERNAME",
        "MYSQL_PASSWORD",
        "MYSQL_DATABASE_NAME",
        "JWT_PUBLIC_CERT",
        "PUBSUB_PROVIDER",
        "GOOGLE_PUBSUB_TOPIC_NAME",
        "AMAZON_PUBSUB_TOPIC_NAME",
        "AMAZON_CREDENTIALS",
        "EMAIL_CHANNEL_PROVIDER",
        "SMS_CHANNEL_PROVIDER",
        "VOICEMAIL_CHANNEL_PROVIDER",
        "BREVO_API_KEY",
        "MOBIZON_API_KEY",
        "NVOIP_SID",
        "NVOIP_USER_TOKEN",
        "BREVO_API_URL",
        "MOBIZON_API_URL",
        "NVOIP_API_URL",
    ],
})
export class EnvironmentModule {}
