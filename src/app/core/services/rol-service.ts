import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { RolDTO, RolRequest } from '../models/rol';
import { PermisoAsignado } from '../models/modulo';

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private url = environment.URL_BACKEND + 'rol/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<RolDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: RolRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: RolRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }

    /** Permisos (modulo + nivel de acceso) que tiene asignados un rol, para precargar el formulario al editar. */
    obtenerPermisos(idRol: number) {
        return this.http.get<ApiResponse<PermisoAsignado[]>>(`${this.url}permisos/${idRol}`);
    }
}
