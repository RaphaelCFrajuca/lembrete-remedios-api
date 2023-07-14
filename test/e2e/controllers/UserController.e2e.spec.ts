import { INestApplication, ExecutionContext, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DatabaseProvider } from "database/DatabaseProvider";
import { UserGuard } from "guards/UserGuard";
import { User } from "interfaces/UserInterface";
import * as request from "supertest";
import { ChannelProviderType } from "types/ChannelProviderType";
import { DatabaseModuleFake } from "../../fake/database/DatabaseModuleFake";
import { EnvironmentModuleFake } from "../../fake/environment/EnvironmentModuleFake";
import { UserController } from "controllers/user/UserController";
import { UserService } from "services/UserService";
import { HttpStatusCode } from "axios";

describe("UserController (e2e)", () => {
    let app: INestApplication;
    let databaseProvider: DatabaseProvider;

    const mockUser: User = {
        nickname: "Test User",
        name: "Test User",
        reminderChannel: ChannelProviderType.DEFAULT,
        given_name: "Test",
        family_name: "User",
        locale: "pt-BR",
        picture: "https://fake.com/fake.png",
        email: "fake@fake.com",
        phone: "5511999999999",
        email_verified: true,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [EnvironmentModuleFake, DatabaseModuleFake],
            controllers: [UserController],
            providers: [UserService],
        })
            .overrideGuard(UserGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const request = context.switchToHttp().getRequest();
                    const user = {
                        given_name: "Test",
                        family_name: "User",
                        nickname: "testuser",
                        name: "Test User",
                        picture: "http://fake.com/fake.png",
                        locale: "pt-BR",
                        updated_at: "2023-07-05T02:09:16.822Z",
                        email: "fake@fake.com",
                        email_verified: true,
                        iss: "http://fake.com/",
                        aud: "hjdjvghKHJVNDSKJVN",
                        iat: 1688614543,
                        exp: 1688650543,
                        sub: "google-oauth2|54285734968437698428572",
                        sid: "dskjgldsgn",
                        nonce: "gfjdshgiksduhgdskgjhsdfbksd",
                    };
                    request["user"] = user;
                    return true;
                },
            })
            .compile();
        app = moduleRef.createNestApplication();
        app.enableCors();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );
        await app.init();
        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
    });

    afterEach(async () => {
        await app.close();
        await databaseProvider.destroy();
    });

    describe("/user", () => {
        it("should return the user", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);
            const response = await request(app.getHttpServer()).get("/user").query({
                email: mockUser.email,
            });
            expect(response.body).toEqual(mockUser);
        });

        it("should return the user when not passing email in query", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);
            const response = await request(app.getHttpServer()).get("/user");
            expect(response.body).toEqual(mockUser);
        });

        it("should not return the user when email not exist", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);
            const response = await request(app.getHttpServer()).get("/user").query({
                email: "fake-not-exists@fake.com",
            });
            expect(response.body).toEqual({
                statusCode: HttpStatusCode.NotFound,
                message: "User fake-not-exists@fake.com not exists",
            });
        });
    });

    describe("/user/validate", () => {
        it("should return true when user exists", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);
            const response = await request(app.getHttpServer()).get("/user/validate").query({
                email: mockUser.email,
            });
            expect(response.body).toEqual({ userFound: true });
        });

        it("should return true when user exists and not passing email in query", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);
            const response = await request(app.getHttpServer()).get("/user/validate");
            expect(response.body).toEqual({ userFound: true });
        });

        it("should return user not exists when user not exists", async () => {
            jest.spyOn(console, "warn").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);
            const response = await request(app.getHttpServer()).get("/user/validate").query({
                email: "fake-not-exists@fake.com",
            });
            expect(response.body).toEqual({
                statusCode: HttpStatusCode.NotFound,
                message: "User fake-not-exists@fake.com not exists",
            });
        });
    });

    describe("/user/new", () => {
        it("should create new user", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const response = await request(app.getHttpServer()).post("/user/new").send(mockUser);
            expect(response.body).toEqual({ message: "User fake@fake.com registered", status: "success" });
        });

        it("should not create a new user when user already exists", async () => {
            jest.spyOn(console, "warn").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);

            const response = await request(app.getHttpServer()).post("/user/new").send(mockUser);
            expect(response.body).toEqual({ message: "Email Already registered", statusCode: HttpStatusCode.Conflict });
        });
    });

    describe("/user/update", () => {
        it("should update an existing user", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);

            const response = await request(app.getHttpServer()).put("/user/update").send(mockUser);
            expect(response.body).toEqual({ message: "User fake@fake.com updated", status: "success" });
        });

        it("should not update an existing user when user not exists", async () => {
            jest.spyOn(console, "warn").mockImplementation(() => null);

            const response = await request(app.getHttpServer()).put("/user/update").send(mockUser);
            expect(response.body).toEqual({ message: "Email Not registered", statusCode: HttpStatusCode.Conflict });
        });
    });

    describe("/user/delete", () => {
        it("should delete an existing user", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.registerUser(mockUser);

            const response = await request(app.getHttpServer()).delete("/user/delete").send(mockUser);
            expect(response.body).toEqual({ message: "User fake@fake.com deleted", status: "success" });
        });

        it("should not update an existing user when user not exists", async () => {
            jest.spyOn(console, "warn").mockImplementation(() => null);

            const response = await request(app.getHttpServer()).delete("/user/delete").send(mockUser);
            expect(response.body).toEqual({ message: "Email Not registered", statusCode: HttpStatusCode.Conflict });
        });
    });
});
