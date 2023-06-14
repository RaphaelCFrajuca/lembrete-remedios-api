import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("medications")
export class MedicationEntity {
    @Column()
    principioAtivo: string;

    @Column()
    laboratorioCnpj: string;

    @Column()
    laboratorioNome: string;

    @Column()
    laboratorioRegistro: number;

    @PrimaryColumn()
    nome: string;

    @Column()
    apresentacao: string;

    @Column()
    classeTerapeutica: string;

    @Column()
    tipo: string;

    @Column()
    precoFabrica: string;

    @Column()
    precoConsumidor0: string;

    @Column()
    precoConsumidor12: string;

    @Column()
    precoConsumidor17: string;

    @Column()
    precoConsumidor20: string;

    @Column()
    restricaoHospitalar: "SIM" | "NAO";

    @Column()
    tarja: string;
}
