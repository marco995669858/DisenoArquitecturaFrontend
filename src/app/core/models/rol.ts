import { PermisoAsignado } from './modulo';

export interface RolDTO {
    idRol?: number;
    nombre?: string;
}

export interface RolRequest {
    idRol?: number;
    nombre?: string;
    /** Modulos que este rol puede ver, cada uno con su nivel de acceso (ver ControllerRol.listarPermisosDeRol). */
    permisos?: PermisoAsignado[];
}
