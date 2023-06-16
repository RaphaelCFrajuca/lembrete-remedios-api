import { NestFactory } from "@nestjs/core";
import { LembreteRemediosModule } from "./LembreteRemediosModule";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(LembreteRemediosModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.getHttpServer().keepAliveTimeout = 700 * 1000;
    await app.listen(Number(process.env.PORT) || 8080);
}
bootstrap();
