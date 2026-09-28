import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { CalcularProrrateoRequest, ProrrateoDTO, ProrrateoRequest } from '../models/prorrateo';

@Injectable({
    providedIn: 'root'
})
export class ProrrateoService {
    private url = environment.URL_BACKEND + 'prorrateo/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<ProrrateoDTO[]>>(`${this.url}listar`);
    }

    /** CU-05 -- calcula el consumo y prorratea el excedente comun para un periodo y servicio. */
    calcular(params: CalcularProrrateoRequest) {
        return this.http.post<ApiResponse<ProrrateoDTO[]>>(`${this.url}calcular`, params);
    }

    insertarActualizar(params: ProrrateoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: ProrrateoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
