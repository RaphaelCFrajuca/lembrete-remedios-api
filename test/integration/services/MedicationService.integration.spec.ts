import { Test } from "@nestjs/testing";
import { MedicationsService } from "../../../src/services/MedicationsService";
import { DatabaseProvider } from "../../../src/database/DatabaseProvider";
import { DatabaseModuleFake } from "../../fake/database/DatabaseModuleFake";
import { Medication } from "interfaces/MedicationInterface";

describe("MedicationsService (integration)", () => {
    let medicationsService: MedicationsService;
    let databaseProvider: DatabaseProvider;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DatabaseModuleFake],
            providers: [MedicationsService],
        }).compile();

        medicationsService = moduleRef.get<MedicationsService>(MedicationsService);
        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
    });

    afterAll(async () => {
        await databaseProvider.destroy();
    });

    describe("getMedicationsList", () => {
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

            const result = await medicationsService.getMedicationsList();
            expect(result).toEqual(mockMedicationsList);
        });
    });
});
