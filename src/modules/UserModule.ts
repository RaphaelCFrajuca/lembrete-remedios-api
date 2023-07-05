import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentModule } from "./EnvironmentModule";
import { UserService } from "services/UserService";
import { UserController } from "controllers/user/UserController";
import { UserGuard } from "guards/UserGuard";
import { DatabaseModule } from "./DatabaseModule";

@Module({
    imports: [
        EnvironmentModule,
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [EnvironmentModule],
            useFactory: (jwtPublicCert: string) => ({
                publicKey: jwtPublicCert,
            }),
            inject: ["JWT_PUBLIC_CERT"],
        }),
        JwtModule,
    ],
    providers: [UserService, UserGuard],
    controllers: [UserController],
    exports: [JwtModule],
})
export class UserModule {}
