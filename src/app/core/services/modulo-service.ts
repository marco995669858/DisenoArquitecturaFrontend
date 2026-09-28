import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { ModuloSistemaDTO } from '../models/modulo';

@Injectable({
    providedIn: 'root'
})
export class ModuloService {
    private url = environment.URL_BACKEND + 'modulo/';
    private http = inject(HttpClient);

    /** Catalogo completo de modulos asignables como permiso a un rol (ver pantalla Roles). */
    listar() {
        return this.http.get<ApiResponse<ModuloSistemaDTO[]>>(`${this.url}listar`);
    }
}
