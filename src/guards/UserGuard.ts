import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Logger } from "src/utils/Logger";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private jwtService: JwtService, @Inject("JWT_PUBLIC_CERT") private readonly jwtPublicCert: string) {}

    formatMultilineCert(cert: string): string {
        cert = cert.replace("-----BEGIN PUBLIC KEY-----", "");
        cert = cert.replace("-----END PUBLIC KEY-----", "");
        cert = cert.trim();

        const lines = cert.match(/.{1,64}/g) || [];
        const formattedCert = "-----BEGIN PUBLIC KEY-----\n" + lines.join("\n") + "\n-----END PUBLIC KEY-----";
        return formattedCert;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            Logger.error(`No JWT token provided`, [request, this]);
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.formatMultilineCert(this.jwtPublicCert),
            });
            request["user"] = payload;
            Logger.log(`User ${payload.email} authenticated`, [request, this]);
        } catch {
            Logger.error(`Unauthorized`, [request, this]);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
