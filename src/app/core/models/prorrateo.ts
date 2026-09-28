import { TipoServicio } from './medidor';

export interface ProrrateoDTO {
    idProrrateo?: number;
    idUnidad?: number;
    numeroUnidad?: string;
    periodo?: string;
    tipoServicio?: TipoServicio;
    consumoIndividual?: number;
    consumoComunAsignado?: number;
    costoUnitario?: number;
    montoCalculado?: number;
}

export interface CalcularProrrateoRequest {
    periodo?: string;
    tipoServicio?: TipoServicio;
}

export interface ProrrateoRequest {
    idProrrateo?: number;
    idUnidad?: number;
    periodo?: string;
    tipoServicio?: TipoServicio;
    consumoIndividual?: number;
    consumoComunAsignado?: number;
    costoUnitario?: number;
    montoCalculado?: number;
}
