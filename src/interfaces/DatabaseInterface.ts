import { Medication } from "./MedicationInterface";
import { User } from "./UserInterface";

export interface Database {
    getMedicationsList(): Promise<Medication[]>;
    findUserByEmail(email: string): Promise<User | null>;
    registerUser(user: User): Promise<void>;
    deleteUser(email: string): Promise<void>;
    updateUser(user: User): Promise<void>;
}
