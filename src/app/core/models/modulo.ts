/** Un modulo (pantalla) del catalogo asignable como permiso a un rol. Ver ModuloSistemaDTO en el backend. */
export interface ModuloSistemaDTO {
    idModulo?: number;
    codigo: string;
    nombre: string;
}

export type NivelAcceso = 'LECTURA' | 'ESCRITURA';

/** Un permiso concreto: modulo + nivel de acceso. Ver PermisoAsignadoDTO en el backend. */
export interface PermisoAsignado {
    codigo: string;
    nivelAcceso: NivelAcceso;
}
