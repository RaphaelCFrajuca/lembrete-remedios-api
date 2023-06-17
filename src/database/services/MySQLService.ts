import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";
import { DataSource } from "typeorm";
import { MedicationEntity } from "../entities/MedicationEntity";
import { HttpStatus, Inject } from "@nestjs/common";
import { User } from "src/interfaces/UserInterface";
import { UserEntity } from "../entities/UserEntity";
import { CustomException } from "src/utils/Errors/CustomException";
import { Logger } from "src/utils/Logger";
import { Reminder, ReminderUser } from "src/interfaces/ReminderInterface";
import { ReminderEntity, ReminderEntityMySQL } from "../entities/ReminderEntity";

export class MySQLService implements Database {
    constructor(
        @Inject("MYSQL_HOST") private readonly hostName: string,
        @Inject("MYSQL_PORT") private readonly port: number,
        @Inject("MYSQL_USERNAME") private readonly userName: string,
        @Inject("MYSQL_PASSWORD") private readonly password: string,
        @Inject("MYSQL_DATABASE_NAME") private readonly databaseName: string,
    ) {}

    async getAllReminders(): Promise<Reminder[]> {
        const mysqlManager = await this.getDataSource();
        const users = (await mysqlManager.getRepository(ReminderEntityMySQL).find()).map(user => {
            return {
                email: user.email,
                reminders: JSON.parse(user.reminders),
            };
        });
        return users;
    }

    async getReminders(email: string): Promise<ReminderUser[]> {
        const mysqlManager = await this.getDataSource();
        const reminders = await mysqlManager.getRepository(ReminderEntityMySQL).findOneBy({ email });
        console.log(reminders?.reminders);
        return reminders?.reminders ? JSON.parse(reminders?.reminders) : null;
    }

    async newReminders(reminders: ReminderUser[], email: string): Promise<void> {
        const mysqlManager = await this.getDataSource();
        await mysqlManager.getRepository(ReminderEntityMySQL).save({ reminders: JSON.stringify(reminders), email });
        Logger.log(`Reminders of ${email} saved`, reminders);
    }

    async updateReminders(reminders: ReminderUser[], email: string): Promise<void> {
        const mysqlManager = await this.getDataSource();
        await mysqlManager.getRepository(ReminderEntityMySQL).update({ email }, { reminders: JSON.stringify(reminders), email });
        Logger.log(`Reminders of ${email} updated`, reminders);
    }

    async deleteReminders(reminders: ReminderUser[], email: string): Promise<void> {
        const mysqlManager = await this.getDataSource();
        await mysqlManager.getRepository(ReminderEntityMySQL).delete({ email });
        Logger.log(`Reminders of ${email} deleted`, reminders);
    }

    async deleteUser(email: string): Promise<void> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new CustomException(`User ${email} not exists`, HttpStatus.NOT_FOUND);
        }
        const mysqlManager = await this.getDataSource();
        await mysqlManager.getRepository(UserEntity).remove(user);
        Logger.log(`User ${user.email} deleted`, user);
    }

    async registerUser(user: User): Promise<void> {
        const mysqlManager = await this.getDataSource();
        await mysqlManager.getRepository(UserEntity).save(user);
        Logger.log(`User ${user.email} registered`, user);
    }

    async updateUser(user: User): Promise<void> {
        const { nickname, name, picture, email, email_verified } = user;
        const mysqlManager = await this.getDataSource();
        await mysqlManager.getRepository(UserEntity).update({ email: user.email }, { nickname, name, picture, email, email_verified });
        Logger.log(`User ${user.email} updated`, user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const mysqlManager = await this.getDataSource();
        return await mysqlManager.getRepository(UserEntity).findOneBy({ email });
    }

    async getMedicationsList(): Promise<Medication[]> {
        const mysqlManager = await this.getDataSource();
        const medicationList = await mysqlManager.getRepository(MedicationEntity).find();
        return medicationList
            .map(medication => ({ value: medication.nome, label: medication.nome }))
            .filter((value, index, self) => {
                return index === self.findIndex(obj => obj.value === value.value && obj.label === value.label);
            });
    }

    async getDataSource(): Promise<DataSource> {
        const dataSource = new DataSource({
            type: "mysql",
            host: this.hostName,
            port: this.port,
            username: this.userName,
            password: this.password,
            entities: [MedicationEntity, UserEntity, ReminderEntity, ReminderEntityMySQL],
            synchronize: false,
            logging: false,
            database: this.databaseName,
        });
        return await dataSource.initialize();
    }
}
