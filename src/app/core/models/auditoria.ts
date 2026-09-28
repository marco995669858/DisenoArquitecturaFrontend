export interface EventoAuditoriaDTO {
    fecha: string;
    accion: 'CREACION' | 'ACTUALIZACION' | 'ELIMINACION';
    entidad: string;
    descripcion: string;
    nombreUsuario: string;
    ip: string;
}
