import { Module } from "@nestjs/common";

@Module({
    providers: [
        {
            provide: "DATABASE_PROVIDER",
            useValue: "FAKE-MYSQL",
        },
    ],
    exports: ["DATABASE_PROVIDER"],
})
export class EnvironmentModuleFake {}
