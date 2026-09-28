import { TipoServicio } from './medidor';

export interface LecturaMedidorDTO {
    idLectura?: number;
    idMedidor?: number;
    numeroSerie?: string;
    tipoServicio?: TipoServicio;
    numeroUnidad?: string;
    idUsuario?: number;
    periodo?: string;
    lecturaAnterior?: number;
    lecturaActual?: number;
    consumo?: number;
    fechaLectura?: string;
}

export interface LecturaMedidorRequest {
    idLectura?: number;
    idMedidor?: number;
    periodo?: string;
    lecturaAnterior?: number;
    lecturaActual?: number;
    fechaLectura?: string;
}
