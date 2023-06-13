import { Controller, Get } from "@nestjs/common";
import { MedicationsService } from "./MedicationsService";
import { Medication } from "src/interfaces/MedicationInterface";

@Controller("medications")
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) {}

    @Get()
    async getMedicationsList(): Promise<Medication[]> {
        return await this.medicationsService.getMedicationsList();
    }
}
