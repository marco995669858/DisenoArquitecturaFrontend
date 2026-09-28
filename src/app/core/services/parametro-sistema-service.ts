import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { ParametroSistemaDTO, ParametroSistemaRequest } from '../models/parametro-sistema';

@Injectable({
    providedIn: 'root'
})
export class ParametroSistemaService {
    private url = environment.URL_BACKEND + 'parametro-sistema/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<ParametroSistemaDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: ParametroSistemaRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: ParametroSistemaRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
