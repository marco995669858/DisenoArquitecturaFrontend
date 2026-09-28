export type EstadoUnidad = 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';

export interface UnidadDTO {
    idUnidad?: number;
    piso?: number;
    numeroUnidad?: string;
    areaM2?: number;
    caracteristicas?: string;
    estado?: EstadoUnidad;
}

export interface UnidadRequest {
    idUnidad?: number;
    piso?: number;
    numeroUnidad?: string;
    areaM2?: number;
    caracteristicas?: string;
    estado?: EstadoUnidad;
}
