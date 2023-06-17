import { HttpStatus, Inject } from "@nestjs/common";
import { MedicationEntity } from "../entities/MedicationEntity";
import { DataSource } from "typeorm";
import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";
import { UserEntity, UserEntityMongo } from "../entities/UserEntity";
import { User } from "src/interfaces/UserInterface";
import { CustomException } from "src/utils/Errors/CustomException";
import { Logger } from "src/utils/Logger";
import { ReminderEntityMongo } from "../entities/ReminderEntity";
import { Reminder, ReminderUser } from "src/interfaces/ReminderInterface";

export class MongoDBService implements Database {
    constructor(@Inject("MONGODB_URI") private readonly mongoDbUri: string, @Inject("MONGODB_DATABASE_NAME") private readonly mongoDbDatabaseName: string) {}

    async getAllReminders(): Promise<Reminder[]> {
        const mongoManager = await this.getDataSource();
        const users = await mongoManager.getMongoRepository(ReminderEntityMongo).find();
        return users;
    }

    async getReminders(email: string): Promise<ReminderUser[]> {
        const mongoManager = await this.getDataSource();
        const reminders = await mongoManager.getMongoRepository(ReminderEntityMongo).findOneBy({ email });
        return reminders?.reminders ?? null;
    }

    async newReminders(reminders: ReminderUser[], email: string): Promise<void> {
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(ReminderEntityMongo).save({ reminders: reminders as ReminderUser[], email });
        Logger.log(`Reminders of ${email} saved`, reminders);
    }

    async updateReminders(reminders: ReminderUser[], email: string): Promise<void> {
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(ReminderEntityMongo).update({ email }, { reminders: reminders as ReminderUser[], email });
        Logger.log(`Reminders of ${email} updated`, reminders);
    }

    async deleteReminders(reminders: ReminderUser[], email: string): Promise<void> {
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(ReminderEntityMongo).delete({ email });
        Logger.log(`Reminders of ${email} deleted`, reminders);
    }

    async deleteUser(email: string): Promise<void> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new CustomException(`User ${email} not exists`, HttpStatus.NOT_FOUND);
        }
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(UserEntityMongo).remove(user);
        Logger.log(`User ${user.email} deleted`, user);
    }

    async registerUser(user: User): Promise<void> {
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(UserEntityMongo).save(user);
        Logger.log(`User ${user.email} registered`, user);
    }

    async updateUser(user: User): Promise<void> {
        const { nickname, name, picture, email, email_verified } = user;
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(UserEntityMongo).update({ email: user.email }, { nickname, name, picture, email, email_verified });
        Logger.log(`User ${user.email} updated`, user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const mongoManager = await this.getDataSource();
        return await mongoManager.getMongoRepository(UserEntityMongo).findOneBy({ email });
    }

    async getMedicationsList(): Promise<Medication[]> {
        const mongoManager = await this.getDataSource();
        const medicationList = await mongoManager.getMongoRepository(MedicationEntity).find();
        return medicationList
            .map(medication => ({ value: medication.nome, label: medication.nome }))
            .filter((value, index, self) => {
                return index === self.findIndex(obj => obj.value === value.value && obj.label === value.label);
            });
    }

    async getDataSource(): Promise<DataSource> {
        const dataSource = new DataSource({
            type: "mongodb",
            url: this.mongoDbUri,
            entities: [MedicationEntity, UserEntity, UserEntityMongo, ReminderEntityMongo],
            synchronize: false,
            logging: false,
            database: this.mongoDbDatabaseName,
        });
        return await dataSource.initialize();
    }
}
