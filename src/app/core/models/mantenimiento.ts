export type TipoGasto = 'MATERIAL' | 'MANO_DE_OBRA' | 'AMBOS';

export interface MantenimientoDTO {
    idMantenimiento?: number;
    idUnidad?: number;
    numeroUnidad?: string;
    ubicacion?: string;
    idUsuario?: number;
    nombreUsuario?: string;
    descripcion?: string;
    fechaMantenimiento?: string;
    tipoGasto?: TipoGasto;
    proveedor?: string;
    montoMateriales?: number;
    montoManoObra?: number;
    monto?: number;
    imputableInquilino?: boolean;
}

export interface MantenimientoRequest {
    idMantenimiento?: number;
    idUnidad?: number;
    ubicacion?: string;
    descripcion?: string;
    fechaMantenimiento?: string;
    tipoGasto?: TipoGasto;
    proveedor?: string;
    montoMateriales?: number;
    montoManoObra?: number;
    monto?: number;
    imputableInquilino?: boolean;
}
