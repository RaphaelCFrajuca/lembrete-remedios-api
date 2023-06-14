import { Controller, Get, UseGuards } from "@nestjs/common";
import { MedicationsService } from "../../services/MedicationsService";
import { Medication } from "src/interfaces/MedicationInterface";
import { UserGuard } from "src/guards/UserGuard";

@Controller("medications")
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) {}

    @Get()
    @UseGuards(UserGuard)
    async getMedicationsList(): Promise<Medication[]> {
        return await this.medicationsService.getMedicationsList();
    }
}
