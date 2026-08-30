export interface TipoDocumentoDTO{
    idTipoDocumento?:number;
    nombre?:string;
    abreviatura?:string;
}

export interface TipoDocumentoRequest{
    idTipoDocumento?:number;
    nombre?:string;
    abreviatura?:string;
    usuario?:string;
}
