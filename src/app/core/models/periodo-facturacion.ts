export type EstadoPeriodo = 'EN_PROGRESO' | 'COMPLETO' | 'LIQUIDADO';

export interface PeriodoFacturacionDTO {
    idPeriodo?: number;
    periodo?: string;
    estado?: EstadoPeriodo;
}

export interface PeriodoFacturacionRequest {
    idPeriodo?: number;
    periodo?: string;
    estado?: EstadoPeriodo;
}
