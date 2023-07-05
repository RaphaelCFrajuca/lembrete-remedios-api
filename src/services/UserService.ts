import { HttpStatus, Inject } from "@nestjs/common";
import { DatabaseProvider } from "database/DatabaseProvider";
import { User } from "interfaces/UserInterface";
import { CustomException } from "utils/Errors/CustomException";
import { Logger } from "utils/Logger";

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
        await this.databaseService.registerUser(user);
        return {
            status: "success",
            code: HttpStatus.CREATED,
            message: `User ${user.email} registered`,
        };
    }

    async updateUser(user: User) {
        Logger.log(`Updating user (${user.email})`, this);
        await this.databaseService.updateUser(user);
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
