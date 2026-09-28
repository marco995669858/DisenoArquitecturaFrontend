import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment.development';
import { UsuarioDecodificado } from '../models/UsuarioDecodificado';
import { LoginRequest, Token, VerificarMfaRequest } from '../models/login';
import { ApiResponse } from '../models/apiResponse';
import { PermisosService } from './permisos-service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.URL_BACKEND}auth`;
    private permisosService = inject(PermisosService);

    // SIGNAL PRIVADO: Guarda el usuario actual. Inicia en null.
    private usuarioSignal = signal<UsuarioDecodificado | null>(null);

    // SIGNALS PÚBLICOS (Computados): Para que los componentes reaccionen
    public usuarioActual = computed(() => this.usuarioSignal());
    public estaAutenticado = computed(() => this.usuarioSignal() !== null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.cargarUsuarioDesdeStorage();
    }

    // 1. Método para llamar a tu backend
    login(credenciales: LoginRequest) {
        return this.http.post<ApiResponse<Token>>(`${this.apiUrl}/login`, credenciales);
    }

    /** Segundo paso del login cuando login() devolvió mfaRequerido o mfaSetupRequerido. */
    verificarMfa(args: VerificarMfaRequest) {
        return this.http.post<ApiResponse<Token>>(`${this.apiUrl}/mfa/verificar`, args);
    }

    // 2. Método para guardar el token y actualizar el Signal
    guardarToken(token: string, refreshToken: string) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        const decodificado = jwtDecode<UsuarioDecodificado>(token);
        this.usuarioSignal.set(decodificado);
        this.permisosService.precargar();
    }

    // 3. Método para cerrar sesión de forma segura
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        this.usuarioSignal.set(null);
        this.permisosService.limpiar();
        this.router.navigate(['/auth/login']);
    }

    // 4. Utilidad para obtener el string del token
    obtenerToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    // Carga inicial al refrescar la página (F5)
    private cargarUsuarioDesdeStorage() {
        const token = this.obtenerToken();
        if (token) {
            try {
                const decodificado = jwtDecode<UsuarioDecodificado>(token);
                // Validamos si el token no ha expirado (exp está en segundos, Date en ms)
                if (decodificado.exp * 1000 > Date.now()) {
                    this.usuarioSignal.set(decodificado);
                    this.permisosService.precargar();
                } else {
                    this.logout(); // Token expirado
                }
            } catch (error) {
                this.logout(); // Token inválido
            }
        }
    }

    //
    refrescarToken() {
        const refreshToken = this.obtenerRefreshToken();

        // Llamamos a un endpoint de tu backend (que crearemos luego)
        return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/refresh`, { token: refreshToken });
    }

    obtenerRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }
}
