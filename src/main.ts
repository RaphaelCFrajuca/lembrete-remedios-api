import { NestFactory } from "@nestjs/core";
import { LembreteRemediosModule } from "./LembreteRemediosModule";
import * as dotenv from "dotenv";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(LembreteRemediosModule);
    app.enableCors();
    app.getHttpServer().keepAliveTimeout = 700 * 1000;
    await app.listen(Number(process.env.PORT) || 8080);
}
bootstrap();
