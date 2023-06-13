import { Medication } from "./MedicationInterface";

export interface Database {
    getMedicationsList(): Promise<Medication[]>;
}
