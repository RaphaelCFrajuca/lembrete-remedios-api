import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ".env" })],
    providers: [
        {
            provide: "MONGODB_URI",
            useValue: process.env.MONGODB_URI,
        },
    ],
    exports: ["MONGODB_URI"],
})
export class EnvironmentModule {}
