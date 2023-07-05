import { Test } from "@nestjs/testing";
import { MedicationsService } from "../../src/services/MedicationsService";
import { DatabaseProvider } from "../../src/database/DatabaseProvider";

describe("MedicationsService (unit)", () => {
    let medicationsService: MedicationsService;
    let databaseProvider: DatabaseProvider;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                MedicationsService,
                {
                    provide: "DATABASE_SERVICE",
                    useValue: {
                        getMedicationsList: jest.fn(),
                    },
                },
            ],
        }).compile();

        medicationsService = moduleRef.get<MedicationsService>(MedicationsService);
        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
    });

    it("should get medication list", async () => {
        const mockMedicationsList = [{ value: "DIPIRONA", label: "DIPIRONA" }];
        jest.spyOn(databaseProvider, "getMedicationsList").mockResolvedValue(mockMedicationsList);
        jest.spyOn(console, "log").mockImplementation(() => null);

        const result = await medicationsService.getMedicationsList();

        expect(databaseProvider.getMedicationsList).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockMedicationsList);
    });
});
