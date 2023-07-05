import { Controller, Get, UseGuards } from "@nestjs/common";
import { MedicationsService } from "../../services/MedicationsService";
import { Medication } from "interfaces/MedicationInterface";
import { UserGuard } from "guards/UserGuard";

@Controller("medications")
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) {}

    @Get()
    @UseGuards(UserGuard)
    async getMedicationsList(): Promise<Medication[]> {
        return await this.medicationsService.getMedicationsList();
    }
}
