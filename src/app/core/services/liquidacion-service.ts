import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { GenerarLiquidacionRequest, GenerarLiquidacionResultDTO, LiquidacionDTO, LiquidacionRequest } from '../models/liquidacion';

@Injectable({
    providedIn: 'root'
})
export class LiquidacionService {
    private url = environment.URL_BACKEND + 'liquidacion/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<LiquidacionDTO[]>>(`${this.url}listar`);
    }

    /** CU-06 -- compone y emite la liquidacion de cada unidad con contrato vigente para un periodo. */
    generar(params: GenerarLiquidacionRequest) {
        return this.http.post<ApiResponse<GenerarLiquidacionResultDTO>>(`${this.url}generar`, params);
    }

    insertarActualizar(params: LiquidacionRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: LiquidacionRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
