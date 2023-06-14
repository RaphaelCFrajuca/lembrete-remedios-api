import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Logger } from "src/utils/Logger";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private jwtService: JwtService, @Inject("JWT_PUBLIC_CERT") private readonly jwtPublicCert: string) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            Logger.error(`No JWT token provided`, request);
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.jwtPublicCert,
            });
            request["user"] = payload;
            Logger.log(`User ${payload.email} authenticated`, request);
        } catch {
            Logger.error(`Unauthorized`, request);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
