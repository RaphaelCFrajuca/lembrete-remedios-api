import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserGuard } from "guards/UserGuard";
import * as request from "supertest";
import { EnvironmentModuleFake } from "../fake/environment/EnvironmentModuleFake";
import { MedicationsService } from "services/MedicationsService";
import { DatabaseModuleFake } from "../fake/database/DatabaseModuleFake";
import { MedicationsController } from "controllers/medications/MedicationsController";
import { DatabaseProvider } from "database/DatabaseProvider";
import { Medication } from "interfaces/MedicationInterface";

describe("MedicationsController (e2e)", () => {
    let app: INestApplication;
    let databaseProvider: DatabaseProvider;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [EnvironmentModuleFake, DatabaseModuleFake],
            controllers: [MedicationsController],
            providers: [MedicationsService],
        })
            .overrideGuard(UserGuard)
            .useValue({ canActivate: () => true })
            .compile();
        app = moduleRef.createNestApplication();
        await app.init();
        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
    });

    afterAll(async () => {
        await app.close();
        await databaseProvider.destroy();
    });

    describe("/medications", () => {
        it("should get medication list", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const mockMedicationsList: Medication[] = [
                {
                    value: "DIPIRONA",
                    label: "DIPIRONA",
                    apresentacao: "",
                    classeTerapeutica: "",
                    laboratorioCnpj: "",
                    laboratorioNome: "",
                    laboratorioRegistro: 0,
                    nome: "DIPIRONA",
                    precoFabrica: "",
                    precoConsumidor0: "",
                    precoConsumidor12: "",
                    precoConsumidor17: "",
                    precoConsumidor20: "",
                    restricaoHospitalar: "NAO",
                    tarja: "",
                    tipo: "",
                    principioAtivo: "",
                },
                {
                    value: "PARACETAMOL",
                    label: "PARACETAMOL",
                    apresentacao: "",
                    classeTerapeutica: "",
                    laboratorioCnpj: "",
                    laboratorioNome: "",
                    laboratorioRegistro: 0,
                    nome: "PARACETAMOL",
                    precoFabrica: "",
                    precoConsumidor0: "",
                    precoConsumidor12: "",
                    precoConsumidor17: "",
                    precoConsumidor20: "",
                    restricaoHospitalar: "NAO",
                    tarja: "",
                    tipo: "",
                    principioAtivo: "",
                },
                {
                    value: "NIMESULIDA",
                    label: "NIMESULIDA",
                    apresentacao: "",
                    classeTerapeutica: "",
                    laboratorioCnpj: "",
                    laboratorioNome: "",
                    laboratorioRegistro: 0,
                    nome: "NIMESULIDA",
                    precoFabrica: "",
                    precoConsumidor0: "",
                    precoConsumidor12: "",
                    precoConsumidor17: "",
                    precoConsumidor20: "",
                    restricaoHospitalar: "NAO",
                    tarja: "",
                    tipo: "",
                    principioAtivo: "",
                },
            ];

            for (const medication of mockMedicationsList) {
                await databaseProvider.registerMedication(medication);
            }

            const response = await request(app.getHttpServer()).get("/medications");
            expect(response.body).toEqual(mockMedicationsList);
        });
    });
});
