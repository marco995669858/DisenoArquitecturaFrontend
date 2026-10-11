import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { PermisoAsignado } from '../models/modulo';

/**
 * Los modulos que un usuario puede ver -- y si ademas puede crear/editar/
 * eliminar en ellos o solo consultarlos -- ya no estan fijos en el codigo
 * (arreglos de ROLE_X por ruta): dependen de los permisos que el
 * Administrador le asigno al rol de ese usuario desde la pantalla Roles (ver
 * modulo_sistema / rol_permiso en el backend, con su nivel_acceso). Este
 * servicio los trae una sola vez por sesion y los deja en un signal para que
 * el menu, las rutas y los botones de cada pantalla los consulten sin
 * repetir la llamada al backend en cada navegacion.
 *
 * Ocultar los botones aca es solo la mitad de la restriccion: el backend
 * (PermisoAccessFilter) rechaza de verdad cualquier POST de escritura si el
 * nivel es LECTURA, asi que esto no es una medida de seguridad por si sola,
 * es la parte que evita que un usuario de solo lectura vea botones que de
 * todas formas el servidor le va a rechazar.
 */
@Injectable({
    providedIn: 'root'
})
export class PermisosService {
    private url = environment.URL_BACKEND + 'usuario/mis-permisos';
    private http = inject(HttpClient);

    private permisosSignal = signal<PermisoAsignado[]>([]);
    private cargados = false;
    private cargaEnCurso: Observable<PermisoAsignado[]> | null = null;

    permisos = computed(() => this.permisosSignal());

    /** Trae los permisos del backend si todavia no se cargaron en esta sesion; si ya estan, los devuelve directo. */
    obtenerPermisos(): Observable<PermisoAsignado[]> {
        if (this.cargados) {
            return of(this.permisosSignal());
        }
        if (this.cargaEnCurso) {
            return this.cargaEnCurso;
        }

        this.cargaEnCurso = this.http.get<ApiResponse<PermisoAsignado[]>>(this.url).pipe(
            map((respuesta) => respuesta.data ?? []),
            tap((permisos) => {
                this.permisosSignal.set(permisos);
                this.cargados = true;
                this.cargaEnCurso = null;
            }),
            // Sin esto, un fallo (ej. backend caido) dejaba cargaEnCurso
            // apuntando para siempre a este observable ya fallido: con
            // shareReplay, cualquier pantalla que pidiera permisos despues
            // -- aunque el backend ya hubiera vuelto -- recibia el mismo
            // error en bucle, sin reintentar nunca.
            catchError((error) => {
                this.cargaEnCurso = null;
                return throwError(() => error);
            }),
            shareReplay(1)
        );
        return this.cargaEnCurso;
    }

    private buscar(codigoModulo: string): PermisoAsignado | undefined {
        return this.permisosSignal().find((p) => p.codigo === codigoModulo);
    }

    /** ¿Puede ver este modulo? (cualquier nivel, LECTURA o ESCRITURA). */
    tienePermiso(codigoModulo: string): boolean {
        return this.buscar(codigoModulo) !== undefined;
    }

    /** ¿Puede crear, editar o eliminar en este modulo, o solo consultarlo? */
    puedeEscribir(codigoModulo: string): boolean {
        return this.buscar(codigoModulo)?.nivelAcceso === 'ESCRITURA';
    }

    /** Se llama al iniciar sesion o al cargar la app: precarga los permisos sin bloquear la navegacion. */
    precargar(): void {
        this.obtenerPermisos().subscribe();
    }

    /** Se llama al cerrar sesion, para que el proximo usuario que entre no herede los permisos del anterior. */
    limpiar(): void {
        this.permisosSignal.set([]);
        this.cargados = false;
        this.cargaEnCurso = null;
    }
}
