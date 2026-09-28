export type EstadoContrato = 'VIGENTE' | 'VENCIDO' | 'RENOVADO' | 'FINALIZADO';

export interface ContratoDTO {
    idContrato?: number;
    idUnidad?: number;
    numeroUnidad?: string;
    idInquilino?: number;
    nombreInquilino?: string;
    fechaInicio?: string;
    fechaFin?: string;
    montoAlquiler?: number;
    rutaContratoDigital?: string;
    estado?: EstadoContrato;
}

/** Resultado de RN-03 / CU-03a -- ver ControllerContrato.alertasVencimiento. */
export interface ContratoPorVencerDTO {
    idContrato?: number;
    numeroUnidad?: string;
    nombreInquilino?: string;
    fechaFin?: string;
    diasParaVencer?: number;
}

export interface AlertaVencimientoResultDTO {
    contratosMarcadosVencidos?: number;
    contratosPorVencer?: ContratoPorVencerDTO[];
}

export interface ContratoRequest {
    idContrato?: number;
    idUnidad?: number;
    idInquilino?: number;
    fechaInicio?: string;
    fechaFin?: string;
    montoAlquiler?: number;
    rutaContratoDigital?: string;
    estado?: EstadoContrato;
}

/** CU-03b -- ver ControllerContrato.renovarContrato. Los campos opcionales, si se omiten, se heredan del contrato actual. */
export interface RenovarContratoRequest {
    idContrato: number;
    nuevaFechaFin: string;
    nuevoMontoAlquiler?: number | null;
    nuevaRutaContratoDigital?: string | null;
}

export interface RenovarContratoResultDTO {
    idContratoAnterior?: number;
    idContratoNuevo?: number;
    numeroUnidad?: string;
    nombreInquilino?: string;
    nuevaFechaFin?: string;
}
