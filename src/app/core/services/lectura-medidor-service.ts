import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { LecturaMedidorDTO, LecturaMedidorRequest } from '../models/lectura-medidor';

@Injectable({
    providedIn: 'root'
})
export class LecturaMedidorService {
    private url = environment.URL_BACKEND + 'lectura-medidor/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<LecturaMedidorDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: LecturaMedidorRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: LecturaMedidorRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
