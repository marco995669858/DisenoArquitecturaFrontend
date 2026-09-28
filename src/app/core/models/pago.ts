export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA';

export interface PagoDTO {
    idPago?: number;
    idLiquidacion?: number;
    numeroUnidad?: string;
    periodo?: string;
    idUsuario?: number;
    nombreUsuario?: string;
    fechaPago?: string;
    montoPagado?: number;
    metodoPago?: MetodoPago;
    numeroVoucher?: string;
    rutaEvidencia?: string;
}

export interface PagoRequest {
    idPago?: number;
    idLiquidacion?: number;
    fechaPago?: string;
    montoPagado?: number;
    metodoPago?: MetodoPago;
    numeroVoucher?: string;
    rutaEvidencia?: string;
}
