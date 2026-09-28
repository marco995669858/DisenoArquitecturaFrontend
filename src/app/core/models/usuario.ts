export type EstadoUsuario = 'ACTIVO' | 'INACTIVO';

export interface UsuarioDTO {
    idUsuario?: number;
    idRol?: number;
    nombreRol?: string;
    nombreUsuario?: string;
    nombreCompleto?: string;
    email?: string;
    estado?: EstadoUsuario;
}

/**
 * nombreUsuario no se puede editar (identifica al usuario para el login);
 * password solo se usa al crear -- para cambiar la clave de un usuario
 * existente se usa CambiarPasswordRequest, no este mismo objeto.
 */
export interface UsuarioRequest {
    idUsuario?: number;
    idRol?: number;
    nombreUsuario?: string;
    password?: string;
    nombreCompleto?: string;
    email?: string;
    estado?: EstadoUsuario;
}

export interface CambiarPasswordRequest {
    idUsuario?: number;
    passwordNueva?: string;
}

/** Cambio de la propia contraseña (cualquier usuario autenticado); exige la actual, a diferencia de CambiarPasswordRequest (uso exclusivo del administrador). */
export interface CambiarMiPasswordRequest {
    passwordActual?: string;
    passwordNueva?: string;
}

export interface EstadoMfaDTO {
    mfaHabilitado: boolean;
    mfaConfirmado: boolean;
}

export interface MfaSetupDTO {
    secretoManual: string;
    otpAuthUri: string;
}

export interface CodigoMfaRequest {
    codigo?: string;
}
