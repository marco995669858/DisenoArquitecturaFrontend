import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { CambiarMiPasswordRequest, CambiarPasswordRequest, CodigoMfaRequest, EstadoMfaDTO, MfaSetupDTO, UsuarioDTO, UsuarioRequest } from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private url = environment.URL_BACKEND + 'usuario/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<UsuarioDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: UsuarioRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    cambiarPassword(params: CambiarPasswordRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}cambiar-password`, params);
    }

    /** Cualquier usuario autenticado cambia su propia contraseña (exige la actual). */
    cambiarMiPassword(params: CambiarMiPasswordRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}cambiar-mi-password`, params);
    }

    eliminar(params: UsuarioRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }

    // --- MFA propio (cualquier rol administra el suyo desde su perfil) ---

    obtenerEstadoMiMfa() {
        return this.http.get<ApiResponse<EstadoMfaDTO>>(`${this.url}mfa/estado`);
    }

    activarMiMfa() {
        return this.http.post<ApiResponse<MfaSetupDTO>>(`${this.url}mfa/activar`, {});
    }

    confirmarMiMfa(params: CodigoMfaRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}mfa/confirmar`, params);
    }

    desactivarMiMfa(params: CodigoMfaRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}mfa/desactivar`, params);
    }

    /** Solo administrador: reinicia el MFA de otro usuario (p.ej. perdió el teléfono), sin pedirle un código. */
    resetearMfaDeUsuario(params: UsuarioRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}mfa/resetear`, params);
    }
}
