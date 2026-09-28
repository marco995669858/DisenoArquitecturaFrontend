export interface InquilinoDTO {
    idInquilino?: number;
    tipoDocumento?: string;
    numeroDocumento?: string;
    nombreCompleto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
}

export interface InquilinoRequest {
    idInquilino?: number;
    tipoDocumento?: string;
    numeroDocumento?: string;
    nombreCompleto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
}
