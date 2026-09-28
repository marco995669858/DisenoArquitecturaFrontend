import { TipoServicio } from './medidor';

export interface ReciboServicioDTO {
    idRecibo?: number;
    periodo?: string;
    tipoServicio?: TipoServicio;
    montoTotal?: number;
    fechaEmision?: string;
    fechaVencimiento?: string;
    rutaDocumento?: string;
}

export interface ReciboServicioRequest {
    idRecibo?: number;
    periodo?: string;
    tipoServicio?: TipoServicio;
    montoTotal?: number;
    fechaEmision?: string;
    fechaVencimiento?: string;
    rutaDocumento?: string;
}
