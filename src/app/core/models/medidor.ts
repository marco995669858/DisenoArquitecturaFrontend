export type TipoServicio = 'LUZ' | 'AGUA';
export type TipoMedidor = 'INDIVIDUAL' | 'GENERAL';

export interface MedidorDTO {
    idMedidor?: number;
    idUnidad?: number;
    numeroUnidad?: string;
    tipoServicio?: TipoServicio;
    tipoMedidor?: TipoMedidor;
    numeroSerie?: string;
}

export interface MedidorRequest {
    idMedidor?: number;
    idUnidad?: number;
    tipoServicio?: TipoServicio;
    tipoMedidor?: TipoMedidor;
    numeroSerie?: string;
}
