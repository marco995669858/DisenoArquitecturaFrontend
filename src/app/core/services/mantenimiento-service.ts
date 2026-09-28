import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { MantenimientoDTO, MantenimientoRequest } from '../models/mantenimiento';

@Injectable({
    providedIn: 'root'
})
export class MantenimientoService {
    private url = environment.URL_BACKEND + 'mantenimiento/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<MantenimientoDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: MantenimientoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: MantenimientoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
