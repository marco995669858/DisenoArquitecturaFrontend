export interface TipoConsultaDTO {
    idTipoConsulta?: number;
    nombre?: string;
    duracionEstimadaMinutos?: number;
    precioBase?: number;
}

export interface TipoConsultaRequest {
    idTipoConsulta?: number;
    nombre?: string;
    duracionEstimadaMinutos?: number;
    precioBase?: number;
    usuario?: string;
}
