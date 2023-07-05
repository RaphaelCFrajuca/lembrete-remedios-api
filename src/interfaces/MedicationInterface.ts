export interface Medication {
    value: string;
    label: string;
    principioAtivo?: string;
    laboratorioCnpj?: string;
    laboratorioNome?: string;
    laboratorioRegistro?: number;
    nome?: string;
    apresentacao?: string;
    classeTerapeutica?: string;
    tipo?: string;
    precoFabrica?: string;
    precoConsumidor0?: string;
    precoConsumidor12?: string;
    precoConsumidor17?: string;
    precoConsumidor20?: string;
    restricaoHospitalar?: "SIM" | "NAO";
    tarja?: string;
}
