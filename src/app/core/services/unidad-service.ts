import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { UnidadDTO, UnidadRequest } from '../models/unidad';

@Injectable({
    providedIn: 'root'
})
export class UnidadService {
    private url = environment.URL_BACKEND + 'unidad/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<UnidadDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: UnidadRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: UnidadRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
