import { Controller, Get } from "@nestjs/common";
import { MedicationsService } from "./MedicationsService";

@Controller("medications")
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) {}

    @Get()
    async getMedicationsList(): Promise<{ value: string; label: string }[]> {
        return await this.medicationsService.getMedicationsList();
    }
}
