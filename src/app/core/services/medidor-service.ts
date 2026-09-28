import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { MedidorDTO, MedidorRequest } from '../models/medidor';

@Injectable({
    providedIn: 'root'
})
export class MedidorService {
    private url = environment.URL_BACKEND + 'medidor/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<MedidorDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: MedidorRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: MedidorRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
