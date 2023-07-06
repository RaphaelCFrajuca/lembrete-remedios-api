import { HttpStatus, Inject } from "@nestjs/common";
import { MedicationEntity } from "../entities/MedicationEntity";
import { DataSource } from "typeorm";
import { Database } from "interfaces/DatabaseInterface";
import { Medication } from "interfaces/MedicationInterface";
import { UserEntity, UserEntityMongo } from "../entities/UserEntity";
import { User } from "interfaces/UserInterface";
import { CustomException } from "utils/Errors/CustomException";
import { Logger } from "utils/Logger";
import { ReminderEntityMongo } from "../entities/ReminderEntity";
import { Reminder, ReminderUser } from "interfaces/ReminderInterface";

export class MongoDBService implements Database {
    constructor(@Inject("MONGODB_URI") private readonly mongoDbUri: string, @Inject("MONGODB_DATABASE_NAME") private readonly mongoDbDatabaseName: string) {}

    protected static dataSource: DataSource;

    async getNames(email: string): Promise<string[]> {
        const names = [];
        const reminders = await this.getReminders(email);
        reminders?.map(item => {
            names.push(item.name);
        });
        return names;
    }

    async getAllReminders(): Promise<Reminder[]> {
        const mongoManager = await this.getDataSource();
        const users = await mongoManager.getMongoRepository(ReminderEntityMongo).find();
        return users;
    }

    async getReminders(email: string): Promise<ReminderUser[] | null> {
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
        const { nickname, name, picture, email, email_verified, phone, reminderChannel } = user;
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(UserEntityMongo).update({ email: user.email }, { nickname, name, picture, email, email_verified, phone, reminderChannel });
        Logger.log(`User ${user.email} updated`, user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const mongoManager = await this.getDataSource();
        const user = await mongoManager.getMongoRepository(UserEntityMongo).findOneBy({ email });
        return user ?? null;
    }

    async getMedicationsList(): Promise<Medication[]> {
        const mongoManager = await this.getDataSource();
        const medicationList = await mongoManager.getMongoRepository(MedicationEntity).find();
        return medicationList
            .map(medication => ({ value: medication.nome, label: medication.nome, ...medication }))
            .filter((value, index, self) => {
                return index === self.findIndex(obj => obj.value === value.value && obj.label === value.label);
            });
    }

    async registerMedication(medication: Medication): Promise<void> {
        const mongoManager = await this.getDataSource();
        await mongoManager.getMongoRepository(MedicationEntity).save(medication);
        Logger.log(`Medication ${medication.label} registered`, medication);
    }

    async getDataSource(): Promise<DataSource> {
        if (!MongoDBService.dataSource) {
            MongoDBService.dataSource = new DataSource({
                type: "mongodb",
                url: this.mongoDbUri,
                entities: [MedicationEntity, UserEntity, UserEntityMongo, ReminderEntityMongo],
                synchronize: false,
                logging: false,
                database: this.mongoDbDatabaseName,
            });
        }
        return MongoDBService.dataSource.isInitialized ? MongoDBService.dataSource : MongoDBService.dataSource.initialize();
    }

    async destroy(): Promise<void> {
        const mongoManager = await this.getDataSource();
        await mongoManager.destroy();
    }
}
