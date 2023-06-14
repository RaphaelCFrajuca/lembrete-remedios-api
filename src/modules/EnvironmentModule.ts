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
    ],
})
export class EnvironmentModule {}
