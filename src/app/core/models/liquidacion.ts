export type EstadoLiquidacion = 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'VENCIDO';

export interface LiquidacionDTO {
    idLiquidacion?: number;
    idContrato?: number;
    numeroUnidad?: string;
    nombreInquilino?: string;
    periodo?: string;
    montoAlquiler?: number;
    montoLuz?: number;
    montoAgua?: number;
    montoOtros?: number;
    montoTotal?: number;
    fechaEmision?: string;
    fechaVencimiento?: string;
    estado?: EstadoLiquidacion;
}

export interface GenerarLiquidacionRequest {
    periodo?: string;
}

export interface LiquidacionGeneradaDTO {
    idLiquidacion?: number;
    idContrato?: number;
    numeroUnidad?: string;
    nombreInquilino?: string;
    periodo?: string;
    montoAlquiler?: number;
    montoLuz?: number;
    montoAgua?: number;
    montoOtros?: number;
    montoTotal?: number;
}

export interface GenerarLiquidacionResultDTO {
    generadas?: LiquidacionGeneradaDTO[];
    excepciones?: string[];
    omitidas?: string[];
    advertencias?: string[];
}

export interface LiquidacionRequest {
    idLiquidacion?: number;
    idContrato?: number;
    periodo?: string;
    montoAlquiler?: number;
    montoLuz?: number;
    montoAgua?: number;
    montoOtros?: number;
    fechaEmision?: string;
    fechaVencimiento?: string;
    estado?: EstadoLiquidacion;
}
