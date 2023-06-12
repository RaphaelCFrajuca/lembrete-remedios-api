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
    ],
    exports: ["MONGODB_URI", "MONGODB_DATABASE_NAME"],
})
export class EnvironmentModule {}
