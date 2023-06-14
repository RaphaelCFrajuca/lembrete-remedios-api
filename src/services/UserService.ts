import { HttpStatus, Inject } from "@nestjs/common";
import { DatabaseProvider } from "src/database/DatabaseProvider";
import { User } from "src/interfaces/UserInterface";
import { CustomException } from "src/utils/Errors/CustomException";
import { Logger } from "src/utils/Logger";

export class UserService {
    constructor(@Inject("DATABASE_SERVICE") private readonly databaseService: DatabaseProvider) {}

    async findByEmail(email: string) {
        Logger.log(`Finding user by ${email} email`, this);
        return await this.databaseService.findUserByEmail(email);
    }

    async registerUser(user: User) {
        Logger.log(`Registering new user (${user.email})`, this);
        const userAlreadyRegistered = await this.findByEmail(user.email);
        if (userAlreadyRegistered) {
            Logger.warn(`User ${user.email} error when trying to register`, user);
            throw new CustomException("Email Already registered", HttpStatus.CONFLICT);
        }
        return await this.databaseService.registerUser(user);
    }

    async updateUser(user: User) {
        Logger.log(`Updating user (${user.email})`, this);
        await this.databaseService.registerUser(user);
        return {
            status: "success",
            code: HttpStatus.ACCEPTED,
            message: `User ${user.email} updated`,
        };
    }

    async deleteUser(email: string) {
        Logger.log(`Removing user (${email})`, this);
        await this.databaseService.deleteUser(email);
        return {
            status: "success",
            code: HttpStatus.OK,
            message: `User ${email} deleted`,
        };
    }
}
