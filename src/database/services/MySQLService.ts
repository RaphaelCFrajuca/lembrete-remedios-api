import { Database } from "src/interfaces/DatabaseInterface";
import { Medication } from "src/interfaces/MedicationInterface";
import { DataSource } from "typeorm";
import { Medications } from "../entities/MedicationsEntity";
import { Inject } from "@nestjs/common";

export class MySQLService implements Database {
    constructor(
        @Inject("MYSQL_HOST") private readonly hostName: string,
        @Inject("MYSQL_PORT") private readonly port: number,
        @Inject("MYSQL_USERNAME") private readonly userName: string,
        @Inject("MYSQL_PASSWORD") private readonly password: string,
        @Inject("MYSQL_DATABASE_NAME") private readonly databaseName: string,
    ) {}

    async getMedicationsList(): Promise<Medication[]> {
        const mysqlManager = await this.getDataSource();
        const medicationList = await mysqlManager.getRepository(Medications).find();
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
            entities: [Medications],
            synchronize: false,
            logging: false,
            database: this.databaseName,
        });
        return await dataSource.initialize();
    }
}
