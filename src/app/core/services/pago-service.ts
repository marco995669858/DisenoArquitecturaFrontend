import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { PagoDTO, PagoRequest } from '../models/pago';

@Injectable({
    providedIn: 'root'
})
export class PagoService {
    private url = environment.URL_BACKEND + 'pago/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<PagoDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: PagoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: PagoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
