export interface DetalleLiquidacionDTO {
    idDetalle?: number;
    idLiquidacion?: number;
    concepto?: string;
    monto?: number;
}

export interface DetalleLiquidacionRequest {
    idDetalle?: number;
    idLiquidacion?: number;
    concepto?: string;
    monto?: number;
}
