import { DatabaseProvider } from "database/DatabaseProvider";
import { User } from "interfaces/UserInterface";
import { UserService } from "services/UserService";
import { DatabaseModuleFake } from "../fake/database/DatabaseModuleFake";
import { ChannelProviderType } from "types/ChannelProviderType";
import { Test } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";

describe("UserService (integration)", () => {
    let databaseProvider: DatabaseProvider;
    let userService: UserService;

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

    async function createData() {
        jest.spyOn(console, "log").mockImplementation(() => null);
        await databaseProvider.registerUser(mockUser);
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DatabaseModuleFake],
            providers: [UserService],
        }).compile();

        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
        userService = moduleRef.get<UserService>(UserService);
        await createData();
    });

    afterAll(async () => {
        await databaseProvider.destroy();
    });

    describe("registerUser", () => {
        it("should register a new user", async () => {
            const user: User = {
                ...mockUser,
                email: "fake2@gmail.com",
                phone: "5511999999998",
            };

            const result = await userService.registerUser(user);

            expect(result).toEqual({
                status: "success",
                code: HttpStatus.CREATED,
                message: `User ${user.email} registered`,
            });
        });

        it("should throw an error if the user is already registered", async () => {
            jest.spyOn(console, "warn").mockImplementation(() => null);
            await expect(userService.registerUser(mockUser)).rejects.toThrow("Email Already registered");
        });
    });

    describe("updateUser", () => {
        it("should update an existing user", async () => {
            mockUser.name = "Updated";
            const result = await userService.updateUser(mockUser);

            expect(result).toEqual({
                status: "success",
                code: 202,
                message: `User ${mockUser.email} updated`,
            });
            expect((await databaseProvider.findUserByEmail(mockUser.email)).name).toEqual("Updated");
        });
    });

    describe("deleteUser", () => {
        it("should delete an existing user", async () => {
            const result = await userService.deleteUser(mockUser.email);

            expect(result).toEqual({
                status: "success",
                code: 200,
                message: `User ${mockUser.email} deleted`,
            });
            expect(await databaseProvider.findUserByEmail(mockUser.email)).toEqual(null);
        });
    });
});
