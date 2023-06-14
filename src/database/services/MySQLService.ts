import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";
import { DataSource } from "typeorm";
import { MedicationEntity } from "../entities/MedicationEntity";
import { HttpStatus, Inject } from "@nestjs/common";
import { User } from "src/interfaces/UserInterface";
import { UserEntity } from "../entities/UserEntity";
import { CustomException } from "src/utils/Errors/CustomException";
import { Logger } from "src/utils/Logger";

export class MySQLService implements Database {
    constructor(
        @Inject("MYSQL_HOST") private readonly hostName: string,
        @Inject("MYSQL_PORT") private readonly port: number,
        @Inject("MYSQL_USERNAME") private readonly userName: string,
        @Inject("MYSQL_PASSWORD") private readonly password: string,
        @Inject("MYSQL_DATABASE_NAME") private readonly databaseName: string,
    ) {}

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
            entities: [MedicationEntity, UserEntity],
            synchronize: false,
            logging: false,
            database: this.databaseName,
        });
        return await dataSource.initialize();
    }
}
